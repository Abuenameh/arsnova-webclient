import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContentListBaseComponent } from '../../content-list/content-list-base.component';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { ContentGroupService } from '../../../../services/http/content-group.service';
import { EventService } from '../../../../services/util/event.service';

@Component({
  selector: 'app-content-group-creation',
  templateUrl: './content-group-creation.component.html',
  styleUrls: ['./content-group-creation.component.scss']
})
export class ContentGroupCreationComponent {
  readonly dialogId = 'create-content-group';

  name = '';

  constructor(
    public dialogRef: MatDialogRef<ContentListBaseComponent>,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private contentGroupService: ContentGroupService,
    public eventService: EventService
  ) {
  }

  addContentGroup() {
    if (this.name) {
      if (this.contentGroupService.saveGroupInMemoryStorage(this.name)) {
        this.closeDialog(this.name);
      } else {
        this.translateService.get('dialog.content-group-already-exists').subscribe(msg => {
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.FAILED);
        });
      }
    } else {
      this.translateService.get('dialog.please-enter-name').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
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
