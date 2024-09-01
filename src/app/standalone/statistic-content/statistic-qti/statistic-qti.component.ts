import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ContentService } from '@app/core/services/http/content.service';
import { ContentQti } from '@app/core/models/content-qti';
import { TranslocoService, TranslocoPipe } from '@ngneat/transloco';
import { ThemeService } from '@app/core/theme/theme.service';
import { AnswerStatistics } from '@app/core/models/answer-statistics';
import { QtiRoundStatistics } from '@app/core/models/round-statistics';
import {
  ABSTENTION_SIGN,
  StatisticContentBaseComponent,
} from '@app/standalone/statistic-content/statistic-content-base';
import { ContentType } from '@app/core/models/content-type.enum';
import { takeUntil } from 'rxjs';
import { EventService } from '@app/core/services/util/event.service';
import { PresentationService } from '@app/core/services/util/presentation.service';
import { NgClass } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { SafeHtmlPipe } from '@app/core/pipes/safe-html.pipe';
import { QtiAssessmentItem } from '@abuenameh/qti-components';
import { MatCard } from '@angular/material/card';

export class ResponseCloudItem {
  response: string;
  size: number;

  constructor(response: string, size: number) {
    this.response = response;
    this.size = size;
  }
}

@Component({
  selector: 'app-statistic-qti',
  templateUrl: './statistic-qti.component.html',
  styleUrls: ['./statistic-qti.component.scss'],
  standalone: true,
  imports: [MatCard, FlexModule, TranslocoPipe, NgClass, SafeHtmlPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatisticQtiComponent
  extends StatisticContentBaseComponent
  implements OnInit, OnDestroy
{
  @Input({ required: true }) content!: ContentQti;
  @Input({ required: true }) visualizationUnitChanged!: EventEmitter<boolean>;
  @Input() directShow = false;
  @ViewChild('qtiItem') qtiItem?: ElementRef<QtiAssessmentItem>;
  @ViewChild('qtiItemAnswers') qtiAnswers?: ElementRef<QtiAssessmentItem>;

  data: Array<number[]> = [[], []];
  rounds = 1;
  roundsToDisplay = 0;
  abstentionCount = 0;
  independentAnswerCount: number[][] = [[], [], []];
  ContentType: typeof ContentType = ContentType;
  correctVisible = false;
  correctResponses?: string[];
  responsesVisible = false;
  responseWeights: ResponseCloudItem[] = [];
  showResponses = false;

  constructor(
    protected contentService: ContentService,
    protected translateService: TranslocoService,
    protected themeService: ThemeService,
    protected eventService: EventService,
    protected presentationService: PresentationService
  ) {
    super(contentService, eventService, translateService);
  }

  init(stats: AnswerStatistics) {
    this.showResponses = this.content.showResponses;
    this.rounds = this.content.state.round;
    this.roundsToDisplay = this.rounds - 1;
    this.updateData(stats);
  }

  afterInit() {
    this.contentService
      .getAnswersChangedStream(this.content.roomId, this.content.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((msg) => {
        const stats = JSON.parse(msg.body).payload.stats;
        this.updateData(stats);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  toggleAnswers(visible?: boolean): boolean {
    this.correctVisible = false;
    this.answersVisible = visible ?? !this.answersVisible;
    return this.answersVisible;
  }

  updateData(stats: AnswerStatistics) {
    if (stats) {
      const responses = (stats?.roundStatistics[0] as QtiRoundStatistics)
        ?.responses;
      this.updateCounter([stats.roundStatistics[0].answerCount]);
      if (!responses) {
        return;
      }
      this.responseWeights = stats.roundStatistics[0].independentCounts.map(
        (count, i) => new ResponseCloudItem(responses[i], Math.pow(count, 0.3))
      );
    }
  }

  setData(stats: AnswerStatistics, roundIndex: number) {
    let abstentionCount = 0;
    this.data[roundIndex] = [stats.roundStatistics[roundIndex].answerCount];
    if (this.content.abstentionsAllowed) {
      abstentionCount = stats.roundStatistics[roundIndex].abstentionCount;
      this.data[roundIndex].push(abstentionCount);
    }
  }

  updateCounterForRound() {
    this.updateCounter(this.data[this.roundsToDisplay]);
  }

  deleteAnswers() {
    this.data = [[], []];
  }

  toggleCorrect() {
    if (!this.correctResponses) {
      this.correctResponses = this.qtiItem?.nativeElement.variables
        .filter((v) => v.type === 'response' && v.identifier !== 'numAttempts')
        .map(
          (v) =>
            this.qtiItem?.nativeElement.getResponse(v.identifier)
              .correctResponse as string
        );
    }
    this.correctVisible = !this.correctVisible;
    return this.correctVisible;
  }

  answersConnected(event: CustomEvent) {
    this.qtiAnswers?.nativeElement.showCorrectResponse(true);
  }
}
