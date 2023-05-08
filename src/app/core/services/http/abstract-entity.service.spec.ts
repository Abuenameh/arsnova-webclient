import { inject, TestBed } from '@angular/core/testing';
import { AbstractEntityService } from './abstract-entity.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WsConnectorService } from '@app/core/services/websockets/ws-connector.service';
import { EventService } from '@app/core/services/util/event.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@app/core/services/util/notification.service';
import { Cache, CachingService } from '@app/core/services/util/caching.service';
import {
  MockEventService,
  MockNotificationService,
  MockTranslateService,
} from '@testing/test-helpers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockWsConnectorService {}

@Injectable()
class MockCachingService {
  getCache() {
    return new Cache();
  }
}

@Injectable()
class TestEntityService extends AbstractEntityService<object> {
  constructor(
    protected httpClient: HttpClient,
    protected wsConnector: WsConnectorService,
    protected eventService: EventService,
    protected translateService: TranslateService,
    protected notificationService: NotificationService,
    cachingService: CachingService
  ) {
    super(
      'Test',
      '/test',
      httpClient,
      wsConnector,
      eventService,
      translateService,
      notificationService,
      cachingService
    );
  }
}

describe('AbstractEntityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestEntityService,
        {
          provide: EventService,
          useClass: MockEventService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
        {
          provide: TranslateService,
          useClass: MockTranslateService,
        },
        {
          provide: WsConnectorService,
          useClass: MockWsConnectorService,
        },
        {
          provide: CachingService,
          useClass: MockCachingService,
        },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  it('should be created', inject(
    [TestEntityService],
    (service: TestEntityService) => {
      expect(service).toBeTruthy();
    }
  ));
});