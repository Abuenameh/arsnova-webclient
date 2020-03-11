import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Room } from '../../../models/room';
import { RoomRoleMixin } from '../../../models/room-role-mixin';
import { User } from '../../../models/user';
import { UserRole } from '../../../models/user-roles.enum';
import { Moderator } from '../../../models/moderator';
import { RoomService } from '../../../services/http/room.service';
import { EventService } from '../../../services/util/event.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { ModeratorService } from '../../../services/http/moderator.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommentService } from '../../../services/http/comment.service';
import { NotificationService } from '../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { RemoveFromHistoryComponent } from '../_dialogs/remove-from-history/remove-from-history.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {
  @Input() user: User;
  rooms: Room[] = [];
  roomsWithRole: RoomRoleMixin[];
  displayRooms: RoomRoleMixin[];
  closedRooms: Room[];
  isLoading = true;
  sub: Subscription;
  deviceType: string;

  creatorRole = UserRole.CREATOR;
  participantRole = UserRole.PARTICIPANT;
  executiveModeratorRole = UserRole.EXECUTIVE_MODERATOR;

  constructor(
    private roomService: RoomService,
    public eventService: EventService,
    protected authenticationService: AuthenticationService,
    private moderatorService: ModeratorService,
    private commentService: CommentService,
    public notificationService: NotificationService,
    private translateService: TranslateService,
    public dialog: MatDialog,
    protected router: Router
  ) {
  }

  ngOnInit() {
    this.getRooms();
    this.sub = this.eventService.on<any>('RoomDeleted').subscribe(payload => {
      this.roomsWithRole = this.roomsWithRole.filter(r => r.id !== payload.id);
    });
    this.deviceType = localStorage.getItem('deviceType');
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getRooms(): void {
    this.roomService.getParticipantRooms().subscribe(rooms => this.updateRoomList(rooms));
    this.roomService.getCreatorRooms().subscribe(rooms => {
      this.updateRoomList(rooms);
      this.isLoading = false;
    });
  }

  updateRoomList(rooms: Room[]) {
    this.rooms = this.rooms.concat(rooms);
    this.closedRooms = this.rooms.filter(room => room.closed);
    this.roomsWithRole = this.rooms.map(room => {
      const roomWithRole: RoomRoleMixin = <RoomRoleMixin>room;
      if (this.authenticationService.hasAccess(room.shortId, UserRole.CREATOR)) {
        roomWithRole.role = UserRole.CREATOR;
      } else {
        // TODO: acknowledge the other role option too
        roomWithRole.role = UserRole.PARTICIPANT;
        this.moderatorService.get(room.id).subscribe((moderators: Moderator[]) => {
          for (const m of moderators) {
            if (m.userId === this.user.id) {
              this.authenticationService.setAccess(room.shortId, UserRole.EXECUTIVE_MODERATOR);
              roomWithRole.role = UserRole.EXECUTIVE_MODERATOR;
            }
          }
        });
      }
      return roomWithRole;
    }).sort((a, b) => 0 - (a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1));
    for (const room of this.roomsWithRole) {
      this.commentService.countByRoomId(room.id, true).subscribe(count => {
        room.commentCount = count;
      });
    }
    this.setDisplayedRooms(this.roomsWithRole);
  }

  setCurrentRoom(shortId: string, role: UserRole) {
    this.authenticationService.assignRole(role);
    this.router.navigate([`${this.roleToString(role)}/room/${shortId}`]);
  }

  navToSettings(shortId: string) {
    this.router.navigate([`creator/room/${shortId}/settings`]);
  }

  openRemoveDialog(room: RoomRoleMixin) {
    const dialogRef = this.dialog.open(RemoveFromHistoryComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.roomName = room.name;
    dialogRef.componentInstance.role = room.role;
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'remove') {
        if (room.role < 3) {
          this.removeFromHistory(room);
        } else {
          this.deleteRoom(room);
        }
        this.rooms = this.rooms.filter(r => r.id !== room.id);
        this.closedRooms = this.closedRooms.filter(r => r.id !== room.id);
        this.roomsWithRole = this.roomsWithRole.filter(r => r.id !== room.id);
        this.setDisplayedRooms(this.roomsWithRole);
      } else {
        this.translateService.get('room-list.canceled-remove').subscribe(msg => {
          this.notificationService.show(msg);
        });
      }
    });
  }

  setDisplayedRooms(rooms: RoomRoleMixin[]) {
    this.displayRooms = rooms;
  }

  deleteRoom(room: Room) {
    this.roomService.deleteRoom(room.id).subscribe(() => {
      this.translateService.get('room-list.room-successfully-deleted').subscribe(msg => {
        this.notificationService.show(msg);
      });
    });
  }

  removeFromHistory(room: Room) {
    this.roomService.removeFromHistory(room.id).subscribe(() => {
      this.translateService.get('room-list.room-successfully-removed').subscribe(msg => {
        this.notificationService.show(msg);
      });
    });
  }

  roleToString(role: UserRole): string {
    switch (role) {
      case UserRole.CREATOR:
        return 'creator';
      case UserRole.PARTICIPANT:
        return 'participant';
      case UserRole.EXECUTIVE_MODERATOR:
        return 'moderator';
    }
  }

  filterRooms(search: string) {
    if (search.length > 2) {
      this.setDisplayedRooms(this.roomsWithRole.filter(room => room.name.includes(search.toLowerCase())));
    }
  }
}
