import { AfterContentInit, Component, HostListener, OnInit } from '@angular/core';
import { RoomService } from '../../../services/http/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomPageComponent } from '../../shared/room-page/room-page.component';
import { Location } from '@angular/common';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';
import { WsCommentServiceService } from '../../../services/websockets/ws-comment-service.service';
import { CommentService } from '../../../services/http/comment.service';
import { EventService } from '../../../services/util/event.service';
import { KeyboardUtils } from '../../../utils/keyboard';
import { KeyboardKey } from '../../../utils/keyboard/keys';
import { ContentService } from '../../../services/http/content.service';
import { DialogService } from '../../../services/util/dialog.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { Content } from '../../../models/content';
import { AnnounceService } from '../../../services/util/announce.service';
import { UserRole } from '../../../models/user-roles.enum';
import { InfoBarItem } from '../../shared/bars/info-bar/info-bar.component';
import { ContentGroupService } from '../../../services/http/content-group.service';
import { ContentGroup } from '../../../models/content-group';
import { RoomStatsService } from '../../../services/http/room-stats.service';

@Component({
  selector: 'app-room-creator-page',
  templateUrl: './room-creator-page.component.html',
  styleUrls: ['./room-creator-page.component.scss']
})
export class RoomCreatorPageComponent extends RoomPageComponent implements OnInit, AfterContentInit {

  viewModuleCount = 1;
  looseContent: Content[] = [];
  userCount: number;
  target: Window;

  constructor(
    protected roomService: RoomService,
    protected roomStatsService: RoomStatsService,
    protected contentGroupService: ContentGroupService,
    protected notification: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    public dialog: MatDialog,
    protected translateService: TranslateService,
    protected langService: LanguageService,
    protected wsCommentService: WsCommentServiceService,
    protected commentService: CommentService,
    private announceService: AnnounceService,
    public eventService: EventService,
    protected contentService: ContentService,
    private dialogService: DialogService,
    protected globalStorageService: GlobalStorageService
  ) {
    super(roomService, roomStatsService, contentGroupService, route, router, location, wsCommentService,
      commentService, eventService, contentService, translateService, notification, globalStorageService);
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const focusOnInput = this.eventService.focusOnInput;
    if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit1) === true && focusOnInput === false) {
      document.getElementById('comments-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit2) === true && focusOnInput === false) {
      document.getElementById('live-survey-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit3) === true && focusOnInput === false) {
      document.getElementById('content-group-create-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit4) === true && focusOnInput === false) {
      if (this.contentGroups.length > 0) {
        document.getElementById('content-groups').focus();
      } else {
        document.getElementById('no-content-groups').focus();
      }
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit5) === true && focusOnInput === false) {
      document.getElementById('presentation-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit6) === true && focusOnInput === false) {
      document.getElementById('more-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit7) === true && focusOnInput === false) {
      const adKey = this.userCount === 1 ? '-only-one' : '';
      const msg = this.translateService.instant('room-page.a11y-user-count' + adKey, {count: this.userCount})
      this.announceService.announce(msg);
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Escape) === true && focusOnInput === false) {
      this.announce();
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      document.getElementById('live-announcer-button').focus();
    }, 700);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
    this.route.data.subscribe(data => {
      this.initializeRoom(data.room, data.userRole, data.viewRole);
    });
    this.roomWatch = this.roomService.getCurrentRoomsMessageStream();
    this.roomSub = this.roomWatch.subscribe(msg => this.parseUserCount(msg.body));
  }

  protected unsubscribe() {
    if (this.moderationSub) {
      this.moderationSub.unsubscribe();
    }
  }

  announce() {
    this.announceService.announce('room-page.a11y-shortcuts');
  }

  afterRoomLoadHook() {
    this.subscribeCommentStream();
    if (this.moderationEnabled) {
      this.viewModuleCount = this.viewModuleCount + 1;
      this.subscribeCommentModeratorStream();
    }
  }

  afterGroupsLoadHook() {
    this.prepareAttachmentData(UserRole.CREATOR);
    this.contentService.findContentsWithoutGroup(this.room.id).subscribe(contents => {
      this.looseContent = contents;
      this.isLoading = false;
    });
    this.globalStorageService.setItem(STORAGE_KEYS.CONTENT_GROUPS, this.groupNames);
    this.route.data.subscribe(data => {
      this.roomService.getRoomSummaries([data.room.id]).subscribe(summary => {
        this.userCount = summary[0].stats.roomUserCount;
        this.infoBarItems.push(new InfoBarItem('user-counter', 'people', this.userCount));
      });
    });
  }

  public showQRDialog() {
    const dialogRef = this.dialogService.openQRCodeDialog(this.room.shortId, this.room.passwordProtected, this.room.id);
    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        document.getElementById('live-announcer-button').focus();
      }, 300);
    });
  }

  openPresentationMode() {
    this.router.navigate(['presentation', this.room.shortId]);
  }

  openCreateContentGroupDialog() {
    this.dialogService.openContentGroupCreationDialog().afterClosed().subscribe(name => {
      if (name) {
        const newGroup = new ContentGroup();
        newGroup.roomId = this.room.id;
        newGroup.name = name;
        this.contentGroupService.post(newGroup).subscribe(() => {
          this.translateService.get('room-page.content-group-created').subscribe(msg => {
            this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
          });
          this.router.navigate(['creator', 'room', this.room.shortId, 'group', name]);
        });
      }
    });
  }
}
