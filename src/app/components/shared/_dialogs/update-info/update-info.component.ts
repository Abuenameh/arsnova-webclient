import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiConfigService } from '../../../../services/http/api-config.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../../services/util/global-storage.service';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit {

  isLoading = true;
  keywords: string[] = [];
  newsUrl: string;
  showReleaseNotes = false;

  constructor(public dialogRef: MatDialogRef<UpdateInfoComponent>,
              private apiConfigService: ApiConfigService,
              private globalStorageService: GlobalStorageService) { }

  ngOnInit(): void {
    const version = this.globalStorageService.getItem(STORAGE_KEYS.VERSION);
    this.apiConfigService.getApiConfig$().subscribe(config => {
      const latestVersion = config.ui.version.id;
      if (!version || version < latestVersion) {
        this.showReleaseNotes = true;
        const changes: string[] = Object.values(config.ui.version.changes);
        for (let i = 0; i < changes.length; i++) {
          this.keywords.push(changes[i]);
        }
        this.newsUrl = config.ui.links.news.url;
        this.globalStorageService.setItem(STORAGE_KEYS.VERSION, latestVersion);
      }
      this.isLoading = false;
    });
  }

  close() {
    this.dialogRef.close();
  }

}
