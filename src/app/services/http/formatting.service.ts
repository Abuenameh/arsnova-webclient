import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../util/notification.service';

export enum MarkdownFeatureset {
  MINIMUM = 'MINIMUM',
  SIMPLE = 'SIMPLE',
  EXTENDED = 'EXTENDED'
}

export interface FormattingOptions {
  markdown: boolean;
  latex: boolean;
  markdownFeatureset: MarkdownFeatureset;
  linebreaks: boolean;
}

@Injectable()
export class FormattingService extends BaseHttpService {

  private apiUrl = {
    base: '/api',
    util: '/_util',
    formatting: '/formatting',
    render: '/render'
  };

  constructor(private http: HttpClient,
              protected translateService: TranslateService,
              protected notificationService: NotificationService) {
    super(translateService, notificationService);
  }

  postString(text: string, options?: FormattingOptions): Observable<any> {
    options = options ?? {
      markdown: true,
      latex: false,
      markdownFeatureset: MarkdownFeatureset.EXTENDED,
      linebreaks: true
    };
    const url = this.apiUrl.base + this.apiUrl.util + this.apiUrl.formatting + this.apiUrl.render;
    const body = {
      text: text,
      options: options
    };
    return this.http.post<any>(url, body).pipe(
      catchError(this.handleError('postString', body))
    );
  }
}
