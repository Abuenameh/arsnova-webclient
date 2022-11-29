import { Injectable } from '@angular/core';
import { AbstractHttpService } from '../http/abstract-http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CookiesComponent } from '../../components/home/_dialogs/cookies/cookies.component';
import { StorageItemCategory } from '../../models/storage';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './notification.service';
import { EventService } from './event.service';
import { ApiConfig } from '../../models/api-config';
import { ConsentChangedEvent } from '../../models/events/consent-changed';
import { GlobalStorageService, STORAGE_KEYS } from './global-storage.service';

export const CONSENT_VERSION = 1;

export interface ConsentGiven {
  [key: string]: boolean;
}

export interface CookieCategory {
  key: StorageItemCategory;
  id: string;
  required: boolean;
  consent: boolean;
}

export interface ConsentSettings {
  id?: string;
  version: number;
  timestamp: Date;
  consentGiven: { [key: string]: boolean };
}

const httpOptions = {
  headers: new HttpHeaders({})
};

@Injectable()
export class ConsentService extends AbstractHttpService<ConsentSettings> {
  private readonly categories: CookieCategory[] = [
    { key: StorageItemCategory.REQUIRED, id: 'essential', consent: true, required: true },
    { key: StorageItemCategory.FUNCTIONAL, id: 'functional', consent: false, required: false },
    { key: StorageItemCategory.STATISTICS, id: 'statistics', consent: false, required: false }
  ];
  private readonly categoryMap: Map<StorageItemCategory, CookieCategory> = this.categories.reduce((map, category) => {
    map.set(category.key, category);
    return map;
  }, new Map());
  private consentSettings: ConsentSettings;
  private privacyUrl: string;
  private consentRecording;

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private globalStorageService: GlobalStorageService,
    protected eventService: EventService,
    protected translateService: TranslateService,
    protected notificationService: NotificationService
  ) {
    super('/consent', http, eventService, translateService, notificationService);
    const settings = globalStorageService.getItem(STORAGE_KEYS.COOKIE_CONSENT);
    this.init(settings);
  }

  init(consentSettings: ConsentSettings) {
    if (this.validateSettings(consentSettings)) {
      this.consentSettings = consentSettings;
    }
    this.loadLocalSettings();
    this.globalStorageService.handleConsentChange({ categoriesSettings: this.categories });
  }

  setConfig(apiConfig: ApiConfig) {
    this.privacyUrl = apiConfig.ui.links?.privacy?.url;
    this.consentRecording = apiConfig.features?.consentRecording;
  }

  /**
   * Loads consent settings from local storage.
   */
  loadLocalSettings() {
    const consentGiven = this.getConsentSettings().consentGiven;
    this.categories.forEach(item => {
      item.consent = consentGiven[item.id] ?? item.consent;
    });
  }

  /**
   * Tells if the user still needs to give their consent.
   */
  consentRequired() {
    return !this.consentSettings || this.consentSettings.version !== CONSENT_VERSION ;
  }

  /**
   * Checks if the basic structure of the settings is valid.
   *
   * @param consentSettings
   */
  validateSettings(consentSettings: ConsentSettings) {
    return !!consentSettings?.consentGiven;
  }

  /**
   * Checks consent for a cookie category.
   *
   * @param categoryKey Key of the cookie category
   */
  consentGiven(categoryKey: StorageItemCategory) {
    return this.categoryMap.get(categoryKey)?.consent ?? false;
  }

  /**
   * Opens the cookie settings dialog.
   */
  openDialog() {
    const dialogRef = this.dialog.open(CookiesComponent, {
      width: '90%',
      maxWidth: '600px',
      autoFocus: true,
      data: { categories: this.categories, privacyUrl: this.privacyUrl }
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((res: ConsentGiven) => {
      this.updateConsentSettings(res);
    });
  }

  /**
   * Returns the current consent settings.
   */
  getConsentSettings(): ConsentSettings {
    return this.consentSettings || {
      version: CONSENT_VERSION,
      timestamp: new Date(),
      consentGiven: {}
    };
  }

  getInternalSettings(): CookieCategory[] {
    return this.categories;
  }

  /**
   * Updates consent settings locally and reports them to the backend if the
   * feature flag is set.
   *
   * @param consentGiven Consent values for each category
   */
  updateConsentSettings(consentGiven: ConsentGiven) {
    this.consentSettings = this.getConsentSettings();
    this.consentSettings.version = CONSENT_VERSION;
    this.consentSettings.timestamp = new Date();
    this.consentSettings.consentGiven = consentGiven;
    if (this.consentRecording?.enabled) {
      this.recordConsentSettings(this.consentSettings).subscribe(() => {
        const event = new ConsentChangedEvent(this.categories, this.consentSettings);
        this.eventService.broadcast(event.type, event.payload);
      });
    } else {
      const event = new ConsentChangedEvent(this.categories, this.consentSettings);
      this.eventService.broadcast(event.type, event.payload);
    }
  }

  /**
   * Reports the consent settings to the backend for record keeping.
   *
   * @param consentSettings Settings to report
   */
  recordConsentSettings(consentSettings: ConsentSettings) {
    const connectionUrl = this.buildUri('');
    return this.http.post<ConsentSettings>(connectionUrl, consentSettings, httpOptions).pipe(
      catchError(this.handleError<ConsentSettings>('recordConsentSettings'))
    );
  }
}
