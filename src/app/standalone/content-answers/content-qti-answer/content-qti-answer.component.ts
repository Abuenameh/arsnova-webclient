import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
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
  styleUrl: './content-qti-answer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContentQtiAnswerComponent {
  @Input({ required: true }) content!: ContentQti;
  @Input() answer?: QtiAnswer;
  @Input() isDisabled = false;
  @Input() correctAnswersPublished = false;
  @Input() responses: ResponseVariable[] = [];
  @Output() responsesChanged = new EventEmitter<ResponseVariable[]>();

  @ViewChild('qti') qti?: ElementRef<QtiAssessmentItem>;
  @ViewChild('qtiAnswers') qtiAnswers?: ElementRef<QtiAssessmentItem>;

  correctResponses?: (string | string[] | null | undefined)[];

  showAnswerIndicator(): boolean {
    return !!this.answer && this.correctAnswersPublished;
  }

  itemConnected(event: CustomEvent) {
    if (this.answer) {
      this.responses = this.answer.responses.map((response) => ({
        identifier: response.identifier,
        cardinality: response.cardinality,
        baseType: response.baseType,
        value:
          response.cardinality === 'single' ? response.value : response.values,
        correctResponse:
          response.cardinality === 'single'
            ? response.correctResponse
            : response.correctResponses,
        type: 'response',
      }));
    }
    const qtiItem = event.target as QtiAssessmentItem;
    qtiItem.variables = this.responses;
    this.correctResponses = this.qti?.nativeElement.variables
      .filter((v) => v.type === 'response' && v.identifier !== 'numAttempts')
      .map(
        (v) => this.qti?.nativeElement.getResponse(v.identifier).correctResponse
      );
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

  answersConnected(event: CustomEvent) {
    this.qtiAnswers?.nativeElement.showCorrectResponse(true);
  }
}
