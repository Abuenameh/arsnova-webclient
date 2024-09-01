import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { TranslocoService } from '@jsverse/transloco';
import { ContentQti } from '@app/core/models/content-qti';
import { FormattingService } from '@app/core/services/http/formatting.service';
import { FormService } from '@app/core/services/util/form.service';
import { FormComponent } from '@app/standalone/form/form.component';
import { Content } from '@app/core/models/content';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ContentForm } from '@app/creator/content-group/content-editing/content-form';

@Component({
  selector: 'app-qti-content-form',
  templateUrl: './qti-content-form.component.html',
  providers: [
    {
      provide: 'ContentForm',
      useExisting: QtiContentFormComponent,
    },
  ],
})
export class QtiContentFormComponent
  extends FormComponent
  implements OnInit, OnChanges, ContentForm
{
  @Input() content?: Content;
  @Input() isEditMode = false;
  @Input() correctAnswerSelection = false;
  @Input() isQuiz = false;

  noCorrect = false;
  showResponses = false;
  qtiItem = '';

  constructor(
    private notificationService: NotificationService,
    private translationService: TranslocoService,
    private formattingService: FormattingService,
    protected formService: FormService
  ) {
    super(formService);
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.qtiItem = (this.content as ContentQti).qtiItem;
      this.showResponses = (this.content as ContentQti).showResponses;
    }
    if (!this.correctAnswerSelection) {
      this.noCorrect = !this.isQuiz;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.content.currentValue) {
      this.qtiItem = '';
      this.showResponses = false;
    }
  }

  changeShowResponses(change: MatCheckboxChange) {
    this.showResponses = change.checked;
  }

  getContent(): Content | undefined {
    if (this.qtiItem) {
      if (!this.isEditMode) {
        this.content = new ContentQti();
      }
      (this.content as ContentQti).qtiItem = this.qtiItem;
      (this.content as ContentQti).showResponses = this.showResponses;
      return this.content;
    } else {
      const msg = this.translationService.translate(
        'creator.content.need-answer'
      );
      this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      return;
    }
  }
}
