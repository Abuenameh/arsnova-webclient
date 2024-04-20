import { ContentType } from '@app/core/models/content-type.enum';
import { Answer } from './answer';
import { ResponseVariable } from '@citolab/qti-components';

export class QtiAnswer extends Answer {
  responses?: ResponseVariable[];

  constructor(
    contentId: string,
    round: number,
    responses?: ResponseVariable[]
  ) {
    super(contentId, round, ContentType.QTI);
    if (responses) {
      this.responses = responses;
    }
  }
}
