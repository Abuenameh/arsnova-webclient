import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RegisterComponent } from '../../dialogs/register/register.component';
import { PasswordResetComponent } from '../../dialogs/password-reset/password-reset.component';
import { UserRole } from '../../../models/user-roles.enum';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginComponentPageComponent implements OnInit {
  // Make UserRole available to the template
  UserRole = UserRole;
  username: string;
  password: string;

  constructor(public dialog: MatDialog) {
  }

  openRegisterDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '350px'
    }).afterClosed().subscribe(result => {
      this.username = result.username;
      this.password = result.password;
    });
  }

  openPasswordDialog(): void {
    this.dialog.open(PasswordResetComponent, {
      width: '350px'
    });
  }

  ngOnInit() {
  }

}
