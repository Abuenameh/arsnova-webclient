import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentTextCreationComponent } from './content-text-creation.component';
import { NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { ContentService } from '@app/core/services/http/content.service';
import { NotificationService } from '@app/core/services/util/notification.service';
import { getTranslocoModule } from '@testing/transloco-testing.module';
import { EventService } from '@app/core/services/util/event.service';
import { RoomService } from '@app/core/services/http/room.service';
import { of, Subject } from 'rxjs';
import { AnnounceService } from '@app/core/services/util/announce.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {
  MockEventService,
  MockNotificationService,
  ActivatedRouteStub,
} from '@testing/test-helpers';
import { ContentGroupService } from '@app/core/services/http/content-group.service';

const mockCreateEvent = new Subject<any>();

@Injectable()
class MockContentService {}

@Injectable()
class MockRoomService {}

@Injectable()
class MockContentGroupService {}

@Injectable()
class MockAnnouncer {}

describe('ContentTextCreationComponent', () => {
  let component: ContentTextCreationComponent;
  let fixture: ComponentFixture<ContentTextCreationComponent>;

  const data = {
    room: {
      id: '1234',
    },
  };

  const snapshot = new ActivatedRouteSnapshot();

  snapshot.params = of([{ seriesName: 'SERIES' }]);

  const activatedRouteStub = new ActivatedRouteStub(undefined, data, snapshot);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentTextCreationComponent],
      providers: [
        {
          provide: ContentService,
          useClass: MockContentService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
        {
          provide: EventService,
          useClass: MockEventService,
        },
        {
          provide: RoomService,
          useClass: MockRoomService,
        },
        {
          provide: ContentGroupService,
          useClass: MockContentGroupService,
        },
        {
          provide: AnnounceService,
          useClass: MockAnnouncer,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
      ],
      imports: [getTranslocoModule()],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ContentTextCreationComponent);
        component = fixture.componentInstance;
        component.createEvent = mockCreateEvent;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
