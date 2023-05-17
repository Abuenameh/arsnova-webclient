import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveFeedbackPageComponent } from './live-feedback-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  ActivatedRouteStub,
  JsonTranslationLoader,
  MockAnnounceService,
  MockEventService,
  MockGlobalStorageService,
  MockNotificationService,
} from '@testing/test-helpers';
import { of } from 'rxjs';
import { Message } from '@stomp/stompjs';
import { ClientAuthentication } from '@app/core/models/client-authentication';
import { AuthProvider } from '@app/core/models/auth-provider';
import { Room } from '@app/core/models/room';
import { UserRole } from '@app/core/models/user-roles.enum';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RoomService } from '@app/core/services/http/room.service';
import { WsFeedbackService } from '@app/core/services/websockets/ws-feedback.service';
import { FeedbackService } from '@app/core/services/http/feedback.service';
import { AnnounceService } from '@app/core/services/util/announce.service';
import { AuthenticationService } from '@app/core/services/http/authentication.service';
import { GlobalStorageService } from '@app/core/services/util/global-storage.service';
import { EventEmitter } from '@angular/core';
import { RemoteService } from '@app/core/services/util/remote.service';
import { NotificationService } from '@app/core/services/util/notification.service';
import { CoreModule } from '@app/core/core.module';
import { LoadingIndicatorComponent } from '@app/standalone/loading-indicator/loading-indicator.component';
import { HotkeyService } from '@app/core/services/util/hotkey.service';
import { AnswerCountComponent } from '@app/standalone/answer-count/answer-count.component';
import { EventService } from '@app/core/services/util/event.service';

describe('LiveFeedbackPageComponent', () => {
  let component: LiveFeedbackPageComponent;
  let fixture: ComponentFixture<LiveFeedbackPageComponent>;

  const mockRoomService = jasmine.createSpyObj([
    'getRoom',
    'changeFeedbackType',
    'changeFeedbackLocked',
  ]);

  const mockRoomStatsService = jasmine.createSpyObj(['getStats']);
  mockRoomStatsService.getStats.and.returnValue(of({}));

  const mockWsFeedbackService = jasmine.createSpyObj(['send', 'reset']);

  const mockFeedbackService = jasmine.createSpyObj(['startSub', 'get']);
  mockFeedbackService.messageEvent = new EventEmitter<Message>();
  mockFeedbackService.get.and.returnValue(of([0, 0, 0, 0]));

  const mockAuthenticationService = jasmine.createSpyObj([
    'getCurrentAuthentication',
  ]);
  const auth = new ClientAuthentication(
    '1234',
    'a@b.cd',
    AuthProvider.ARSNOVA,
    'token'
  );
  mockAuthenticationService.getCurrentAuthentication.and.returnValue(of(auth));

  const room = new Room();
  room.settings = {};
  const data = {
    room: room,
    viewRole: UserRole.PARTICIPANT,
  };
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.data = {
    isPresentation: false,
  };
  const activatedRouteStub = new ActivatedRouteStub(null, data, snapshot);

  const mockRemoteService = jasmine.createSpyObj(['getCommentState']);

  const mockHotkeyService = jasmine.createSpyObj([
    'registerHotkey',
    'unregisterHotkey',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveFeedbackPageComponent],
      imports: [
        CoreModule,
        LoadingIndicatorComponent,
        AnswerCountComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: JsonTranslationLoader,
          },
          isolate: true,
        }),
      ],
      providers: [
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
        {
          provide: HotkeyService,
          useValue: mockHotkeyService,
        },

        {
          provide: RoomService,
          useValue: mockRoomService,
        },
        {
          provide: WsFeedbackService,
          useValue: mockWsFeedbackService,
        },
        {
          provide: FeedbackService,
          useValue: mockFeedbackService,
        },
        {
          provide: AnnounceService,
          useClass: MockAnnounceService,
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
        {
          provide: GlobalStorageService,
          useClass: MockGlobalStorageService,
        },
        {
          provide: RemoteService,
          useValue: mockRemoteService,
        },
        {
          provide: EventService,
          useClass: MockEventService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveFeedbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});