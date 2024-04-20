import { Content } from './content';
import { ContentType } from './content-type.enum';

// TODO: non-null assertion operator is used here temporaly. We need to find good structure for our models.
export class ContentQti extends Content {
  qtiItem: string;

  constructor(
    roomId: string = '',
    subject: string = '',
    body: string = '',
    qtiItem: string = '',
    groups: string[] = [],
    format: ContentType = ContentType.QTI
  ) {
    super(roomId, subject, body, groups, format, {});
    this.qtiItem = qtiItem;
  }
}
