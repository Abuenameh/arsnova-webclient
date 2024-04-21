import { Answer } from './answer';
import { QtiResponse } from './qti-response';
// import { ResponseVariable } from '@abuenameh/qti-components';

export class QtiAnswer extends Answer {
  responses: QtiResponse[] = [];
}
