import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { RoomService } from '../../../services/http/room.service';
import { Router } from '@angular/router';
import { EventService } from '../../../services/util/event.service';
import { LanguageService } from '../../../services/util/language.service';
import { MatDialog } from '@angular/material/dialog';
import { Room } from '../../../models/room';
import { Settings } from '../settings-page/settings-page.component';

export class UpdateEvent {
  room: Room;
  showSuccessInfo: boolean;
  loadRoom = false;

  constructor(room: Room, showSuccessInfo: boolean, loadRoom?: boolean) {
    this.room = room;
    this.showSuccessInfo = showSuccessInfo;
    this.loadRoom = loadRoom;
  }
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Output() updateEvent: EventEmitter<Room> = new EventEmitter<Room>();

  @Input() settings: Settings;
  @Input() room: Room;

  expanded = false;

  constructor(public dialog: MatDialog,
              public notificationService: NotificationService,
              public translationService: TranslateService,
              protected roomService: RoomService,
              public router: Router,
              public eventService: EventService,
              protected translateService: TranslateService,
              protected langService: LanguageService) {
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  ngOnInit() {
    if (this.settings.componentName === 'generalSettings') {
      this.expanded = true;
    }
  }

  expandSettings() {
    this.expanded = !this.expanded;
  }

  saveRoom(updateEvent: UpdateEvent) {
    if (!updateEvent.loadRoom) {
      this.roomService.updateRoom(updateEvent.room)
        .subscribe((room) => {
          this.updateEvent.emit(room);
          if (updateEvent.showSuccessInfo) {
            this.translateService.get('settings.changes-successful').subscribe(msg => {
              this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
            });
          }
        });
    } else {
     this.roomService.getRoom(this.room.id).subscribe(room => {
       this.updateEvent.emit(room);
     });
    }
  }
}
