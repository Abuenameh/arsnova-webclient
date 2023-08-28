import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Room } from '@app/core/models/room';
import { Announcement } from '@app/core/models/announcement';
import { MarkdownFeatureset } from '@app/core/services/http/formatting.service';
import { TranslateService } from '@ngx-translate/core';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { AnnouncementService } from '@app/core/services/http/announcement.service';
import { MatTabGroup } from '@angular/material/tabs';
import { DialogService } from '@app/core/services/util/dialog.service';
import { UserRole } from '@app/core/models/user-roles.enum';
import { FormComponent } from '@app/standalone/form/form.component';
import { FormService } from '@app/core/services/util/form.service';

@Component({
  selector: 'app-announcement-settings',
  templateUrl: './announcement-settings.component.html',
  styleUrls: ['./announcement-settings.component.scss'],
})
export class AnnouncementSettingsComponent
  extends FormComponent
  implements OnInit
{
  @ViewChild('inputTabs') inputTabs: MatTabGroup;
  @ViewChild('titleInput') titleInput: ElementRef;

  @Input() room: Room;

  title: string;
  body: string;
  announcements: Announcement[] = [];

  editId: string;
  renderPreview = false;
  markdownFeatureset = MarkdownFeatureset.SIMPLE;
  isLoading = true;

  UserRole = UserRole;

  constructor(
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private announcementService: AnnouncementService,
    private dialogService: DialogService,
    protected formService: FormService
  ) {
    super(formService);
  }

  ngOnInit(): void {
    this.announcementService
      .getByRoomId(this.room.id)
      .subscribe((announcements) => {
        this.announcements = announcements.sort((a, b) => {
          return (
            new Date(b.creationTimestamp).getTime() -
            new Date(a.creationTimestamp).getTime()
          );
        });
        this.isLoading = false;
      });
  }

  delete(announcement: Announcement) {
    const dialogRef = this.dialogService.openDeleteDialog(
      'announcement',
      'really-delete-announcement',
      announcement.title,
      undefined,
      () => this.announcementService.delete(this.room.id, announcement.id)
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        const msg = this.translateService.instant('announcement.deleted');
        this.notificationService.showAdvanced(
          msg,
          AdvancedSnackBarTypes.WARNING
        );
        this.announcements = this.announcements.filter(
          (n) => n.id !== announcement.id
        );
      }
    });
  }

  tabChanged(event) {
    this.renderPreview = event.index === 1;
  }

  save() {
    if (!this.title || !this.body) {
      const msg = this.translateService.instant('announcement.missing-input');
      this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      return;
    }
    if (this.editId) {
      this.disableForm();
      this.announcementService
        .update(this.room.id, this.editId, this.title, this.body)
        .subscribe(
          (announcement) => {
            const index = this.announcements
              .map((a) => a.id)
              .indexOf(announcement.id);
            this.announcements[index] = announcement;
            const msg = this.translateService.instant(
              'announcement.changes-saved'
            );
            this.notificationService.showAdvanced(
              msg,
              AdvancedSnackBarTypes.SUCCESS
            );
            this.reset();
            this.enableForm();
          },
          () => {
            this.enableForm();
          }
        );
    } else {
      this.disableForm();
      this.announcementService
        .add(this.room.id, this.title, this.body)
        .subscribe(
          (announcement) => {
            this.announcements.unshift(announcement);
            const msg = this.translateService.instant('announcement.created');
            this.notificationService.showAdvanced(
              msg,
              AdvancedSnackBarTypes.SUCCESS
            );
            this.reset();
            this.enableForm();
          },
          () => {
            this.enableForm();
          }
        );
    }
  }

  edit(announcement: Announcement) {
    if (!this.title && !this.body) {
      this.editId = announcement.id;
      this.title = announcement.title;
      this.body = announcement.body;
      this.titleInput.nativeElement.focus();
    } else {
      const dialogRef = this.dialogService.openDeleteDialog(
        'announcement',
        'really-discard-announcement',
        null,
        'discard'
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'abort') {
          return;
        } else if (result === 'discard') {
          this.resetInputs();
          this.edit(announcement);
        }
      });
    }
  }

  reset() {
    this.editId = null;
    this.inputTabs.selectedIndex = 0;
    this.renderPreview = false;
    this.resetInputs();
  }

  resetInputs() {
    this.title = '';
    this.body = '';
  }
}
