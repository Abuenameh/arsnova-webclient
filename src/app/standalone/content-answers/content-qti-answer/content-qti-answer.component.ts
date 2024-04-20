import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CoreModule } from '@app/core/core.module';
// import { QtiAnswer } from '@app/core/models/qti-answer';
import { ContentQti } from '@app/core/models/content-qti';
import { SafeHtmlPipe } from '@app/core/pipes/safe-html.pipe';
import {
  QtiAssessmentItem,
  VariableDeclaration,
  ResponseVariable,
} from '@citolab/qti-components';

@Component({
  selector: 'app-content-qti-answer',
  standalone: true,
  imports: [CoreModule, SafeHtmlPipe],
  templateUrl: './content-qti-answer.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContentQtiAnswerComponent {
  @Input({ required: true }) content!: ContentQti;
  // @Input() answer? : QtiAnswer;
  // @Input() responses : ResponseVariable[] = [];
  @Output() responsesChanged = new EventEmitter<ResponseVariable[]>();
  @ViewChild('qtiItem') qtiItem?: ElementRef<QtiAssessmentItem>;

  interactionChanged(event: CustomEvent) {
    if (this.qtiItem) {
      const responses = this.qtiItem.nativeElement.variables
        .filter(
          (variable: VariableDeclaration<string | string[] | null>) =>
            variable.type == 'response' && variable.identifier !== 'numAttempts'
        )
        .map((variable: VariableDeclaration<string | string[] | null>) =>
          this.qtiItem!.nativeElement.getResponse(variable.identifier)
        );
      this.responsesChanged.emit(responses);
      console.log(responses);
      console.log(
        responses.some((response: ResponseVariable) => response.value == null)
      );
    }
  }
}
