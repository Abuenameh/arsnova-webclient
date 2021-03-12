import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Moderator } from '../../models/moderator';
import { catchError } from 'rxjs/operators';
import { BaseHttpService } from './base-http.service';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../util/notification.service';
import { EventService } from '../util/event.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ModeratorService extends BaseHttpService {

  serviceApiUrl = {
    moderator: '/moderator'
  };

  constructor(private http: HttpClient,
              protected eventService: EventService,
              protected translateService: TranslateService,
              protected notificationService: NotificationService) {
    super(eventService, translateService, notificationService);
  }

  get(roomId: string): Observable<Moderator[]> {
    const url = `${this.getBaseUrl(roomId) + this.serviceApiUrl.moderator}`;
    return this.http.get(url, httpOptions).pipe(
      catchError(this.handleError<any>('getModerator'))
    );
  }

  add(roomId: string, userId: string) {
    const url = `${this.getBaseUrl(roomId) + this.serviceApiUrl.moderator}/${userId}`;
    return this.http.put(url, httpOptions).pipe(
      catchError(this.handleError<any>('addModerator'))
    );
  }

  delete(roomId: string, userId: string) {
    const url = `${this.getBaseUrl(roomId) + this.serviceApiUrl.moderator}/${userId}`;
    return this.http.delete(url, httpOptions).pipe(
      catchError(this.handleError<any>('deleteModerator'))
    );
  }

  getUserId(loginId: string): Observable<User[]> {
    const url = `${this.apiUrl.base + this.apiUrl.user + this.apiUrl.find}`;
    return this.http.post<User[]>(url, {
      properties: { loginId: loginId },
      externalFilters: {}
    }).pipe(
      catchError(this.handleError('getUserId', []))
    );
  }

  getUserData(userIds: string[]): Observable<User[]> {
    const url = `${this.apiUrl.base + this.apiUrl.user}/?ids=${userIds}`;
    return this.http.get<User[]>(url, httpOptions).pipe(
      catchError(this.handleError('getUserData', []))
    );
  }
}
