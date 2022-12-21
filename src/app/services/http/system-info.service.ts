import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AbstractHttpService } from './abstract-http.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../util/notification.service';
import { EventService } from '../util/event.service';

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/vnd.spring-boot.actuator.v2+json,application/json',
  }),
};

export interface SummarizedStats {
  connectedUsers: number;
  users: number;
  rooms: number;
  answers: number;
  comments: number;
}

@Injectable()
export class SystemInfoService extends AbstractHttpService<void> {
  serviceApiUrl = {
    health: '/health',
    management: '/management/core',
    summarizedStats: '/_system/summarizedstats',
    serviceStats: '/_system/servicestats',
  };

  constructor(
    private http: HttpClient,
    protected eventService: EventService,
    protected translateService: TranslateService,
    protected notificationService: NotificationService
  ) {
    super('', http, eventService, translateService, notificationService);
  }

  getHealthInfo(): Observable<any> {
    const connectionUrl =
      this.apiUrl.base +
      this.serviceApiUrl.management +
      this.serviceApiUrl.health;
    /* Do not use default error handling here - 503 is expected if system health is not OK. */
    return this.http.get<any>(connectionUrl, httpOptions);
  }

  getSummarizedStats(): Observable<SummarizedStats> {
    const connectionUrl = this.apiUrl.base + this.serviceApiUrl.summarizedStats;
    return this.http
      .get<SummarizedStats>(connectionUrl, httpOptions)
      .pipe(
        catchError(this.handleError<SummarizedStats>('getSummarizedStats'))
      );
  }

  getServiceStats(): Observable<Map<string, any>> {
    const connectionUrl = this.apiUrl.base + this.serviceApiUrl.serviceStats;
    return this.http
      .get<Map<string, any>>(connectionUrl, httpOptions)
      .pipe(catchError(this.handleError<Map<string, any>>('getServiceStats')));
  }
}
