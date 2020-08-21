import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiConfigService } from '../../../../services/http/api-config.service';
import { ConsentGiven, CookieCategory } from '../../../../services/util/consent.service';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit, AfterViewInit {

  @ViewChild('header') dialogTitle: ElementRef;

  privacyUrl: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public categories: CookieCategory[],
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CookiesComponent>,
    private apiConfigService: ApiConfigService
  ) {
  }

  ngOnInit() {
    // not really the nicest way but should do its job until a better or native solution was found
    setTimeout(() => document.getElementById('cookie-header').focus(), 400);
    this.apiConfigService.getApiConfig$().subscribe(config => {
      this.privacyUrl = config.ui.privacy;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.getElementById('cookie-header').focus();
    }, 500);
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
    console.debug('Accepted cookie categories: ', this.categories);
    const consentGiven: ConsentGiven = this.categories.reduce((map, item) => {
        map[item.id] = item.consent;
        return map;
      }, {});
    this.dialogRef.close(consentGiven);
    setTimeout(() => {
      document.getElementById('room-id-input').focus();
    }, 500);
  }
}
