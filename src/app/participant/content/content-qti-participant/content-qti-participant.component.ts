import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentAnswerService } from '@app/core/services/http/content-answer.service';
import { QtiAnswer } from '@app/core/models/qti-answer';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { TranslocoService } from '@ngneat/transloco';
import { EventService } from '@app/core/services/util/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalStorageService } from '@app/core/services/util/global-storage.service';
import { ContentParticipantBaseComponent } from '@app/participant/content/content-participant-base.component';
import { ContentQti } from '@app/core/models/content-qti';
import { FormService } from '@app/core/services/util/form.service';
import { take } from 'rxjs';
import {
  QtiAssessmentItem,
  VariableDeclaration,
  ResponseVariable,
} from '@citolab/qti-components';

@Component({
  selector: 'app-content-qti-participant',
  templateUrl: './content-qti-participant.component.html',
  // styleUrls: ['./content-qti-participant.component.scss'],
})
export class ContentQtiParticipantComponent extends ContentParticipantBaseComponent {
  @Input({ required: true }) content!: ContentQti;
  @Input({ required: true }) answer!: QtiAnswer;
  @Output() answerChanged = new EventEmitter<QtiAnswer>();

  givenAnswer?: QtiAnswer;

  responses: ResponseVariable[] = [];
  // textAnswer = '';

  constructor(
    protected answerService: ContentAnswerService,
    protected notificationService: NotificationService,
    protected translateService: TranslocoService,
    protected eventService: EventService,
    protected route: ActivatedRoute,
    protected globalStorageService: GlobalStorageService,
    protected router: Router,
    protected formService: FormService
  ) {
    super(
      notificationService,
      translateService,
      route,
      globalStorageService,
      router,
      formService
    );
  }

  init() {
    if (this.answer) {
      this.givenAnswer = this.answer;
    }
    this.isLoading = false;
  }

  submitAnswer() {
    if (
      this.responses.length == 0 ||
      this.responses.some(
        (response: ResponseVariable) => response.value == null
      )
    ) {
      this.translateService
        .selectTranslate('participant.answer.please-answer')
        .pipe(take(1))
        .subscribe((message) => {
          this.notificationService.showAdvanced(
            message,
            AdvancedSnackBarTypes.WARNING
          );
        });
      return;
    }
    this.disableForm();
    const answer = new QtiAnswer(
      this.content.id,
      this.content.state.round,
      this.responses
    );
    this.answerService
      .addAnswerQti(this.content.roomId, answer)
      .subscribe((answer) => {
        this.givenAnswer = answer;
        this.translateService
          .selectTranslate('participant.answer.sent')
          .pipe(take(1))
          .subscribe((msg) => {
            this.notificationService.showAdvanced(
              msg,
              AdvancedSnackBarTypes.SUCCESS
            );
          });
        this.sendStatusToParent(answer);
      }),
      () => {
        this.enableForm();
      };
  }

  abstain() {
    const answer = new QtiAnswer(this.content.id, this.content.state.round);
    this.answerService
      .addAnswerText(this.content.roomId, answer)
      .subscribe((answer) => {
        this.givenAnswer = answer;
        this.sendStatusToParent(answer);
      }),
      () => {
        this.enableForm();
      };
  }
}
