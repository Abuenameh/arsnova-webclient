import { Component, OnInit } from '@angular/core';
import { RoomCreateComponent } from '../../shared/_dialogs/room-create/room-create.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';

@Component({
  selector: 'app-home-actions',
  templateUrl: './home-actions.component.html',
  styleUrls: ['./home-actions.component.scss']
})
export class HomeActionsComponent implements OnInit {

  constructor(private router: Router,
              public dialog: MatDialog,
              private translateService: TranslateService,
              protected langService: LanguageService) {
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  ngOnInit() {
    this.translateService.use(localStorage.getItem('currentLang'));
  }

  openCreateRoomDialog(): void {
    this.dialog.open(RoomCreateComponent, {
      width: '350px'
    });
  }

  cookiesDisabled(): boolean {
    return localStorage.getItem('cookieAccepted') === 'false';
  }
}
