import { Content } from './content';
import { ContentType } from './content-type.enum';

// TODO: non-null assertion operator is used here temporaly. We need to find good structure for our models.
export class ContentQti extends Content {
  qtiItem: string;
  showResponses: boolean;

  constructor(
    roomId: string = '',
    subject: string = '',
    body: string = '',
    qtiItem: string = '',
    showResponses: boolean = false,
    groups: string[] = [],
    format: ContentType = ContentType.QTI,
    duration?: number
  ) {
    super(roomId, subject, body, groups, format, duration);
    this.qtiItem = qtiItem;
    this.showResponses = showResponses;
  }
}
