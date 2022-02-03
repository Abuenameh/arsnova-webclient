import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Room } from '../../../models/room';
import { RoomPageComponent } from '../../shared/room-page/room-page.component';
import { Location } from '@angular/common';
import { RoomService } from '../../../services/http/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';
import { WsCommentService } from '../../../services/websockets/ws-comment.service';
import { CommentService } from '../../../services/http/comment.service';
import { ContentService } from '../../../services/http/content.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { EventService } from '../../../services/util/event.service';
import { NotificationService } from '../../../services/util/notification.service';
import { Message } from '@stomp/stompjs';
import { Subscription } from 'rxjs';
import { WsFeedbackService } from '../../../services/websockets/ws-feedback.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { UserRole } from '../../../models/user-roles.enum';
import { FeedbackMessageType } from '../../../models/messages/feedback-message-type';
import { FeedbackService } from '../../../services/http/feedback.service';
import { ContentGroupService } from '../../../services/http/content-group.service';
import { ContentGroup } from '../../../models/content-group';
import { RoomStatsService } from '../../../services/http/room-stats.service';

@Component({
  selector: 'app-room-participant-page',
  templateUrl: './room-participant-page.component.html',
  styleUrls: ['./room-participant-page.component.scss']
})
export class RoomParticipantPageComponent extends RoomPageComponent implements OnInit, AfterContentInit {

  room: Room;
  protected surveySub: Subscription;
  surveyEnabled = false;

  constructor(
    protected location: Location,
    protected roomService: RoomService,
    protected roomStatsService: RoomStatsService,
    protected contentGroupService: ContentGroupService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected notificationService: NotificationService,
    protected translateService: TranslateService,
    protected langService: LanguageService,
    protected wsCommentService: WsCommentService,
    protected commentService: CommentService,
    protected contentService: ContentService,
    protected authenticationService: AuthenticationService,
    public eventService: EventService,
    private wsFeedbackService: WsFeedbackService,
    protected globalStorageService: GlobalStorageService,
    private feedbackService: FeedbackService
  ) {
    super(roomService, roomStatsService, contentGroupService, route, router, location, wsCommentService,
      commentService, eventService, contentService, translateService, notificationService, globalStorageService);
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      document.getElementById('live-announcer-button').focus();
    }, 700);
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.route.data.subscribe(data => {
      this.initializeRoom(data.room, data.userRole, data.viewRole);
    });
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
  }

  unsubscribe() {
    if (this.surveySub) {
      this.surveySub.unsubscribe();
    }
  }

  getFeedback() {
    this.surveyEnabled = !this.room.settings['feedbackLocked'];
    this.feedbackService.startSub(this.room.id);
    this.surveySub = this.feedbackService.messageEvent.subscribe((message: Message) => {
      this.parseFeedbackMessage(message);
    });
  }

  afterRoomLoadHook() {
    this.getFeedback();
    this.initRoomData();
  }

  initRoomData() {
    this.prepareAttachmentData(UserRole.PARTICIPANT);
    this.subscribeCommentStream();
  }

  afterGroupsLoadHook() {
    this.isLoading = false;
    if (this.contentGroups.length > 0 && this.globalStorageService.getItem(STORAGE_KEYS.LAST_GROUP) === '') {
      this.globalStorageService.setItem(STORAGE_KEYS.LAST_GROUP, this.contentGroups[0].name);
    } else {
      if (this.contentGroups.length === 0) {
        this.globalStorageService.setItem(STORAGE_KEYS.LAST_GROUP, '');
      }
    }
  }

  parseFeedbackMessage(message: Message) {
    const msg = JSON.parse(message.body);
    if (msg.type === FeedbackMessageType.STARTED) {
      this.surveyEnabled = true;
    } else if (msg.type === FeedbackMessageType.STOPPED) {
      this.surveyEnabled = false;
    }
  }

  calcContentsInGroup(group: ContentGroup): number {
    return this.contentGroupService.filterPublishedIds(group).length;
  }
}
