import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ModeratorService } from '../../../../services/http/moderator.service';
import { LanguageService } from '../../../../services/util/language.service';
import { Moderator } from '../../../../models/moderator';
import { FormControl, Validators } from '@angular/forms';
import { EventService } from '../../../../services/util/event.service';
import { DialogService } from '../../../../services/util/dialog.service';
import { UpdateEvent } from '../settings.component';
import { UserService } from '../../../../services/http/user.service';

@Component({
  selector: 'app-moderators',
  templateUrl: './moderators.component.html',
  styleUrls: ['./moderators.component.scss']
})
export class ModeratorsComponent implements OnInit {

  @Output() saveEvent: EventEmitter<UpdateEvent> = new EventEmitter<UpdateEvent>();

  @Input() roomId: string;
  moderators: Moderator[] = [];
  userIds: string[] = [];
  loginId = '';

  usernameFormControl = new FormControl('', [Validators.email]);

  constructor(private dialogService: DialogService,
              public notificationService: NotificationService,
              public translationService: TranslateService,
              protected moderatorService: ModeratorService,
              protected userService: UserService,
              protected langService: LanguageService,
              public eventService: EventService) {
    langService.langEmitter.subscribe(lang => translationService.use(lang));
  }

  ngOnInit() {
    this.getModerators();
  }

  getModerators() {
    this.moderatorService.get(this.roomId).subscribe(list => {
      this.moderators = list;
      this.moderators.forEach((user, i) => {
        this.userIds[i] = user.userId;
      });
      this.userService.getUserData(this.userIds).subscribe(users => {
        users.forEach((user, i) => {
          this.moderators[i].loginId = user.loginId;
        });
      });
    });
  }

  addModerator() {
    this.userService.getUserByLoginId(this.loginId).subscribe(list => {
      if (list.length === 0) {
        this.translationService.get('settings.moderator-not-found').subscribe(msg => {
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.FAILED);
        });
        return;
      }
      this.moderatorService.add(this.roomId, list[0].id).subscribe(() => {
        this.saveEvent.emit(new UpdateEvent(null, false, true));
        this.moderators.push(new Moderator(list[0].id, this.loginId));
        this.translationService.get('settings.moderator-added').subscribe(msg => {
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
        });
        this.loginId = '';
      });
    });
  }

  openDeleteRoomDialog(moderator: Moderator): void {
    const dialogRef = this.dialogService.openDeleteDialog('really-delete-moderator', moderator.loginId);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.removeModerator(moderator.userId, this.moderators.indexOf(moderator));
      }
    });
  }

  removeModerator(userId: string, index: number) {
    this.moderatorService.delete(this.roomId, userId).subscribe(() => {
      this.saveEvent.emit(new UpdateEvent(null, false, true));
      this.translationService.get('settings.moderator-removed').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
      this.moderators.splice(index, 1);
    });
  }
}
