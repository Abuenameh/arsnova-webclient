import { Component, Input, OnInit } from '@angular/core';
import { Chart, LinearTickOptions } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../../services/http/content.service';
import { ContentChoice } from '../../../models/content-choice';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../../../theme/theme.service';

export class AnswerList {
  label: string;
  answer: string;

  constructor(label: string, answer: string) {
    this.label = label;
    this.answer = answer;
  }
}

@Component({
  selector: 'app-statistic-choice',
  templateUrl: './statistic-choice.component.html',
  styleUrls: ['./statistic-choice.component.scss']
})
export class StatisticChoiceComponent implements OnInit {

  @Input() content: ContentChoice;
  @Input() survey: boolean;

  chart: Chart;
  colors: string[] = [];
  indicationColors: string[] = [];
  label = 'ABCDEFGH';
  labels: string[] = [];
  answers: string[] = [];
  answerList: AnswerList[] = [];
  data: number[] = [];
  contentId: string;
  isLoading = true;
  colorLabel = false;

  constructor(protected route: ActivatedRoute,
              private contentService: ContentService,
              private translateService: TranslateService,
              private themeService: ThemeService) {
  }

  ngOnInit() {
    this.getData(this.content);
    this.isLoading = false;
  }

  createChart(colors: string[]) {
    const tickOptions: LinearTickOptions = {
      beginAtZero: true,
      precision: 0
    };
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: colors
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          mode: 'index'
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: tickOptions
          }]
        }
      }
    });
  }

  toggleCorrect(showsCorrect: boolean) {
    showsCorrect ? this.createChart(this.indicationColors) : this.createChart(this.colors);
    this.colorLabel = showsCorrect;
  }

  checkIfCorrect(index: number): boolean {
    return (this.content.options[index].points >= 0);
  }

  getData(content: ContentChoice) {
    const length = content.options.length;
    let green, grey, blue: string;
    this.themeService.getTheme().subscribe(theme => {
      green = this.themeService.getThemeByKey(theme).colors[19].color;
      grey = this.themeService.getThemeByKey(theme).colors[26].color;
      blue = this.themeService.getThemeByKey(theme).colors[25].color;
    });
    for (let i = 0; i < length; i++) {
      this.answerList[i] = new AnswerList(null, null);
      this.labels[i] = this.label.charAt(i);
      this.answerList[i].label = this.labels[i];
      this.answerList[i].answer = content.options[i].label;
      this.colors[i] = blue;
      if (!this.survey) {
        if (this.checkIfCorrect(i)) {
          this.indicationColors[i] = green;
        } else {
          this.indicationColors[i] = blue;
        }
      }
    }
    this.contentService.getAnswer(content.id).subscribe(answer => {
      this.data = answer.roundStatistics[0].independentCounts;
      this.data.push(answer.roundStatistics[0].abstentionCount);
      if (this.data[this.data.length - 1] > 0) {
        this.indicationColors.push(grey);
        this.colors.push(grey);
        this.translateService.get('statistic.abstentions').subscribe(label => {
          this.labels.push(label);
        });
      }
      this.createChart(this.colors);
    });
  }
}
