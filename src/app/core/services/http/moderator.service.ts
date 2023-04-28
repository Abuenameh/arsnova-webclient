import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Moderator } from '@app/core/models/moderator';
import { catchError } from 'rxjs/operators';
import { AbstractHttpService } from './abstract-http.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@app/core/services/util/notification.service';
import { EventService } from '@app/core/services/util/event.service';
import { UserRole } from '@app/core/models/user-roles.enum';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ModeratorService extends AbstractHttpService<Moderator> {
  constructor(
    private http: HttpClient,
    protected eventService: EventService,
    protected translateService: TranslateService,
    protected notificationService: NotificationService
  ) {
    super(
      '/moderator',
      http,
      eventService,
      translateService,
      notificationService
    );
  }

  get(roomId: string): Observable<Moderator[]> {
    const url = this.buildUri('', roomId);
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError<any>('getModerator')));
  }

  add(roomId: string, userId: string, role: UserRole) {
    const url = this.buildUri(`/${userId}?role=${role}`, roomId);
    return this.http
      .put(url, {}, httpOptions)
      .pipe(catchError(this.handleError<any>('addModerator')));
  }

  delete(roomId: string, userId: string) {
    const url = this.buildUri(`/${userId}`, roomId);
    return this.http
      .delete(url, httpOptions)
      .pipe(catchError(this.handleError<any>('deleteModerator')));
  }
}
