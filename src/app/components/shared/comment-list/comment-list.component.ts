import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Comment } from '../../../models/comment';
import { CommentService } from '../../../services/http/comment.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';
import { Message } from '@stomp/stompjs';
import { WsCommentServiceService } from '../../../services/websockets/ws-comment-service.service';
import { ClientAuthentication } from '../../../models/client-authentication';
import { Vote } from '../../../models/vote';
import { UserRole } from '../../../models/user-roles.enum';
import { Room } from '../../../models/room';
import { RoomService } from '../../../services/http/room.service';
import { VoteService } from '../../../services/http/vote.service';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { CorrectWrong } from '../../../models/correct-wrong.enum';
import { EventService } from '../../../services/util/event.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../../services/util/dialog.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { AnnounceService } from '../../../services/util/announce.service';
import { CommentSettingsService } from '../../../services/http/comment-settings.service';
import { KeyboardUtils } from '../../../utils/keyboard';
import { KeyboardKey } from '../../../utils/keyboard/keys';

// Using lowercase letters in enums because they we're also used for parsing incoming WS-messages

export enum Sort {
  VOTEASC = 'voteasc',
  VOTEDESC = 'votedesc',
  TIME = 'time'
}

enum Filter {
  READ = 'read',
  UNREAD = 'unread',
  FAVORITE = 'favorite',
  CORRECT = 'correct',
  WRONG = 'wrong',
  ACK = 'ack',
  TAG = 'tag',
  ANSWER = 'answer'
}

enum Period {
  ONEHOUR = 'time-1h',
  THREEHOURS = 'time-3h',
  ONEDAY = 'time-1d',
  ONEWEEK = 'time-1w',
  ALL = 'time-all'
}

