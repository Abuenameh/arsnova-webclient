import { Component, Inject } from '@angular/core';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { UserService } from '../../../../services/http/user.service';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../../services/util/event.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.scss']
})
export class UserActivationComponent {
  readonly dialogId = 'activate-user';

  activationKeyFormControl = new UntypedFormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public userService: UserService,
    public notificationService: NotificationService,
    public dialogRef: MatDialogRef<UserActivationComponent>,
    private translationService: TranslateService,
    public eventService: EventService) {
  }

  login(activationKey: string): void {
    if (activationKey.length < 1) {
      this.translationService.get('user-activation.key-required').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
    } else {
      activationKey = activationKey.trim();
      this.userService.activate(this.data, activationKey).subscribe(() => {
          this.dialogRef.close({ success: true });
        },
        err => {
          this.translationService.get('user-activation.key-incorrect').subscribe(msg => {
            this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.FAILED);
          });
        }
      );
    }
  }

  resetActivation(): void {
    this.userService.resetActivation(this.data.trim()).subscribe(() => {
        this.translationService.get('user-activation.sent-again').subscribe(msg => {
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
        });
      }
    );
  }

  /**
   * Returns a lambda which closes the dialog on call.
   */
  buildCloseDialogActionCallback(): () => void {
    return () => this.dialogRef.close();
  }

  /**
   * Returns a lambda which executes the dialog dedicated action on call.
   */
  buildActivationActionCallback(activationKey: HTMLInputElement): () => void {
    return () => this.login(activationKey.value);
  }
}
