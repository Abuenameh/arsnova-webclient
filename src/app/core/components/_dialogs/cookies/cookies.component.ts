import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  ConsentGiven,
  CookieCategory,
} from '@app/core/services/util/consent.service';
import { TranslocoService } from '@ngneat/transloco';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss'],
})
export class CookiesComponent {
  readonly dialogId = 'cookie-settings';

  categories: CookieCategory[];
  privacyUrl: string;
  inputFocus = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    data: { categories: CookieCategory[]; privacyUrl: string },
    private dialogRef: MatDialogRef<CookiesComponent>,
    protected route: ActivatedRoute,
    private translateService: TranslocoService,
    private notificationService: NotificationService
  ) {
    this.categories = data.categories;
    this.privacyUrl = data.privacyUrl;
  }

  acceptAllCookies() {
    this.categories.forEach((item) => {
      item.consent = true;
    });
    this.handleCookieSelection();
  }

  acceptSelectedCookies() {
    this.handleCookieSelection();
  }

  handleCookieSelection() {
    console.log('Accepted cookie categories: ', this.categories);
    const consentGiven: ConsentGiven = {};
    this.categories.forEach((value) => {
      consentGiven[value.id] = value.consent;
    });
    this.dialogRef.close(consentGiven);
    const msg = this.translateService.translate('cookies.settings-saved');
    this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
  }
}