export const itemRenderNumber = 20;

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy {
  @ViewChild('searchBox') searchField: ElementRef;
  @Input() auth: ClientAuthentication;
  @Input() comments$: Observable<Comment[]>;
  @Input() isModerator = false;
  @Input() isArchive = false;
  @Input() isPresentation = false;
  @Input() activeComment: Comment;
  @Output() updateActiveComment = new EventEmitter<Comment>();

  comments: Comment[] = [];
  roomId: string;
  viewRole: UserRole;
  room: Room;
  hideCommentsList = false;
  filteredComments: Comment[];
  deviceType: string;
  isLoading = true;
  currentSort: string;
  sorting = Sort;
  currentFilter: string;
  filtering = Filter;
  commentVoteMap = new Map<string, Vote>();
  scroll = false;
  scrollMax: number;
  scrollExtended = false;
  scrollExtendedMax = 500;
  searchInput = '';
  search = false;
  searchPlaceholder = '';
  moderationEnabled = false;
  directSend = true;
  thresholdEnabled = false;
  newestComment: Comment = new Comment();
  freeze = false;
  commentStream: Subscription;
  moderatorStream: Subscription;
  commentsFilteredByTime: Comment[] = [];
  displayComments: Comment[] = [];
  commentCounter = itemRenderNumber;
  referenceEvent: Subject<string> = new Subject<string>();
  periodsList = Object.values(Period);
  period: Period;
  scrollToTop = false;
  navBarExists = false;
  lastScroll = 0;
  scrollActive = false;

  constructor(
    private commentService: CommentService,
    private translateService: TranslateService,
    private dialogService: DialogService,
    protected langService: LanguageService,
    private wsCommentService: WsCommentServiceService,
    protected roomService: RoomService,
    protected voteService: VoteService,
    private notificationService: NotificationService,
    public eventService: EventService,
    public announceService: AnnounceService,
    private router: Router,
    protected route: ActivatedRoute,
    private globalStorageService: GlobalStorageService,
    private commentSettingsService: CommentSettingsService
  ) {
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.isPresentation) {
      if (KeyboardUtils.isKeyEvent(event, KeyboardKey.LEFT) === true) {
        this.prevComment();
      } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.RIGHT) === true) {
        this.nextComment();
      }
    }
  }

  ngOnInit() {
    const userId = this.auth?.userId;
    const lastSort = this.globalStorageService.getItem(STORAGE_KEYS.COMMENT_SORT);
    this.currentSort = this.isPresentation ? (lastSort && lastSort !== this.sorting.VOTEASC ? lastSort : this.sorting.TIME)
      : lastSort || this.sorting.VOTEDESC;
    this.period = this.globalStorageService.getItem(STORAGE_KEYS.COMMENT_TIME_FILTER) || Period.ALL;
    this.currentFilter = '';
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
    this.route.data.subscribe(data => {
      this.room = data.room;
      this.roomId = this.room.id;
      this.comments$.subscribe(comments => {
        this.comments = comments;
        this.initRoom();
      });
      this.viewRole = data.viewRole;
      if (this.viewRole === UserRole.PARTICIPANT) {
        this.voteService.getByRoomIdAndUserID(this.roomId, userId).subscribe(votes => {
          for (const v of votes) {
            this.commentVoteMap.set(v.commentId, v);
          }
        });
      }
    });
    this.translateService.get('comment-list.search').subscribe(msg => {
      this.searchPlaceholder = msg;
    });
    this.deviceType = innerWidth > 1000 ? 'desktop' : 'mobile';
    // Header height is 56 if smaller than 600px
    if (innerWidth >= 600) {
      this.scrollMax = 64;
    } else {
      this.scrollMax = 56;
    }
  }

  ngOnDestroy() {
    if (!this.freeze && this.commentStream) {
      this.commentStream.unsubscribe();
    }
    if (this.moderatorStream) {
      this.moderatorStream.unsubscribe();
    }
  }

  initRoom() {
    if (this.room && this.room.extensions && this.room.extensions.comments) {
      if (this.room.extensions.comments['enableModeration'] !== null) {
        this.moderationEnabled = this.room.extensions.comments['enableModeration'];
        this.globalStorageService.setItem(STORAGE_KEYS.MODERATION_ENABLED,
          this.room.extensions.comments['enableModeration']);
      }
      this.commentSettingsService.get(this.roomId).subscribe(commentSettings => {
        this.directSend = commentSettings.directSend;
      });
      this.getComments();
    }
    if (!this.isArchive) {
      this.subscribeCommentStream();
      if (this.isModerator) {
        this.subscribeModeratorStream();
      }
    }
  }

  checkIfNavBarExists(navBarExists: boolean) {
    this.navBarExists = navBarExists;
  }

  checkScroll(): void {
    const currentScroll = document.documentElement.scrollTop;
    this.scroll = currentScroll >= this.scrollMax;
    this.scrollActive = this.scroll && currentScroll < this.lastScroll;
    this.scrollExtended = currentScroll >= this.scrollExtendedMax;
    const length = this.hideCommentsList ? this.filteredComments.length : this.commentsFilteredByTime.length;
    if (this.displayComments.length !== length) {
      if (((window.innerHeight * 2) + window.scrollY) >= document.body.scrollHeight) {
        this.commentCounter += itemRenderNumber / 2;
        this.getDisplayComments();
      }
    }
    this.lastScroll = currentScroll;
  }

  scrollTop(smooth?: boolean) {
    const behavior = this.displayComments.length <= itemRenderNumber || smooth ? 'smooth' : 'auto';
    window.scrollTo({ top: 0, behavior: behavior });
  }

  searchComments(): void {
    if (this.searchInput) {
      if (this.searchInput.length > 2) {
        this.hideCommentsList = true;
        this.filteredComments = this.commentsFilteredByTime
          .filter(c => c.body.toLowerCase().includes(this.searchInput.toLowerCase()));
        this.getDisplayComments();
      }
    } else if (this.searchInput.length === 0 && this.currentFilter === '') {
      this.hideCommentsList = false;
      this.getDisplayComments();
    }
  }

  activateSearch() {
    this.translateService.get('comment-list.search').subscribe(msg => {
      this.searchPlaceholder = msg;
    });
    this.search = true;
    this.searchField.nativeElement.focus();
  }

  getComments(scrollToTop?: boolean): void {
    this.scrollToTop = scrollToTop;
    if (this.room && this.room.extensions && this.room.extensions.comments) {
      if (this.room.extensions.comments['enableThreshold']) {
        this.thresholdEnabled = true;
      } else {
        this.thresholdEnabled = false;
      }
    }
    let commentThreshold;
    if (this.thresholdEnabled) {
      commentThreshold = this.room.extensions.comments['commentThreshold'];
      if (this.hideCommentsList) {
        this.filteredComments = this.filteredComments.filter(x => x.score >= commentThreshold);
      } else {
        this.comments = this.comments.filter(x => x.score >= commentThreshold);
      }
    }
    this.setTimePeriod(this.period);
    if (this.isPresentation && this.isLoading) {
      this.initPresentation();
    }
    this.isLoading = false;
  }

  initPresentation() {
    if (this.displayComments.length > 0) {
      this.goToFirstComment();
    }
    this.eventService.on<string>('CommentSortingChanged').subscribe(sort => {
      this.sortComments(sort);
      setTimeout(() => {
        this.goToFirstComment();
        }, 300);
    });
  }

  goToFirstComment() {
    this.updateCurrentComment(this.displayComments[0]);
  }

  getDisplayComments() {
    const commentList = this.hideCommentsList ? this.filteredComments : this.commentsFilteredByTime;
    this.displayComments = commentList.slice(0, Math.min(this.commentCounter, this.commentsFilteredByTime.length));
  }

  getVote(comment: Comment): Vote {
    if (this.viewRole === UserRole.PARTICIPANT) {
      return this.commentVoteMap.get(comment.id);
    }
  }

  addNewComment(comment: Comment) {
    const c = new Comment();
    c.roomId = this.roomId;
    c.body = comment.body;
    c.id = comment.id;
    c.timestamp = comment.timestamp;
    c.tag = comment.tag;
    c.answer = comment.answer;
    c.favorite = comment.favorite;
    c.correct = comment.correct;
    this.announceNewComment(c);
    this.comments = this.comments.concat(c);
    this.commentCounter++;
  }

  parseIncomingMessage(message: Message) {
    const msg = JSON.parse(message.body);
    const payload = msg.payload;
    switch (msg.type) {
      case 'CommentCreated':
        if (!this.isModerator) {
          this.addNewComment(payload);
        }
        break;
      case 'CommentPatched':
        // ToDo: Use a map for comments w/ key = commentId
        for (let i = 0; i < this.comments.length; i++) {
          if (payload.id === this.comments[i].id) {
            for (const [key, value] of Object.entries(payload.changes)) {
              switch (key) {
                case this.filtering.READ:
                  this.comments[i].read = <boolean>value;
                  break;
                case this.filtering.CORRECT:
                  this.comments[i].correct = <CorrectWrong>value;
                  break;
                case this.filtering.FAVORITE:
                  this.comments[i].favorite = <boolean>value;
                  break;
                case 'score':
                  this.comments[i].score = <number>value;
                  this.getComments();
                  break;
                case this.filtering.ACK:
                  const isNowAck = this.isModerator ? !value : <boolean>value;
                  if (!isNowAck) {
                    this.comments = this.comments.filter(function (el) {
                      return el.id !== payload.id;
                    });
                    this.commentCounter--;
                  }
                  break;
                case this.filtering.TAG:
                  this.comments[i].tag = <string>value;
                  break;
                case this.filtering.ANSWER:
                  this.comments[i].answer = <string>value;
                  break;
              }
            }
          }
        }
        break;
      case 'CommentHighlighted':
        // ToDo: Use a map for comments w/ key = commentId
        for (let i = 0; i < this.comments.length; i++) {
          if (payload.id === this.comments[i].id) {
            this.comments[i].highlighted = <boolean>payload.lights;
          }
        }
        break;
      case 'CommentDeleted':
        for (let i = 0; i < this.comments.length; i++) {
          this.comments = this.comments.filter(function (el) {
            return el.id !== payload.id;
          });
        }
        this.commentCounter--;
        break;
      default:
        this.referenceEvent.next(payload.id);
    }
    this.afterIncomingMessage();
  }

  parseIncomingModeratorMessage(message: Message) {
    const msg = JSON.parse(message.body);
    const payload = msg.payload;
    if (msg.type === 'CommentCreated') {
      this.addNewComment(payload);
    }
    this.afterIncomingMessage();
  }

  afterIncomingMessage() {
    this.setTimePeriod(this.period);
    if (this.hideCommentsList) {
      this.searchComments();
    }
    if (this.isPresentation) {
      this.scrollToComment(this.getCurrentIndex());
    }
  }

  openCreateDialog(): void {
    let tags;
    if (this.room.extensions && this.room.extensions.tags && this.room.extensions.tags['tags']) {
      tags = this.room.extensions.tags['tags'];
    }
    this.dialogService.openCreateCommentDialog(this.auth, tags, this.roomId, this.directSend, this.viewRole);
  }

  filterComments(type: string, tag?: string): void {
    if (type === '' || (this.currentFilter === this.filtering.TAG && type === this.filtering.TAG)) {
      this.filteredComments = this.commentsFilteredByTime;
      this.hideCommentsList = false;
      this.currentFilter = '';
      this.sortComments(this.currentSort);
      return;
    }
    this.filteredComments = this.commentsFilteredByTime.filter(c => {
      switch (type) {
        case this.filtering.CORRECT:
          return c.correct === CorrectWrong.CORRECT ? 1 : 0;
        case this.filtering.WRONG:
          return c.correct === CorrectWrong.WRONG ? 1 : 0;
        case this.filtering.FAVORITE:
          return c.favorite;
        case this.filtering.READ:
          return c.read;
        case this.filtering.UNREAD:
          return !c.read;
        case this.filtering.TAG:
          return c.tag === tag;
        case this.filtering.ANSWER:
          return c.answer;
      }
    });
    this.currentFilter = type;
    this.hideCommentsList = true;
    this.sortComments(this.currentSort);
  }

  sort(array: any[], type: string): any[] {
    return array.sort((a, b) => {
      if (type === this.sorting.VOTEASC) {
        return (a.score > b.score) ? 1 : (b.score > a.score) ? -1 : 0;
      } else if (type === this.sorting.VOTEDESC) {
        return (b.score > a.score) ? 1 : (a.score > b.score) ? -1 : 0;
      } else if (type === this.sorting.TIME) {
        const dateA = new Date(a.timestamp), dateB = new Date(b.timestamp);
        return (+dateB > +dateA) ? 1 : (+dateA > +dateB) ? -1 : 0;
      }
    });
  }

  sortCommentsManually(type: string) {
    this.scrollToTop = true;
    this.sortComments(type);
  }

  sortComments(type: string): void {
    if (this.hideCommentsList === true) {
      this.filteredComments = this.sort(this.filteredComments, type);
    } else {
      this.commentsFilteredByTime = this.sort(this.commentsFilteredByTime, type);
    }
    this.currentSort = type;
    this.globalStorageService.setItem(STORAGE_KEYS.COMMENT_SORT, this.currentSort);
    if (this.scrollToTop) {
      this.commentCounter = itemRenderNumber;
      this.scrollTop();
      this.scrollToTop = false;
    }
    this.getDisplayComments();
  }

  clickedOnTag(tag: string): void {
    this.filterComments(this.filtering.TAG, tag);
  }

  pauseCommentStream() {
    this.freeze = true;
    this.commentStream.unsubscribe();
    const msg = this.translateService.instant('comment-list.comment-stream-stopped');
    this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
    document.getElementById('start-button').focus();
  }

  playCommentStream() {
    this.freeze = false;
    this.commentService.getAckComments(this.roomId)
      .subscribe(comments => {
        this.comments = comments;
        this.getComments(true);
      });
    this.subscribeCommentStream();
    const msg = this.translateService.instant('comment-list.comment-stream-started');
    this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
    document.getElementById('pause-button').focus();
  }

  subscribeCommentStream() {
    this.commentStream = this.wsCommentService.getCommentStream(this.roomId).subscribe((message: Message) => {
      this.parseIncomingMessage(message);
    });
  }

  subscribeModeratorStream() {
    this.moderatorStream = this.wsCommentService.getModeratorCommentStream(this.roomId).subscribe((message: Message) => {
      this.parseIncomingModeratorMessage(message);
    });
  }

  /**
   * Announces a new comment receive.
   */
  public announceNewComment(comment: Comment) {
    this.newestComment = comment;
    setTimeout(() => {
      const newCommentText: string = document.getElementById('new-comment').innerText;
      this.announceService.announce(newCommentText);
    }, 450);
  }

  setTimePeriod(period: Period) {
    this.period = period;
    const currentTime = new Date();
    const hourInSeconds = 3600000;
    let periodInSeconds;
    if (period !== Period.ALL) {
      switch (period) {
        case Period.ONEHOUR:
          periodInSeconds = hourInSeconds;
          break;
        case Period.THREEHOURS:
          periodInSeconds = hourInSeconds * 3;
          break;
        case Period.ONEDAY:
          periodInSeconds = hourInSeconds * 24;
          break;
        case Period.ONEWEEK:
          periodInSeconds = hourInSeconds * 168;
      }
      this.commentsFilteredByTime = this.comments
        .filter(c => new Date(c.timestamp).getTime() >= (currentTime.getTime() - periodInSeconds));
    } else {
      this.commentsFilteredByTime = this.comments;
    }
    this.filterComments(this.currentFilter);
    this.globalStorageService.setItem(STORAGE_KEYS.COMMENT_TIME_FILTER, this.period);
  }

  openDeleteCommentsDialog(): void {
    const dialogRef = this.dialogService.openDeleteDialog(this.isModerator ? 'really-delete-banned-comments' : 'really-delete-comments');
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteComments();
      }
    });
  }

  deleteComments(): void {
    if (this.isModerator) {
      this.commentService.deleteCommentsById(this.roomId, this.comments.map(c => c.id)).subscribe(() => {
        const msg = this.translateService.instant('comment-list.banned-comments-deleted');
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
    } else {
      this.commentService.deleteCommentsByRoomId(this.roomId).subscribe(() => {
        const msg = this.translateService.instant('comment-list.all-comments-deleted');
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
    }
  }

  onExport(): void {
    if (this.isModerator) {
      this.commentService.getRejectedComments(this.roomId).subscribe(comments => {
        this.commentService.export(comments, this.room);
      });
    }
    this.commentService.getAckComments(this.roomId).subscribe(comments => {
      this.commentService.export(comments, this.room);
    });
  }

  navToOtherCommentList() {
    const urlTree = ['creator', 'room', this.room.shortId, 'comments'];
    if (!this.isModerator) {
      urlTree.push('moderation');
    }
    this.router.navigate(urlTree);
  }

  navToSettings() {
    this.router.navigate(['creator', 'room', this.room.shortId, 'settings', 'comments']);
  }

  resetComments() {
    this.comments = [];
    this.setTimePeriod(this.period);
  }

  updateCurrentComment(comment: Comment) {
    this.updateActiveComment.emit(comment);
    this.commentService.highlight(comment).subscribe();
    const index = this.getIndexOfComment(comment);
    this.eventService.broadcast('CommentStepStateChanged', this.getStepState(index));
    if (!this.isLoading) {
      this.scrollToComment(index);
      this.announceCommentPresentation(index);
    }
  }

  getIndexOfComment(comment: Comment): number {
    return Math.max(this.displayComments.indexOf(comment), 0);
  }

  getCurrentIndex(): number {
    return this.getIndexOfComment(this.activeComment);
  }

  getStepState(index) {
    let state;
    if (index === 0) {
      state = 'START';
    } else if (index === this.comments.length - 1) {
      state = 'END';
    }
    return state;
  }

  getCommentElements() {
    return document.getElementsByName('comment');
  }

  scrollToComment(index) {
    this.getCommentElements()[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      }
    );
  }

  announceCommentPresentation(index: number) {
    this.announceService.announce('presentation.a11y-present-comment', { comment: this.displayComments[index].body });
  }

  nextComment() {
    const index = this.getCurrentIndex();
    if (index < this.displayComments.length - 1) {
      const nextComment = this.displayComments[index + 1];
      this.updateCurrentComment(nextComment);
    }
  }

  prevComment() {
    const index = this.getCurrentIndex();
    if (index > 0) {
      const prevComment = this.displayComments[index -1];
      this.updateCurrentComment(prevComment);
    }
  }
}
