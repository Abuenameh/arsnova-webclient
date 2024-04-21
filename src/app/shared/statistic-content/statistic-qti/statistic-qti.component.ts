import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ContentService } from '@app/core/services/http/content.service';
import { ContentQti } from '@app/core/models/content-qti';
import { TranslocoService } from '@ngneat/transloco';
import { ThemeService } from '@app/core/theme/theme.service';
import { AnswerStatistics } from '@app/core/models/answer-statistics';
import {
  ABSTENTION_SIGN,
  StatisticContentBaseComponent,
} from '@app/shared/statistic-content/statistic-content-base';
import { ContentType } from '@app/core/models/content-type.enum';
import { takeUntil } from 'rxjs';
import { EventService } from '@app/core/services/util/event.service';
import { PresentationService } from '@app/core/services/util/presentation.service';
import { QtiAssessmentItem } from '@abuenameh/qti-components';

@Component({
  selector: 'app-statistic-qti',
  templateUrl: './statistic-qti.component.html',
  styleUrls: ['./statistic-qti.component.scss'],
})
export class StatisticQtiComponent
  extends StatisticContentBaseComponent
  implements OnInit, OnDestroy
{
  @Input({ required: true }) content!: ContentQti;
  @Input() directShow = false;
  @ViewChild('qtiItem') qtiItem?: ElementRef<QtiAssessmentItem>;

  data: Array<number[]> = [[], []];
  rounds = 1;
  roundsToDisplay = 0;
  abstentionCount = 0;
  independentAnswerCount: number[][] = [[], [], []];
  ContentType: typeof ContentType = ContentType;
  correctVisible = false;

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
    return true;
  }

  updateData(stats: AnswerStatistics) {
    if (stats) {
      if (this.rounds > 1) {
        for (let i = 0; i < this.rounds; i++) {
          if (stats.roundStatistics[i]) {
            this.setData(stats, i);
          }
        }
      } else {
        this.setData(stats, this.roundsToDisplay);
      }
    } else {
      this.deleteAnswers();
    }
    this.updateCounterForRound();
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
    this.correctVisible = !this.correctVisible;
    if (this.qtiItem) {
      this.qtiItem.nativeElement.showCorrectResponse(this.correctVisible);
    }
    return this.correctVisible;
  }
}
