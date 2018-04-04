import { Injectable } from '@angular/core';
import { Content } from '../../models/content';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { BaseHttpService } from './base-http.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ContentService extends BaseHttpService {
  private apiUrl = {
    base: 'https://arsnova-staging.mni.thm.de/api',
    content: '/content'
  };

  constructor(private http: HttpClient) {
    super();
  }

  getContents(roomId: string): Observable<Content[]> {
    const url = `${this.apiUrl.base}/?roomId=${roomId}`;
    return this.http.get<Content[]>(url).pipe(
      catchError(this.handleError('getContents', []))
    );
  }

  addContent(content: Content): Observable<Content> {
    return this.http.post<Content>(this.apiUrl.base + this.apiUrl.content + '/',
      { roomId: content.roomId, subject: content.subject, body: content.body, type: 'Content', format: content.format },
      httpOptions).pipe(
      catchError(this.handleError<Content>('addContent'))
    );
  }

  getContent(contentId: string): Observable<Content> {
    const url = `${this.apiUrl.base}/?contentId=${contentId}`;
    return this.http.get<Content>(url).pipe(
      catchError(this.handleError<Content>(`getContent id=${contentId}`))
    );
  }

  updateContent(content: Content) {
    // ToDo: implement service, api call
    console.log('Content updated.');
  }

  deleteContent(contentId: string) {
    // ToDo: implement service, api call
    console.log('Content deleted.');
  }
}
