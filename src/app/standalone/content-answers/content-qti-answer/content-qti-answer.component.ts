import {
  Component,
  EventEmitter,
  Input,
  Output,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { QtiAnswer } from '@app/core/models/qti-answer';
import { ContentQti } from '@app/core/models/content-qti';
import { SafeHtmlPipe } from '@app/core/pipes/safe-html.pipe';
import {
  QtiAssessmentItem,
  VariableDeclaration,
  ResponseVariable,
} from '@abuenameh/qti-components';

@Component({
  selector: 'app-content-qti-answer',
  standalone: true,
  imports: [CoreModule, SafeHtmlPipe],
  templateUrl: './content-qti-answer.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContentQtiAnswerComponent {
  @Input({ required: true }) content!: ContentQti;
  @Input() answer?: QtiAnswer;
  @Input() isDisabled = false;
  @Input() responses: ResponseVariable[] = [];
  @Output() responsesChanged = new EventEmitter<ResponseVariable[]>();

  itemConnected(event: CustomEvent) {
    const qtiItem = event.target as QtiAssessmentItem;
    qtiItem.variables = this.responses;
  }

  interactionChanged(event: CustomEvent) {
    const qtiItem = event.target as QtiAssessmentItem;
    const responses = qtiItem.variables
      .filter(
        (variable: VariableDeclaration<string | string[] | null>) =>
          variable.type == 'response' && variable.identifier !== 'numAttempts'
      )
      .map((variable: VariableDeclaration<string | string[] | null>) =>
        qtiItem!.getResponse(variable.identifier)
      );
    this.responsesChanged.emit(responses);
  }
}
