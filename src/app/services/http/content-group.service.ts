import { Injectable } from '@angular/core';
import { Room } from '../../models/room';
import { ContentGroup } from '../../models/content-group';
import { RoomJoined } from '../../models/events/room-joined';
import { RoomCreated } from '../../models/events/room-created';
import { UserRole } from '../../models/user-roles.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { BaseHttpService } from './base-http.service';
import { EventService } from '../util/event.service';
import { TSMap } from 'typescript-map';

const httpOptions = {
  headers: new HttpHeaders({})
};

@Injectable()
export class ContentGroupService extends BaseHttpService {
  private apiUrl = {
    base: '/api',
    rooms: '/room',
    user: '/user',
    findRooms: '/find',
    stats: '/stats'
  };

  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private authService: AuthenticationService
  ) {
    super();
  }

  getByRoomIdAndName(roomId: string, name: string): Observable<ContentGroup> {
    const connectionUrl = `${ this.apiUrl.base +  this.apiUrl.rooms }/${ roomId }/${ name }`;
    return this.http.get<ContentGroup>(connectionUrl, httpOptions).pipe(
        tap(_ => ''),
        catchError(this.handleError<ContentGroup>(`getByRoomIdAndName, ${ roomId }, ${ name }`))
      );
  }

}
