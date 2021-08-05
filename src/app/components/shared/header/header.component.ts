import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientAuthentication } from '../../../models/client-authentication';
import { AuthProvider } from '../../../models/auth-provider';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/http/user.service';
import { EventService } from '../../../services/util/event.service';
import { KeyboardUtils } from '../../../utils/keyboard';
import { KeyboardKey } from '../../../utils/keyboard/keys';
import { DialogService } from '../../../services/util/dialog.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { Theme } from '../../../../theme/Theme';
import { ThemeService } from '../../../../theme/theme.service';
import { LanguageService } from '../../../services/util/language.service';
import { RoutingService } from '../../../services/util/routing.service';
import { ConsentService } from '../../../services/util/consent.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  auth: ClientAuthentication;
  deviceType: string;
  isGuest = true;
  isAdmin = false;

  /* FIXME: Those role values are not updated to the real role. */
  isParticipant = true;
  isCreator = false;

  themeClass: String;
  themes: Theme[];
  deviceWidth = innerWidth;
  helpUrl: string;
  privacyUrl: string;
  imprintUrl: string;
  showNews: boolean;
  lang: string;

  constructor(
    public location: Location,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    public router: Router,
    private translationService: TranslateService,
    private langService: LanguageService,
    private userService: UserService,
    public eventService: EventService,
    private _r: Renderer2,
    private dialogService: DialogService,
    private globalStorageService: GlobalStorageService,
    private themeService: ThemeService,
    private routingService: RoutingService,
    private route: ActivatedRoute,
    private consentService: ConsentService
  ) {
    this.deviceType = this.globalStorageService.getItem(STORAGE_KEYS.DEVICE_TYPE);
    this.lang = this.translationService.currentLang;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (document.getElementById('back-button') && KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit0) === true &&
      this.eventService.focusOnInput === false) {
      document.getElementById('back-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit9) === true && this.eventService.focusOnInput === false) {
      if (this.auth) {
        document.getElementById('room-button').focus();
      } else {
        document.getElementById('login-button').focus();
      }
    }
  }

  ngOnInit() {
    this.authenticationService.getAuthenticationChanges().subscribe(auth => {
      this.auth = auth;
      this.isGuest = !auth || auth.authProvider === AuthProvider.ARSNOVA_GUEST;
      this.isAdmin = !!auth && this.authenticationService.hasAdminRole(auth);
    });

    this.themeService.getTheme().subscribe(theme => {
      this.themeClass = theme;
    });
    this.themes = this.themeService.getThemes();
    this.route.data.subscribe(data => {
      this.helpUrl = data.apiConfig.ui.links?.help?.url;
      this.privacyUrl = data.apiConfig.ui.links?.privacy?.url;
      this.imprintUrl = data.apiConfig.ui.links?.imprint?.url ;
    });
    this.translationService.onLangChange.subscribe(e => this.lang = e.lang);
    this.showNews = false;
  }

  changeLanguage(lang: string) {
    this.langService.setLang(lang);
  }

  logout() {
    /*
    if (this.user.authProvider === AuthProvider.ARSNOVA_GUEST) {
      this.bonusTokenService.getTokensByUserId(this.user.id).subscribe(list => {
        if (list && list.length > 0) {
          const dialogRef = this.dialogService.openTokenReminderDialog();
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'logout') {
              this.logoutUser();
            }
          });
        } else {
          this.logoutUser();
        }
      });
    } else {
      this.logoutUser();
    }
    */
    this.logoutUser();
  }

  logoutUser() {
    this.authenticationService.logout();
    const msg = this.translationService.instant('header.logged-out');
    this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
    this.navToHome();
  }

  goBack() {
    this.routingService.goBack();
  }

  navToLogin() {
    this.router.navigateByUrl('login');
  }

  navToHome() {
    this.router.navigateByUrl('home');
  }

  navToUserHome() {
    this.router.navigate(['user']);
  }

  deleteAccount(id: string) {
    this.userService.delete(id).subscribe();
    this.authenticationService.logout();
    this.translationService.get('header.account-deleted').subscribe(msg => {
      this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
    });
    this.navToHome();
  }

  openDeleteUserDialog() {
    const dialogRef = this.dialogService.openDeleteDialog('really-delete-account');
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'abort') {
        return;
      } else if (result === 'delete') {
        this.deleteAccount(this.auth.userId);
      }
    });
  }

  changeTheme(theme: Theme) {
    this.themeClass = theme.key;
    this.themeService.activate(theme.key);
  }

  openUpdateInfoDialog() {
    const dialogRef = this.dialogService.openUpdateInfoDialog(true);
    dialogRef.afterClosed().subscribe(() => {
      this.showNews = false;
    });
  }

  showCookieSettings() {
    this.consentService.openDialog();
  }

  /*
  openUserBonusTokenDialog() {
    this.dialogService.openBonusTokenDialog(this.user.id);
  }
  */
}
