import { Injectable } from '@angular/core';
import { TextAnswer } from '@app/core/models/text-answer';
import { QtiAnswer } from '@app/core/models/qti-answer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractEntityService } from './abstract-entity.service';
import { ChoiceAnswer } from '@app/core/models/choice-answer';
import { TranslocoService } from '@ngneat/transloco';
import { NotificationService } from '@app/core/services/util/notification.service';
import { EventService } from '@app/core/services/util/event.service';
import { Answer } from '@app/core/models/answer';
import { CachingService } from '@app/core/services/util/caching.service';
import { WsConnectorService } from '@app/core/services/websockets/ws-connector.service';
import { AnswerOption } from '@app/core/models/answer-option';
import { PrioritizationAnswer } from '@app/core/models/prioritization-answer';
import { NumericAnswer } from '@app/core/models/numeric-answer';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ContentAnswerService extends AbstractEntityService<Answer> {
  serviceApiUrl = {
    text: '/text',
    choice: '/choice',
    qti: '/qti',
  };

  constructor(
    private http: HttpClient,
    protected ws: WsConnectorService,
    protected eventService: EventService,
    protected translateService: TranslocoService,
    protected notificationService: NotificationService,
    cachingService: CachingService
  ) {
    super(
      'Answer',
      '/answer',
      http,
      ws,
      eventService,
      translateService,
      notificationService,
      cachingService
    );
  }

  getAnswers(roomId: string, contentId: string): Observable<TextAnswer[]> {
    const url = this.buildUri(this.apiUrl.find, roomId);
    return this.http
      .post<TextAnswer[]>(
        url,
        {
          properties: { contentId: contentId },
          externalFilters: {},
        },
        httpOptions
      )
      .pipe(catchError(this.handleError('getAnswers', [])));
  }

  getResponses(roomId: string, contentId: string): Observable<QtiAnswer[]> {
    const url = this.buildUri(this.apiUrl.find, roomId);
    return this.http
      .post<QtiAnswer[]>(
        url,
        {
          properties: { contentId: contentId },
          externalFilters: {},
        },
        httpOptions
      )
      .pipe(catchError(this.handleError('getResponses', [])));
  }

  getAnswersByUserIdContentIds(
    roomId: string,
    userId: string,
    contentIds: string[]
  ): Observable<Answer[]> {
    const url = this.buildUri(this.apiUrl.find, roomId);
    return this.http
      .post<Answer[]>(
        url,
        {
          properties: {
            creatorId: userId,
            round: -1,
          },
          externalFilters: {
            contentIds: contentIds,
          },
        },
        httpOptions
      )
      .pipe(
        catchError(this.handleError<Answer[]>('getAnswersByUserIdContentIds'))
      );
  }

  getChoiceAnswerByContentIdUserIdCurrentRound(
    roomId: string,
    contentId: string,
    userId: string
  ): Observable<ChoiceAnswer> {
    const url = this.buildUri(this.apiUrl.find, roomId);
    return this.http
      .post<ChoiceAnswer[]>(
        url,
        {
          properties: {
            contentId: contentId,
            creatorId: userId,
          },
          externalFilters: {},
        },
        httpOptions
      )
      .pipe(
        map((list) => list[0]),
        catchError(
          this.handleError<ChoiceAnswer>(
            'getChoiceAnswerByContentIdUserIdCurrentRound'
          )
        )
      );
  }

  getTextAnswerByContentIdUserIdCurrentRound(
    roomId: string,
    contentId: string,
    userId: string
  ): Observable<TextAnswer> {
    const url = this.buildUri(this.apiUrl.find, roomId);
    return this.http
      .post<TextAnswer[]>(
        url,
        {
          properties: {
            contentId: contentId,
            creatorId: userId,
          },
          externalFilters: {},
        },
        httpOptions
      )
      .pipe(
        map((list) => list[0]),
        catchError(
          this.handleError<TextAnswer>(
            'getTextAnswerByContentIdUserIdCurrentRound'
          )
        )
      );
  }

  getQtiAnswerByContentIdUserIdCurrentRound(
    roomId: string,
    contentId: string,
    userId: string
  ): Observable<QtiAnswer> {
    const url = this.buildUri(this.apiUrl.find, roomId);
    return this.http
      .post<QtiAnswer[]>(
        url,
        {
          properties: {
            contentId: contentId,
            creatorId: userId,
          },
          externalFilters: {},
        },
        httpOptions
      )
      .pipe(
        map((list) => list[0]),
        catchError(
          this.handleError<QtiAnswer>(
            'getQtiAnswerByContentIdUserIdCurrentRound'
          )
        )
      );
  }

  addAnswerText(
    roomId: string,
    answerText: TextAnswer
  ): Observable<TextAnswer> {
    const url = this.buildUri('/', roomId);
    return this.requestOnce<TextAnswer>(
      'POST',
      url,
      answerText,
      httpOptions
    ).pipe(catchError(this.handleError<TextAnswer>('addTextAnswer')));
  }

  addAnswerChoice(
    roomId: string,
    answerChoice: ChoiceAnswer
  ): Observable<ChoiceAnswer> {
    const url = this.buildUri('/', roomId);
    return this.requestOnce<ChoiceAnswer>(
      'POST',
      url,
      answerChoice,
      httpOptions
    ).pipe(catchError(this.handleError<ChoiceAnswer>('addChoiceAnswer')));
  }

  addAnswerPrioritization(
    roomId: string,
    answer: PrioritizationAnswer
  ): Observable<PrioritizationAnswer> {
    const url = this.buildUri('/', roomId);
    return this.requestOnce<PrioritizationAnswer>(
      'POST',
      url,
      answer,
      httpOptions
    ).pipe(
      catchError(
        this.handleError<PrioritizationAnswer>('addAnswerPrioritization')
      )
    );
  }

  addAnswerNumeric(
    roomId: string,
    answer: NumericAnswer
  ): Observable<NumericAnswer> {
    const url = this.buildUri('/', roomId);
    return this.requestOnce<NumericAnswer>(
      'POST',
      url,
      answer,
      httpOptions
    ).pipe(catchError(this.handleError<NumericAnswer>('addAnswerNumeric')));
  }

  addAnswerQti(roomId: string, answerQti: QtiAnswer): Observable<QtiAnswer> {
    const url = this.buildUri('/', roomId);
    return this.requestOnce<QtiAnswer>(
      'POST',
      url,
      answerQti,
      httpOptions
    ).pipe(catchError(this.handleError<QtiAnswer>('addQtiAnswer')));
  }

  addAnswer<T extends Answer>(roomId: string, answer: T): Observable<T> {
    const url = this.buildUri('/', roomId);
    return this.requestOnce<T>('POST', url, answer, httpOptions).pipe(
      catchError(this.handleError<T>('addAnswer'))
    );
  }

  getAnswerText(roomId: string, id: string): Observable<TextAnswer> {
    const url = this.buildUri(`${this.serviceApiUrl.text}/${id}`, roomId);
    return this.http
      .get<TextAnswer>(url)
      .pipe(catchError(this.handleError<TextAnswer>(`getAnswerText id=${id}`)));
  }

  getAnswerChoice(roomId: string, id: string): Observable<ChoiceAnswer> {
    const url = this.buildUri(`${this.serviceApiUrl.choice}/${id}`, roomId);
    return this.http
      .get<ChoiceAnswer>(url)
      .pipe(
        catchError(this.handleError<ChoiceAnswer>(`getChoiceAnswer id=${id}`))
      );
  }

  getAnswerQti(roomId: string, id: string): Observable<QtiAnswer> {
    const url = this.buildUri(`${this.serviceApiUrl.text}/${id}`, roomId);
    return this.http
      .get<QtiAnswer>(url)
      .pipe(catchError(this.handleError<QtiAnswer>(`getAnswerQti id=${id}`)));
  }

  updateAnswerText(
    roomId: string,
    updatedAnswerText: TextAnswer
  ): Observable<TextAnswer> {
    const connectionUrl = this.buildUri(
      `${this.serviceApiUrl.text}/${updatedAnswerText.id}`,
      roomId
    );
    return this.http
      .put<TextAnswer>(connectionUrl, updatedAnswerText, httpOptions)
      .pipe(catchError(this.handleError<TextAnswer>('updateTextAnswer')));
  }

  updateAnswerChoice(
    roomId: string,
    updatedAnswerChoice: ChoiceAnswer
  ): Observable<ChoiceAnswer> {
    const connectionUrl = this.buildUri(
      `${this.serviceApiUrl.choice}/${updatedAnswerChoice.id}`,
      roomId
    );
    return this.http
      .put<ChoiceAnswer>(connectionUrl, updatedAnswerChoice, httpOptions)
      .pipe(catchError(this.handleError<ChoiceAnswer>('updateChoiceAnswer')));
  }

  updateAnswerQti(
    roomId: string,
    updatedAnswerQti: QtiAnswer
  ): Observable<QtiAnswer> {
    const connectionUrl = this.buildUri(
      `${this.serviceApiUrl.qti}/${updatedAnswerQti.id}`,
      roomId
    );
    return this.http
      .put<QtiAnswer>(connectionUrl, updatedAnswerQti, httpOptions)
      .pipe(catchError(this.handleError<QtiAnswer>('updateQtiAnswer')));
  }

  deleteAnswerText(roomId: string, id: string): Observable<TextAnswer> {
    const url = this.buildUri(`/${id}`, roomId);
    return this.http
      .delete<TextAnswer>(url, httpOptions)
      .pipe(catchError(this.handleError<TextAnswer>('deleteTextAnswer')));
  }

  deleteAnswerChoice(roomId: string, id: string): Observable<ChoiceAnswer> {
    const url = this.buildUri(`/${id}`, roomId);
    return this.http
      .delete<ChoiceAnswer>(url, httpOptions)
      .pipe(catchError(this.handleError<ChoiceAnswer>('deleteChoiceAnswer')));
  }

  deleteAnswerQti(roomId: string, id: string): Observable<QtiAnswer> {
    const url = this.buildUri(`/${id}`, roomId);
    return this.http
      .delete<QtiAnswer>(url, httpOptions)
      .pipe(catchError(this.handleError<QtiAnswer>('deleteQtiAnswer')));
  }

  hideAnswerText(roomId: string, id: string): Observable<void> {
    const url = this.buildUri(`/${id}/hide`, roomId);
    return this.http
      .post<void>(url, null, httpOptions)
      .pipe(catchError(this.handleError<void>('hideAnswer')));
  }

  shuffleAnswerOptions(answers: AnswerOption[]): AnswerOption[] {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = answers[i];
      answers[i] = answers[j];
      answers[j] = temp;
    }
    return answers;
  }
}
