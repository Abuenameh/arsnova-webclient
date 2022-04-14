import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClientAuthentication } from '../../../models/client-authentication';
import { UserRole } from '../../../models/user-roles.enum';
import { RoomService } from '../../../services/http/room.service';
import { EventService } from '../../../services/util/event.service';
import { RoomMembershipService } from '../../../services/room-membership.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { Observable, of, Subject, Subscription, zip } from 'rxjs';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/util/dialog.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { Membership } from '../../../models/membership';
import { filter, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RoomSummary } from '../../../models/room-summary';
import { RoomDeleted } from '../../../models/events/room-deleted';
import { AuthProvider } from '../../../models/auth-provider';
import { MembershipsChanged } from '../../../models/events/memberships-changed';
import { ExtensionFactory } from '../../../../../projects/extension-point/src/lib/extension-factory';
import { RoutingService } from '../../../services/util/routing.service';

interface RoomDataView {
  summary: RoomSummary;
  membership: Membership;
  transferred: boolean;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {
  @Input() auth: ClientAuthentication;
  showGuestAccountControls = false;
  isGuest = false;
  rooms: RoomDataView[] = [];
  roomIds: string[] = [];
  displayRooms: RoomDataView[];
  roomsFromGuest: RoomDataView[];
  guestAuth$: Observable<ClientAuthentication>;
  showRoomsFromGuest = false;
  isLoading = true;
  sub: Subscription;
  unsubscribe$ = new Subject<void>();
  deviceType: string;
  roles: Map<UserRole, string> = new Map<UserRole, string>();
  showImportMenu = false;

  creatorRole = UserRole.CREATOR;
  participantRole = UserRole.PARTICIPANT;
  executiveModeratorRole = UserRole.EXECUTIVE_MODERATOR;

  constructor(
    private roomService: RoomService,
    public eventService: EventService,
    protected roomMembershipService: RoomMembershipService,
    private authenticationService: AuthenticationService,
    public notificationService: NotificationService,
    private translateService: TranslateService,
    protected router: Router,
    private dialogService: DialogService,
    private globalStorageService: GlobalStorageService,
    private extensionFactory: ExtensionFactory,
    private routingService: RoutingService
  ) {
  }

  ngOnInit() {
    this.guestAuth$ = this.authenticationService.fetchGuestAuthentication().pipe(shareReplay());
    this.getRoomDataViews().pipe(takeUntil(this.unsubscribe$)).subscribe(roomDataViews => this.updateRoomList(roomDataViews));
    if (this.auth.authProvider === AuthProvider.ARSNOVA_GUEST) {
      this.isGuest = true;
    } else {
      this.showGuestAccountControls = !!this.authenticationService.getGuestToken();
    }
    this.showImportMenu = this.showGuestAccountControls || !!this.extensionFactory.getExtension('import-token');
    this.sub = this.eventService.on<any>('RoomDeleted').subscribe(payload => {
      this.rooms = this.rooms.filter(r => r.summary.id !== payload.id);
    });
    this.deviceType = this.globalStorageService.getItem(STORAGE_KEYS.DEVICE_TYPE);
    const roleKeys = [
      'room-list.a11y-participant-role',
      'room-list.a11y-executive-moderator-role',
      'room-list.a11y-editing-moderator-role',
      'room-list.a11y-creator-role',
    ];
    const roles = [
      UserRole.PARTICIPANT,
      UserRole.EXECUTIVE_MODERATOR,
      UserRole.EDITING_MODERATOR,
      UserRole.CREATOR
    ];
    this.translateService.get(roleKeys).subscribe(() => {
      for (let i = 0; i < roleKeys.length; i++) {
        this.roles.set(roles[i], this.translateService.instant(roleKeys[i]));
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getRoomDataViews(): Observable<RoomDataView[]> {
    const memberships$ = this.roomMembershipService.getMembershipChanges().pipe(filter(m => m !== null));
    return this.createRoomDataViewsFromMemberships(memberships$);
  }

  getGuestRooms() {
    this.getRoomDataViewsForGuest().subscribe(guestRooms => {
      if (guestRooms && guestRooms.length > 0) {
        this.roomsFromGuest = guestRooms;
        this.showRoomsFromGuest = true;
        setTimeout(() => {
          document.getElementById('guest-rooms').scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (this.isLoading) {
        this.translateService.get('room-list.transfer-no-rooms').subscribe(msg => {
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
        });
      }
    });
  }

  getRoomDataViewsForGuest(): Observable<RoomDataView[]> {
    const memberships$ = this.guestAuth$.pipe(
        switchMap(auth => {
          return this.roomMembershipService.getMembershipsForAuthentication(auth);
        }),
        map(memberships => {
          const ids = this.rooms.map(r => r.membership.roomId);
          return memberships.filter(m => ids.indexOf(m.roomId) === -1);
        }),
        shareReplay()
    );

    return this.createRoomDataViewsFromMemberships(memberships$);
  }

  private createRoomDataViewsFromMemberships(memberships$: Observable<Membership[]>) {
    const roomIds$ = memberships$.pipe(
        map(memberships => memberships.map(membership => membership.roomId))
    );
    const roomSummaries$ = roomIds$.pipe(
        switchMap(ids => ids.length > 0 ? this.roomService.getRoomSummaries(ids) : of([]))
    );

    return zip(memberships$, roomSummaries$).pipe(
        map((result) => {
          return result[0].map(membership => {
            return {
              membership: membership,
              summary: result[1].filter(summary => summary.id === membership.roomId)[0],
              transferred: false
            };
          });
        }));
  }

  updateRoomList(rooms: RoomDataView[]) {
    this.rooms = rooms;
    this.roomIds = rooms.map(r => r.summary.id);
    this.setDisplayedRooms(this.rooms);
    this.showGuestRooms();
    this.isLoading = false;
  }

  showGuestRooms() {
    if (this.displayRooms.length > 0) {
      return;
    } else if (this.isLoading) {
      this.getGuestRooms();
    }
  }

  setCurrentRoom(shortId: string, role: UserRole) {
    this.updateLastAccess(shortId);
    this.router.navigate([this.roleToString(role), shortId]);
  }

  navToSettings(shortId: string) {
    this.router.navigate(['edit', shortId, 'settings']);
  }

  openDeleteRoomDialog(room: RoomDataView) {
    if (room.membership.roles.indexOf(UserRole.CREATOR) === -1) {
      const dialogRef = this.dialogService.openDeleteDialog('room-membership', 'really-cancel-room-membership', room.summary.name);
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'delete') {
          this.cancelMembership(room);
        } else {
          this.roomDeletionCanceled();
        }
      });
    } else {
      const dialogRef = this.dialogService.openDeleteDialog('room', 'really-delete-room', room.summary.name);
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'delete') {
          this.deleteRoom(room);
        } else {
          this.roomDeletionCanceled();
        }
      });
      }
  }

  roomDeletionCanceled() {
    this.translateService.get('room-list.canceled-remove').subscribe(msg => {
      this.notificationService.show(msg);
    });
  }

  removeRoomFromList(room: RoomDataView) {
    this.rooms = this.rooms.filter(r => r.summary.id !== room.summary.id);
    this.setDisplayedRooms(this.rooms);
  }

  setDisplayedRooms(rooms: RoomDataView[]) {
    this.displayRooms = this.sortRooms(rooms);
  }

  private sortRooms(rooms: RoomDataView[]) {
    return rooms.sort((a, b) =>
        new Date(b.membership.lastVisit).getTime() - new Date(a.membership.lastVisit).getTime());
  }

  deleteRoom(room: RoomDataView) {
    this.roomService.deleteRoom(room.summary.id).subscribe(() => {
      this.translateService.get('room-list.room-successfully-deleted').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
      const event = new RoomDeleted(room.summary.id);
      this.eventService.broadcast(event.type, event.payload);
      this.removeRoomFromList(room);
    });
  }

  cancelMembership(room: RoomDataView) {
    this.roomMembershipService.cancelMembership(room.summary.shortId).subscribe(() => {
      this.translateService.get('room-list.room-successfully-removed').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
      this.removeRoomFromList(room);
    });
  }

  roleToString(role: UserRole): string {
    return this.routingService.getRoleString(role);
  }

  filterRooms(search: string) {
    if (search.length > 0) {
      this.setDisplayedRooms(this.rooms.filter(room => room.summary.name.toLowerCase().includes(search.toLowerCase())));
    } else {
      this.setDisplayedRooms(this.rooms);
    }
  }

  emitTransferChanges(roomDataView: RoomDataView) {
    roomDataView.transferred = true;
    const event = new MembershipsChanged();
    this.eventService.broadcast(event.type, event.payload);
    if (this.roomsFromGuest.filter(room => !room.transferred).length === 0) {
      this.showRoomsFromGuest = false;
    }
  }

  transferRoomFromGuest(roomDataView: RoomDataView) {
    this.guestAuth$.pipe(
        switchMap(auth => this.roomService.transferRoomThroughToken(roomDataView.membership.roomId, auth.token)),
        tap(r => this.translateService.get('room-list.transferred-successfully').subscribe(msg =>
            this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS)))
    ).subscribe(r => {
      this.emitTransferChanges(roomDataView);
    });
  }

  addRoomFromGuest(roomDataView: RoomDataView) {
    this.roomMembershipService.requestMembership(roomDataView.membership.roomShortId).pipe(
      tap(r => this.translateService.get('room-list.added-successfully').subscribe(msg =>
         this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS)))
    ).subscribe(r => {
      this.emitTransferChanges(roomDataView);
    });
  }

  updateLastAccess(shortId: string) {
    this.rooms.find(r => r.membership.roomShortId === shortId).membership.lastVisit = new Date().toISOString();
  }

  openCreateRoomDialog(): void {
    this.dialogService.openRoomCreateDialog();
  }
}
