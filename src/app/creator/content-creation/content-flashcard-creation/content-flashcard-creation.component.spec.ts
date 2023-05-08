import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContentFlashcardCreationComponent } from './content-flashcard-creation.component';
import { NO_ERRORS_SCHEMA, Injectable } from '@angular/core';
import { ContentService } from '@app/core/services/http/content.service';
import { NotificationService } from '@app/core/services/util/notification.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EventService } from '@app/core/services/util/event.service';
import { RoomService } from '@app/core/services/http/room.service';
import { of, Subject } from 'rxjs';
import { ContentGroupService } from '@app/core/services/http/content-group.service';
import { AnnounceService } from '@app/core/services/util/announce.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {
  ActivatedRouteStub,
  JsonTranslationLoader,
} from '@testing/test-helpers';
import { FormattingService } from '@app/core/services/http/formatting.service';

const mockCreateEvent = new Subject<any>();

@Injectable()
class MockContentService {}

@Injectable()
class MockNotificationService {}

@Injectable()
class MockEventService {}

@Injectable()
class MockRoomService {}

@Injectable()
class MockContentGroupService {}

@Injectable()
class MockAnnouncer {}

@Injectable()
class MockFormattingService {}

describe('ContentFlashcardCreationComponent', () => {
  let component: ContentFlashcardCreationComponent;
  let fixture: ComponentFixture<ContentFlashcardCreationComponent>;

  const data = {
    room: {
      id: '1234',
    },
  };

  const snapshot = new ActivatedRouteSnapshot();

  snapshot.params = of([{ seriesName: 'SERIES' }]);

  const activatedRouteStub = new ActivatedRouteStub(null, data, snapshot);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ContentFlashcardCreationComponent],
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
        {
          provide: FormattingService,
          useClass: MockFormattingService,
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
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ContentFlashcardCreationComponent);
        component = fixture.componentInstance;
        component.createEvent = mockCreateEvent;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});