import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StatisticScaleComponent } from './statistic-scale.component';
import { EventService } from '@arsnova/app/services/util/event.service';
import { ContentService } from '@arsnova/app/services/http/content.service';
import { ThemeService } from '@arsnova/theme/theme.service';
import { JsonTranslationLoader, MockEventService, MockThemeService } from '@arsnova/testing/test-helpers';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ContentChoice } from '@arsnova/app/models/content-choice';
import { ContentType } from '@arsnova/app/models/content-type.enum';
import { ContentState } from '@arsnova/app/models/content-state';
import { of } from 'rxjs';
import { LikertScaleService } from '@arsnova/app/services/util/likert-scale.service';
import { RoundStatistics } from '@arsnova/app/models/round-statistics';
import { AnswerStatistics } from '@arsnova/app/models/answer-statistics';
import { PresentationService } from '@arsnova/app/services/util/presentation.service';
import { GlobalStorageService } from '@arsnova/app/services/util/global-storage.service';
import { MockGlobalStorageService } from '@arsnova/testing/test-helpers';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StatisticScaleComponent', () => {
  let component: StatisticScaleComponent;
  let fixture: ComponentFixture<StatisticScaleComponent>;

  const mockContentService = jasmine.createSpyObj(['getAnswersChangedStream', 'getAnswer']);
  const roundStatistics = new RoundStatistics();
  roundStatistics.abstentionCount = 0;
  roundStatistics.answerCount = 0;
  roundStatistics.combinatedCounts = [];
  roundStatistics.independentCounts = [];
  roundStatistics.round = 1;
  const stats = new AnswerStatistics();
  stats.contentId = '1234',
  stats.roundStatistics = [roundStatistics];
  const body = {
    payload: {
      stats: stats
    }
  }
  const message = {
    body: JSON.stringify(body)
  }
  mockContentService.getAnswer.and.returnValue(of(stats));
  mockContentService.getAnswersChangedStream.and.returnValue(of(message));

  const mockLikertScaleService = jasmine.createSpyObj(['getOptionLabels']);
  mockLikertScaleService.getOptionLabels.and.returnValue(['5', '4', '3', '2', '1']);

  const mockPresentationService = jasmine.createSpyObj(['getScale']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticScaleComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: JsonTranslationLoader
          },
          isolate: true
        })
      ],
      providers: [
        {
          provide: EventService,
          useClass: MockEventService
        },
        {
          provide: ContentService,
          useValue: mockContentService
        },
        {
          provide: ThemeService,
          useClass: MockThemeService
        },
        {
          provide: LikertScaleService,
          useValue: mockLikertScaleService
        },
        {
          provide: PresentationService,
          useValue: mockPresentationService
        },
        {
          provide: GlobalStorageService,
          useClass: MockGlobalStorageService
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticScaleComponent);
    component = fixture.componentInstance;
    component.content = new ContentChoice('1234', '0', 'room1234', 'subject', 'body', [], [], [], false, ContentType.SCALE, new ContentState(1, new Date(), false));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
