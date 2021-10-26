import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChoiceAnswer } from '../../../../models/choice-answer';
import { ContentScale } from '../../../../models/content-scale';
import { ContentType } from '../../../../models/content-type.enum';
import { AuthenticationService } from '../../../../services/http/authentication.service';
import { ContentAnswerService } from '../../../../services/http/content-answer.service';
import { GlobalStorageService } from '../../../../services/util/global-storage.service';
import { LanguageService } from '../../../../services/util/language.service';
import { LikertScaleService } from '../../../../services/util/likert-scale.service';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { ContentParticipantBaseComponent } from '../content-participant-base.component';
import { AnswerOption } from '../../../../models/answer-option';
import { SelectableAnswer } from '../../../../models/selectable-answer';

@Component({
  selector: 'app-content-scale-participant',
  templateUrl: './content-scale-participant.component.html'
})
export class ContentScaleParticipantComponent extends ContentParticipantBaseComponent {
  @Input() content: ContentScale;
  @Input() answer: ChoiceAnswer;
  @Input() alreadySent: boolean;
  @Input() sendEvent: EventEmitter<string>;
  @Input() statsPublished: boolean;
  @Output() answerChanged = new EventEmitter<ChoiceAnswer>();

  selectableAnswers: SelectableAnswer[] = [];
  hasAbstained = false;
  selectedAnswerIndex: number;

  constructor(
    authenticationService: AuthenticationService,
    protected answerService: ContentAnswerService,
    protected notificationService: NotificationService,
    protected translateService: TranslateService,
    langService: LanguageService,
    route: ActivatedRoute,
    globalStorageService: GlobalStorageService,
    router: Router,
    private likertScaleService: LikertScaleService
  ) {
    super(authenticationService, notificationService, translateService, langService, route, globalStorageService, router);
  }

  init() {
    this.selectableAnswers = this.likertScaleService.getOptionLabels(this.content.optionTemplate, this.content.optionCount)
      .map(label => new SelectableAnswer(new AnswerOption(label), false));
    if (this.answer) {
      if (this.answer.selectedChoiceIndexes?.length > 0) {
        this.selectedAnswerIndex = this.answer.selectedChoiceIndexes[0];
      } else {
        this.hasAbstained = true;
      }
    }
    this.isLoading = false;
  }

  setAnswer(index: number) {
    this.selectedAnswerIndex = index;
  }

  submitAnswer(): void {
    if (this.selectedAnswerIndex === undefined) {
      this.translateService.get('answer.please-one').subscribe(message => {
        this.notificationService.showAdvanced(message, AdvancedSnackBarTypes.WARNING);
      });
      return;
    }
    this.answerService.addAnswerChoice(this.content.roomId, {
      contentId: this.content.id,
      round: this.content.state.round,
      selectedChoiceIndexes: [this.selectedAnswerIndex],
      format: ContentType.SCALE
    } as ChoiceAnswer).subscribe(answer => {
      this.answer = answer;
      this.translateService.get('answer.sent').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
      });
      this.sendStatusToParent(answer);
    });
  }

  abstain() {
    this.answerService.addAnswerChoice(this.content.roomId, {
      contentId: this.content.id,
      round: this.content.state.round,
      format: ContentType.SCALE
    } as ChoiceAnswer).subscribe(answer => {
      this.hasAbstained = true;
      this.sendStatusToParent(answer);
    });
  }
}
