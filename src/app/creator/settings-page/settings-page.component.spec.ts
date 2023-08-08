import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SettingsPageComponent } from './settings-page.component';
import { RoomService } from '@app/core/services/http/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivatedRouteStub,
  JsonTranslationLoader,
  MockEventService,
  MockGlobalStorageService,
  MockNotificationService,
  MockRouter,
} from '@testing/test-helpers';
import { EventService } from '@app/core/services/util/event.service';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { GlobalStorageService } from '@app/core/services/util/global-storage.service';
import { A11yIntroPipe } from '@app/core/pipes/a11y-intro.pipe';
import { NotificationService } from '@app/core/services/util/notification.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UserRole } from '@app/core/models/user-roles.enum';

@Injectable()
class MockRoomService {}

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  const data = {
    room: {
      id: '1234',
    },
  };
  const snapshot = new ActivatedRouteSnapshot();
  snapshot.data = {
    userRole: UserRole.EDITOR,
  };
  snapshot.params = {};
  const activatedRouteStub = new ActivatedRouteStub(null, data, snapshot);

  let translateService: TranslateService;

  const a11yIntroPipe = new A11yIntroPipe(translateService);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPageComponent, A11yIntroPipe],
      providers: [
        {
          provide: RoomService,
          useClass: MockRoomService,
        },
        {
          provide: Router,
          useClass: MockRouter,
        },
        {
          provide: EventService,
          useClass: MockEventService,
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
          provide: A11yIntroPipe,
          useValue: a11yIntroPipe,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: JsonTranslationLoader,
          },
          isolate: true,
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
