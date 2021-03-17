import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';
import { User } from '../../models/user';
import { AccountCreated } from '../../models/events/account-created';
import { AccountDeleted } from '../../models/events/account-deleted';
import { catchError, map, tap } from 'rxjs/operators';
import { EventService } from '../util/event.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../util/notification.service';

const httpOptions = {
  headers: new HttpHeaders({})
};

@Injectable()
export class UserService extends BaseHttpService {

  serviceApiUrl = {
    register: '/register',
    activate: '/activate',
    resetActivation: '/resetactivation',
    resetPassword: '/resetpassword'
  };

  constructor(private http: HttpClient,
              protected eventService: EventService,
              protected translateService: TranslateService,
              protected notificationService: NotificationService) {
    super(eventService, translateService, notificationService);
  }

  register(email: string, password: string): Observable<boolean> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.user + this.serviceApiUrl.register;

    return this.http.post<boolean>(connectionUrl, {
      loginId: email,
      password: password
    }, httpOptions).pipe(map(() => {
      const event = new AccountCreated();
      this.eventService.broadcast(event.type);
      return true;
    }));
  }

  activate(name: string, activationKey: string): Observable<string> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.user + '/~' + encodeURIComponent(name) +
      this.serviceApiUrl.activate + '?key=' + activationKey;

    return this.http.post<string>(connectionUrl, {}, httpOptions);
  }

  resetActivation(username: string): Observable<User> {
    const connectionUrl: string = this.apiUrl.base +
      this.apiUrl.user +
      '/~' + encodeURIComponent(username) +
      this.serviceApiUrl.resetActivation;
    return this.http.post<any>(connectionUrl, httpOptions).pipe(
      catchError(this.handleError<User>('resetActivation'))
    );
  }

  setNewPassword(email: string, key?: string, password?: string): Observable<boolean> {
    const connectionUrl: string =
      this.apiUrl.base +
      this.apiUrl.user +
      '/~' +
      email +
      this.serviceApiUrl.resetPassword;
    let body = {};
    if (key && password) {
      body = {
        key: key,
        password: password
      };
    }
    return this.http.post(connectionUrl, body, httpOptions).pipe(map(() => {
        return true;
    }));
  }

  delete(id: string): Observable<User> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.user + '/' + id;
    return this.http.delete<User>(connectionUrl, httpOptions).pipe(
      tap(() => {
        const event = new AccountDeleted();
        this.eventService.broadcast(event.type);
      }),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  getUserByLoginId(loginId: string): Observable<User[]> {
    const url = `${this.apiUrl.base + this.apiUrl.user + this.apiUrl.find}`;
    return this.http.post<User[]>(url, {
      properties: { loginId: loginId },
      externalFilters: {}
    }).pipe(
      catchError(this.handleError('getUserId', []))
    );
  }
}
