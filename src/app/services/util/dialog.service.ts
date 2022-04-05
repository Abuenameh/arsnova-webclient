import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UpdateAvailableEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { YesNoDialogComponent } from '../../components/shared/_dialogs/yes-no-dialog/yes-no-dialog.component';
import { InfoDialogComponent } from '../../components/shared/_dialogs/info-dialog/info-dialog.component';
import { ContentGroupCreationComponent } from '../../components/creator/_dialogs/content-group-creation/content-group-creation.component';
import { ClientAuthentication } from '../../models/client-authentication';
import { CreateCommentComponent } from '../../components/shared/_dialogs/create-comment/create-comment.component';
// import { RemindOfTokensComponent } from '../../components/shared/_dialogs/remind-of-tokens/remind-of-tokens.component';
import { RoomCreateComponent } from '../../components/shared/_dialogs/room-create/room-create.component';
import { StatisticHelpComponent } from '../../components/creator/_dialogs/statistic-help/statistic-help.component';
// import { UserBonusTokenComponent } from '../../components/shared/_dialogs/user-bonus-token/user-bonus-token.component';
import { OverlayComponent } from '../../components/home/_dialogs/overlay/overlay.component';
import { UserActivationComponent } from '../../components/home/_dialogs/user-activation/user-activation.component';
import { UpdateInfoComponent } from '../../components/shared/_dialogs/update-info/update-info.component';
import { UserRole } from '../../models/user-roles.enum';
import { VersionInfo } from '../../models/version-info';
import { ExportComponent, ExportOptions } from '../../components/creator/_dialogs/export/export.component';
import { EventCategory, TrackingService } from './tracking.service';

@Injectable()
export class DialogService {

  size = {
    xsmall: '350px',
    small: '400px',
    medium: '600px',
    large: '80%',
    xlarge: '90%',
    max: '832px',
  };

  constructor(public dialog: MatDialog,
              private trackingService: TrackingService) {
    // FIXME: This condition is currently necessary because there are multiple
    // dialog service instances - one per lazy loaded module. It is a workaround
    // until we have a way to only create a single instance and might break if
    // subscriptions to the afterOpened event are added in other places.
    if (!this.dialog.afterOpened.observed) {
      this.dialog.afterOpened.subscribe(dialogRef =>
          this.trackingService.addEvent(EventCategory.UI_DIALOG, 'Dialog opened', dialogRef.componentInstance.dialogId));
    }
  }

  openDialog<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T> {
    const ref = this.dialog.open(component, config);
    ref.afterClosed().subscribe(result =>
        this.trackingService.addEvent(EventCategory.UI_DIALOG,
            this.isCancelAction(result) ? 'Dialog cancelled' : 'Dialog confirmed', (ref.componentInstance as any).dialogId));
    return ref;
  }

  openDeleteDialog(body: string, bodyElement?: string, confirmLabel?: string): MatDialogRef<YesNoDialogComponent> {
    return this.openDialog(YesNoDialogComponent, {
      width: this.size.small,
      data: {
        section: 'dialog',
        headerLabel: 'sure',
        body: body,
        confirmLabel: confirmLabel ? confirmLabel : 'delete',
        abortLabel: 'cancel',
        type: 'button-warn',
        bodyElement: bodyElement,
      }
    });
  }

  openInfoDialog(section: string, body: string): void {
    this.openDialog(InfoDialogComponent, {
      maxWidth: this.size.max,
      width: this.size.xlarge,
      data: {
        section: section,
        body: body
      }
    });
  }

  openContentGroupCreationDialog(): MatDialogRef<ContentGroupCreationComponent> {
    return this.openDialog(ContentGroupCreationComponent, {
      width: this.size.small
    });
  }

  // Shared dialogs

  openCreateCommentDialog(auth: ClientAuthentication, tags: string[], roomId: string, directSend: boolean, fileUploadEnabled: boolean,
                          role: UserRole): MatDialogRef<CreateCommentComponent> {
    return this.openDialog(CreateCommentComponent, {
      width: this.size.small,
      data: {
        auth: auth,
        tags: tags,
        roomId: roomId,
        directSend: directSend,
        fileUploadEnabled: fileUploadEnabled,
        role: role
      }
    });
  }

  /*
  openTokenReminderDialog(): MatDialogRef<RemindOfTokensComponent> {
    return this.dialog.open(RemindOfTokensComponent, {
      width: this.size.medium
    });
  }
  */

  openRoomCreateDialog(): void {
    this.openDialog(RoomCreateComponent, {
      width: this.size.xsmall
    });
  }

  openStatisticHelpDialog(): void {
    this.openDialog(StatisticHelpComponent, {
      width: this.size.xsmall
    });
  }

  /*
  openBonusTokenDialog(userId: string, roomId: string): void {
    const dialogRef = this.dialog.open(UserBonusTokenComponent, {
      width: this.size.medium,
      data: {
        userId: userId,
        roomId: roomId
      }
    });
  }
  */

  openOverlayDialog(): MatDialogRef<OverlayComponent> {
    return this.openDialog(OverlayComponent);
  }

  openUserActivationDialog(username: string): MatDialogRef<UserActivationComponent> {
    return this.openDialog(UserActivationComponent, {
      width: this.size.xsmall,
      data: username
    });
  }

  openUpdateInfoDialog(
      afterUpdate: boolean,
      versions?: VersionInfo[],
      updateAvailable?: Observable<UpdateAvailableEvent>
  ): MatDialogRef<UpdateInfoComponent> {
    return this.openDialog(UpdateInfoComponent, {
      width: this.size.medium,
      disableClose: !afterUpdate,
      data: {
        afterUpdate: afterUpdate,
        versions: versions,
        updateAvailable: updateAvailable
      }
    });
  }

  openExportDialog(): MatDialogRef<ExportComponent, ExportOptions> {
    return this.openDialog(ExportComponent);
  }

  openPublishGroupDialog(groupName: string): MatDialogRef<YesNoDialogComponent> {
    return this.openDialog(YesNoDialogComponent, {
      width: this.size.small,
      data: {
        section: 'dialog',
        headerLabel: 'publish-group',
        body: 'want-publish-group',
        confirmLabel: 'publish',
        abortLabel: 'cancel',
        type: 'button-primary',
        bodyElement: groupName,
      }
    });
  }

  private isCancelAction(action: any) {
    return !action || action === 'cancel';
  }
}
