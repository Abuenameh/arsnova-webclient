import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentCreationComponent } from './content-creation.component';
import { Injectable } from '@angular/core';
import { ContentService } from '../../../../services/http/content.service';
import { NotificationService } from '../../../../services/util/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EventService } from '../../../../services/util/event.service';
import { RoomService } from '../../../../services/http/room.service';
import { Subject } from 'rxjs';
import { AnnounceService } from '@arsnova/app/services/util/announce.service';
import { ActivatedRoute } from '@angular/router';
import {
  MockEventService,
  MockNotificationService,
  MockMatDialog,
  JsonTranslationLoader, ActivatedRouteStub
} from '@arsnova/testing/test-helpers';
import { ContentGroupService } from '@arsnova/app/services/http/content-group.service';

const mockCreateEvent = new Subject<any>();

@Injectable()
class MockContentService {
}

@Injectable()
class MockRoomService {
}

@Injectable()
class MockContentGroupService {
}

@Injectable()
class MockAnnouncer {
}

describe('ContentChoiceCreationComponent', () => {
  let component: ContentCreationComponent;
  let fixture: ComponentFixture<ContentCreationComponent>;

  const data = {
    room: {
      id: '1234'
    }
  }

  const activatedRouteStub = new ActivatedRouteStub(null, data);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentCreationComponent
      ],
      providers: [
        {
          provide: ContentService,
          useClass: MockContentService
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService
        },
        {
          provide: MatDialog,
          useClass: MockMatDialog
        },
        {
          provide: EventService,
          useClass: MockEventService
        },
        {
          provide: RoomService,
          useClass: MockRoomService
        },
        {
          provide: ContentGroupService,
          useClass: MockContentGroupService
        },
        {
          provide: AnnounceService,
          useClass: MockAnnouncer
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: JsonTranslationLoader
          },
          isolate: true
        })
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ContentCreationComponent);
      component = fixture.componentInstance;
      component.createEvent = mockCreateEvent;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});