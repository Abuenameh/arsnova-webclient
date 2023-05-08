import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ContentGroupService } from '@app/core/services/http/content-group.service';
import { EventService } from '@app/core/services/util/event.service';
import { GroupContentComponent } from '@app/creator/content-list/group-content/group-content.component';

@Component({
  selector: 'app-content-group-creation',
  templateUrl: './content-group-creation.component.html',
})
export class ContentGroupCreationComponent {
  readonly dialogId = 'create-content-group';

  name = '';

  constructor(
    public dialogRef: MatDialogRef<GroupContentComponent>,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private contentGroupService: ContentGroupService,
    public eventService: EventService
  ) {}

  addContentGroup() {
    if (this.name) {
      if (this.contentGroupService.saveGroupInMemoryStorage(this.name)) {
        this.closeDialog(this.name);
      } else {
        this.translateService
          .get('content.duplicate-series-name')
          .subscribe((msg) => {
            this.notificationService.showAdvanced(
              msg,
              AdvancedSnackBarTypes.FAILED
            );
          });
      }
    } else {
      this.translateService.get('dialog.please-enter-name').subscribe((msg) => {
        this.notificationService.showAdvanced(
          msg,
          AdvancedSnackBarTypes.WARNING
        );
        document.getElementById('name-input').focus();
      });
    }
  }

  closeDialog(name?: string): void {
    if (name) {
      this.dialogRef.close(name);
    } else {
      this.dialogRef.close();
    }
  }
}