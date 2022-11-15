export class Room {
  id: string;
  revision: string;
  ownerId: string;
  shortId: string;
  abbreviation: string;
  name: string;
  description: string;
  renderedDescription: string;
  passwordProtected: boolean;
  closed: boolean;
  settings: object;
  lmsCourseId: string;
  extensions: { [key: string ]: object };

  constructor(
    ownerId = '',
    shortId = '',
    abbreviation = '',
    name = '',
    description = '',
    closed = false,
    extensions: { [key: string ]: object } = {}
  ) {
    this.id = '';
    this.ownerId = ownerId;
    this.shortId = shortId;
    this.abbreviation = abbreviation;
    this.name = name;
    this.description = description;
    this.closed = closed;
    this.extensions = extensions;
  }
}
