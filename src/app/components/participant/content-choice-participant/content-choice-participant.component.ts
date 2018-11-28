import { Component, Input, OnInit } from '@angular/core';
import { ContentChoice } from '../../../models/content-choice';
import { AnswerOption } from '../../../models/answer-option';
import { ContentAnswerService } from '../../../services/http/content-answer.service';
import { NotificationService } from '../../../services/util/notification.service';
import { AnswerChoice } from '../../../models/answer-choice';
import { ContentType } from '../../../models/content-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';

class CheckedAnswer {
  answerOption: AnswerOption;
  checked: boolean;

  constructor(answerOption: AnswerOption, checked: boolean) {
    this.answerOption = answerOption;
    this.checked = checked;
  }
}

@Component({
  selector: 'app-content-choice-participant',
  templateUrl: './content-choice-participant.component.html',
  styleUrls: ['./content-choice-participant.component.scss']
})
export class ContentChoiceParticipantComponent implements OnInit {
  @Input() content: ContentChoice;
  ContentType: typeof ContentType = ContentType;

  selectedSingleAnswer: string;

  checkedAnswers: CheckedAnswer[] = [];
  isAnswerSent = false;

  constructor(private answerService: ContentAnswerService,
              private notificationService: NotificationService,
              private translateService: TranslateService,
              protected langService: LanguageService) {
  langService.langEmitter.subscribe(lang => translateService.use(lang));
}

  ngOnInit() {
    this.initAnswers();
    this.translateService.use(localStorage.getItem('currentLang'));
  }

  initAnswers(): void {
    for (const answerOption of this.content.options) {
      this.checkedAnswers.push(new CheckedAnswer(answerOption, false));
    }
  }

  // TODO: check answers

  submitAnswer(): void {
    let selectedAnswers: number[] = [];
    if (this.content.multiple) {
      for (let i = 0; i < this.checkedAnswers.length; i++) {
        if (this.checkedAnswers[i].checked) {
          selectedAnswers.push(i);
        }
      }
    } else {
      for (let i = 0; i < this.checkedAnswers.length; i++) {
        if (this.checkedAnswers[i].answerOption.label === this.selectedSingleAnswer) {
          selectedAnswers.push(i);
          break;
        }
      }
    }

    // TODO: i18n

    if (selectedAnswers.length === 0) {
      this.notificationService.show('At least 1 selection needed');
      this.isAnswerSent = false;
      return;
    }
    this.isAnswerSent = true;
    this.answerService.addAnswerChoice({
      id: null,
      revision: null,
      contentId: this.content.id,
      round: 1,
      selectedChoiceIndexes: selectedAnswers,
      creationTimestamp: null,
      format: ContentType.CHOICE
    } as AnswerChoice).subscribe();
    // TODO: replace matchip with notification
  }

  abstain($event) {
    $event.preventDefault();
    console.log('abstain');
    this.answerService.addAnswerChoice({
      id: null,
      revision: null,
      contentId: this.content.id,
      round: 1,
      selectedChoiceIndexes: [],
      creationTimestamp: null,
      format: ContentType.CHOICE
    } as AnswerChoice).subscribe();
  }
}
