import { Injectable } from '@angular/core';
import { Room } from '../../models/room';
import { RoomStats } from '../../models/room-stats';
import { ContentGroup } from '../../models/content-group';
import { UserRole } from '../../models/user-roles.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { BaseHttpService } from './base-http.service';
import { EventService } from '../util/event.service';
import { TSMap } from 'typescript-map';

const httpOptions = {
  headers: new HttpHeaders({})
};

@Injectable()
export class RoomService extends BaseHttpService {
  private apiUrl = {
    base: '/api',
    rooms: '/room',
    user: '/user',
    findRooms: '/find',
    stats: '/stats',
    contentGroup: '/contentgroup'
  };
  private joinDate = new Date(Date.now());

  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private authService: AuthenticationService
  ) {
    super();
  }

  getCreatorRooms(): Observable<Room[]> {
    const connectionUrl = this.apiUrl.base + this.apiUrl.rooms + this.apiUrl.findRooms;
    return this.http.post<Room[]>(connectionUrl, {
      properties: { ownerId: this.authService.getUser().id },
      externalFilters: {}
    }).pipe(
      tap((rooms) => {
        for (const r of rooms) {
          this.authService.setAccess(r.shortId, UserRole.CREATOR);
        }
      }),
      catchError(this.handleError('getCreatorRooms', []))
    );
  }

  getParticipantRooms(): Observable<Room[]> {
    const connectionUrl = this.apiUrl.base + this.apiUrl.rooms + this.apiUrl.findRooms;
    return this.http.post<Room[]>(connectionUrl, {
      properties: {},
      externalFilters: { inHistoryOfUserId: this.authService.getUser().id }
    }).pipe(
      tap((rooms) => {
        for (const r of rooms) {
          this.authService.setAccess(r.shortId, UserRole.PARTICIPANT);
        }
      }),
      catchError(this.handleError('getParticipantRooms', []))
    );
  }

  addRoom(room: Room): Observable<Room> {
    delete room.id;
    delete room.revision;
    const connectionUrl = this.apiUrl.base + this.apiUrl.rooms + '/';
    room.ownerId = this.authService.getUser().id;
    return this.http.post<Room>(connectionUrl, room, httpOptions).pipe(
      tap(returnedRoom => {
        this.authService.setAccess(returnedRoom.shortId, UserRole.PARTICIPANT);
      }),
      catchError(this.handleError<Room>(`add Room ${room}`))
    );
  }

  getRoom(id: string): Observable<Room> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/${id}`;
    return this.http.get<Room>(connectionUrl).pipe(
      map(room => this.parseExtensions(room)),
      tap(room => this.setRoomId(room)),
      catchError(this.handleError<Room>(`getRoom keyword=${id}`))
    );
  }

  getRoomByShortId(shortId: string): Observable<Room> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/~${shortId}`;
    return this.http.get<Room>(connectionUrl).pipe(
      map(room => this.parseExtensions(room)),
      tap(room => this.setRoomId(room)),
      catchError(this.handleError<Room>(`getRoom shortId=${shortId}`))
    );
  }

  addToHistory(roomId: string): void {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.user}/${this.authService.getUser().id}/roomHistory`;
    this.http.post(connectionUrl, { roomId: roomId, lastVisit: this.joinDate.getTime() }, httpOptions).subscribe(() => {
    });
  }

  removeFromHistory(roomId: string): Observable<Room> {
    const connectionUrl = `${ this.apiUrl.base + this.apiUrl.user }/${ this.authService.getUser().id }/roomHistory/${roomId}`;
    return this.http.delete<Room>(connectionUrl, httpOptions).pipe(
      tap(() => ''),
      catchError(this.handleError<Room>('deleteRoom'))
    );
  }

  updateRoom(updatedRoom: Room): Observable<Room> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/~${updatedRoom.shortId}`;
    return this.http.put(connectionUrl, updatedRoom, httpOptions).pipe(
      tap(() => ''),
      catchError(this.handleError<any>('updateRoom'))
    );
  }

  patchRoom(roomId: string, changes: TSMap<string, any>): void {
    const connectionUrl = `${ this.apiUrl.base + this.apiUrl.rooms }/${ roomId }`;
    this.http.patch(connectionUrl, changes, httpOptions).subscribe();
  }

  deleteRoom(roomId: string): Observable<Room> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/${roomId}`;
    return this.http.delete<Room>(connectionUrl, httpOptions).pipe(
      tap(() => ''),
      catchError(this.handleError<Room>('deleteRoom'))
    );
  }

  getStats(roomId: string): Observable<RoomStats> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/${roomId}${this.apiUrl.stats}`;
    return this.http.get<RoomStats>(connectionUrl).pipe(
      tap(() => ''),
      catchError(this.handleError<RoomStats>(`getStats id=${roomId}`))
    );
  }

  getGroupByRoomIdAndName(roomId: string, name: string): Observable<ContentGroup> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/${roomId + this.apiUrl.contentGroup}/${name}`;
    return this.http.get<ContentGroup>(connectionUrl, httpOptions).pipe(
      tap(_ => ''),
      catchError(this.handleError<ContentGroup>(`getGroupByRoomIdAndName, ${roomId}, ${name}`))
    );
  }

  addContentToGroup(roomId: string, name: string, contentId: String): Observable<void> {
    const connectionUrl =
      `${this.apiUrl.base + this.apiUrl.rooms}/` +
      `${roomId + this.apiUrl.contentGroup}/${name}/${contentId}`;
    return this.http.post<void>(connectionUrl, {}, httpOptions).pipe(
      tap(_ => ''),
      catchError(this.handleError<void>(`addContentToGroup, ${roomId}, ${name}, ${contentId}`))
    );
  }

  updateGroup(roomId: string, name: string, contentGroup: ContentGroup): Observable<ContentGroup> {
    const connectionUrl = `${this.apiUrl.base + this.apiUrl.rooms}/${roomId + this.apiUrl.contentGroup}/${name}`;
    return this.http.put<ContentGroup>(connectionUrl, contentGroup, httpOptions).pipe(
      tap(_ => ''),
      catchError(this.handleError<ContentGroup>(`updateGroup, ${ roomId }, ${ name }, ${ ContentGroup }`))
    );
  }

  changeFeedbackLock(roomId: string, isFeedbackLocked: boolean) {
    this.getRoom(roomId).subscribe(room => {
      const changes = new TSMap<string, any>();
      room.settings['feedbackLocked'] = isFeedbackLocked;
      changes.set('settings', room.settings);
      this.patchRoom(roomId, changes);
    });
  }

  parseExtensions(room: Room): Room {
    if (room.extensions) {
      let extensions: TSMap<string, TSMap<string, any>> = new TSMap();
      extensions = room.extensions;
      room.extensions = extensions;
    }
    return room;
  }

  setRoomId(room: Room): void {
    localStorage.setItem('roomId', room.id);
  }
}
