import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/http/room.service';
import { Room } from '../../../models/room';
import { ActivatedRoute } from '@angular/router';

export interface Settings {
  headerName: string;
  iconName: string;
  componentName: string;
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  settings: Settings[] = [
    { headerName: 'settings.general', iconName: 'settings', componentName: 'generalSettings' },
    { headerName: 'settings.comments', iconName: 'comment', componentName: 'commentSettings' },
    { headerName: 'settings.moderators', iconName: 'gavel', componentName: 'moderatorSettings' },
    { headerName: 'settings.bonus-token-header', iconName: 'grade', componentName: 'tokenSettings' },
    { headerName: 'settings.tags', iconName: 'bookmark', componentName: 'tagSettings' }
  ];

  room: Room;
  isLoading = true;
  errorOnLoading = false;

  constructor(
    protected roomService: RoomService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const shortId = params['shortId'];
      this.roomService.getRoomByShortId(shortId).subscribe(
        room => {
          this.room = room;
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.errorOnLoading = true;
        }
      );
    });
  }

}
