import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, pipe, take, throwError } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { EventService } from '@app/core/services/util/event.service';
import { HttpRequestFailed } from '@app/core/models/events/http-request-failed';
import { retryBackoff } from 'backoff-rxjs';

function defaultRetryBackoff(initialInterval = 3000) {
  return pipe(
    retryBackoff({
      initialInterval: initialInterval,
      maxRetries: 5,
      shouldRetry: (error) => (error as HttpErrorResponse).status >= 500,
    })
  );
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpOptions = {
  params?: HttpParams;
  headers?: HttpHeaders;
  body?: any;
  retry?: boolean;
  retryInitialInterval?: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class AbstractHttpService<T> {
  protected apiUrl = {
    base: '/api',
    find: '/find',
    room: '/room',
  };

  constructor(
    protected uriPrefix: string,
    protected httpClient: HttpClient,
    protected eventService: EventService,
    protected translateService: TranslocoService,
    protected notificationService: NotificationService
  ) {}

  /**
   * Performs a HTTP GET request. By default, if the request fails, it is send
   * again up to 5 times with exponential backoff delay.
   */
  protected performGet<U extends T | T[] = T>(
    uri: string,
    options: HttpOptions = {}
  ): Observable<U> {
    options.retry ??= true;
    return this.performGenericRequest('GET', uri, options);
  }

  protected performForeignGet<U>(
    uri: string,
    options: HttpOptions = {}
  ): Observable<U> {
    options.retry ??= true;
    return this.performGenericRequest('GET', uri, options);
  }

  /**
   * Performs a HTTP request. If options.retry is true, the request will be
   * send again up to 5 times with exponential backoff delay on failure.
   */
  protected performRequest<U extends T | T[] = T>(
    method: HttpMethod,
    uri: string,
    body?: T | Omit<T, 'id'>,
    options: Omit<HttpOptions, 'body'> = {}
  ): Observable<U> {
    (options as HttpOptions).body = body;
    return this.performGenericRequest(method, uri, options);
  }

  protected performGenericRequest<U>(
    method: HttpMethod,
    uri: string,
    options?: HttpOptions
  ): Observable<U> {
    const request$ = this.httpClient.request<U>(method, uri, options);
    return options?.retry
      ? request$.pipe(defaultRetryBackoff(options?.retryInitialInterval))
      : request$;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleError<T>(
    operation = 'operation',
    result?: T,
    badRequestMessage?: string
  ) {
    return (error: any): Observable<T> => {
      console.error(error);
      let message = null;
      switch (error?.status) {
        case 401:
          // NOOP
          break;
        case 400:
          message = badRequestMessage || 'errors.invalid-request';
          break;
        case 429:
          message = 'errors.http-too-many-requests';
          break;
        default:
          message = 'errors.something-went-wrong';
          break;
      }
      if (message) {
        this.translateService
          .selectTranslate(message)
          .pipe(take(1))
          .subscribe((msg) => {
            this.notificationService.showAdvanced(
              msg,
              AdvancedSnackBarTypes.FAILED
            );
          });
      }

      const event = new HttpRequestFailed(
        error.status,
        error.statusText,
        error.url
      );
      this.eventService.broadcast(event.type, event.payload);

      return throwError(error);
    };
  }

  /** Builds an URI for an endpoint which is related to this service's domain
   * and shares its common prefix. */
  buildUri(path: string, roomId?: string) {
    return this.getBaseUrl(roomId) + this.uriPrefix + path;
  }

  /** Builds an URI for an endpoint that does not use the common URI prefix of
   * this service. */
  buildForeignUri(path: string, roomId?: string) {
    return this.getBaseUrl(roomId) + path;
  }

  private getBaseUrl(roomId?: string): string {
    return this.apiUrl.base + (roomId ? this.apiUrl.room + '/' + roomId : '');
  }
}
