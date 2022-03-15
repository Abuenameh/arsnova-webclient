import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ThemeService } from '../../../../../theme/theme.service';
import { ContentScale } from '../../../../models/content-scale';
import { ContentService } from '../../../../services/http/content.service';
import { LikertScaleService } from '../../../../services/util/likert-scale.service';
import { StatisticChoiceComponent } from '../statistic-choice/statistic-choice.component';
import { EventService } from '../../../../services/util/event.service';
import { PresentationService } from '../../../../services/util/presentation.service';
import { GlobalStorageService } from '../../../../services/util/global-storage.service';

@Component({
  selector: 'app-statistic-scale',
  templateUrl: '../statistic-choice/statistic-choice.component.html',
  styleUrls: ['../statistic-choice/statistic-choice.component.scss']
})
export class StatisticScaleComponent extends StatisticChoiceComponent {
  constructor(
    protected route: ActivatedRoute,
    protected contentService: ContentService,
    protected translateService: TranslateService,
    protected themeService: ThemeService,
    protected eventService: EventService,
    protected presentationService: PresentationService,
    protected globalStorageService: GlobalStorageService,
    private likertScaleService: LikertScaleService
  ) {
    super(route, contentService, translateService, themeService, eventService, presentationService, globalStorageService);
  }

  init() {
    const scaleContent = this.content as ContentScale
    const optionLabels$ = this.likertScaleService.getOptionLabels(
        scaleContent.optionTemplate,
        scaleContent.optionCount)
        .map(l => this.translateService.get(l));
    forkJoin(optionLabels$).subscribe(labels => this.optionLabels = labels);
    this.correctOptionIndexes = [];
    super.init();
  }
}
