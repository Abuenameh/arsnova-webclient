import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/http/user.service';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { EventService } from '../../../services/util/event.service';
import { PasswordResetErrorStateMatcher } from '../password-reset/password-reset.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss']
})
export class RequestPasswordResetComponent implements OnInit {

  usernameFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new PasswordResetErrorStateMatcher();
  deviceWidth = innerWidth;
  username: string;

  constructor(private translationService: TranslateService,
              private userService: UserService,
              private notificationService: NotificationService,
              public eventService: EventService,
              private router: Router) { }

  ngOnInit(): void {
    const userData = history.state.data;
    if (userData && userData.username) {
      this.username = userData.username;
    }
  }

  resetPassword(): void {
    if (this.username && !this.usernameFormControl.hasError('required') && !this.usernameFormControl.hasError('email')) {
      this.username = this.username.trim();
      this.userService.setNewPassword(this.username).subscribe(() => {
          this.translationService.get('password-reset.reset-successful').subscribe(msg => {
            this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
          });
          this.router.navigate(['password-reset', this.username]);
        },
        err => {
          this.translationService.get('password-reset.request-failed').subscribe(msg => {
            this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.FAILED);
          });
        });
    } else {
      this.translationService.get('login.input-incorrect').subscribe(message => {
        this.notificationService.showAdvanced(message, AdvancedSnackBarTypes.WARNING);
      });
    }
  }

}
