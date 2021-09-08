import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { RoomStatsService } from '../../../services/http/room-stats.service';
import { LanguageService } from '../../../services/util/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AnnounceService } from '../../../services/util/announce.service';
import { HotkeyService } from '../../../services/util/hotkey.service';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnInit, OnDestroy {

  shortId: string;
  roomId: string;
  lastGroup: string;
  featureString: string;
  groupChanged: EventEmitter<string> = new EventEmitter<string>();

  private hotkeyRefs: Symbol[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private globalStorageService: GlobalStorageService,
              private roomStatsService: RoomStatsService,
              private langService: LanguageService,
              private translateService: TranslateService,
              private announceService: AnnounceService,
              private hotkeyService: HotkeyService) {
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  ngOnInit(): void {
    this.globalStorageService.removeItem(STORAGE_KEYS.LAST_INDEX);
    document.body.style.background = 'var(--surface)';
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
    this.route.params.subscribe(params => {
      this.shortId = params['shortId'];
      this.lastGroup = params['contentGroup'];
      this.route.data.subscribe(data => {
        this.featureString = data.feature;
        this.roomId = data.room.id;
        if (this.lastGroup === undefined) {
          this.lastGroup = this.globalStorageService.getItem(STORAGE_KEYS.LAST_GROUP);
          if (this.lastGroup === undefined) {
            this.roomStatsService.getStats(this.roomId, true).subscribe(stats => {
              if (stats.groupStats) {
                this.lastGroup = stats.groupStats[0].groupName;
                this.setGroupInSessionStorage(this.lastGroup);
              }
            });
          }
        }
        setTimeout(() => {
          document.getElementById('welcome-message').focus();
        }, 500);
      });
    });
    this.hotkeyService.registerHotkey({
      key: 'i',
      action: () => this.announceShortcuts(),
      actionTitle: 'TODO'
    }, this.hotkeyRefs);
  }

  ngOnDestroy() {
    this.hotkeyRefs.forEach(h => this.hotkeyService.unregisterHotkey(h));
  }

  announceShortcuts() {
    this.announceService.announce('presentation.a11y-shortcuts');
  }

  updateFeature(feature: string) {
    this.featureString = feature;
    this.updateUrl();
  }

  updateUrl(group?: string) {
    const isGroup = this.featureString === 'group';
    let feature =  isGroup ? group || this.lastGroup : this.featureString;
    if (group) {
      this.lastGroup = group;
      this.groupChanged.emit(group);
      this.globalStorageService.removeItem(STORAGE_KEYS.LAST_INDEX);
    }
    const urlList = ['presentation', this.shortId, feature];
    if (!feature) {
      urlList.pop();
      document.getElementById('welcome-message').focus();
    }
    const urlTree = this.router.createUrlTree(urlList);
    this.location.replaceState(this.router.serializeUrl(urlTree));
  }

  setGroupInSessionStorage(group: string) {
    this.globalStorageService.setItem(STORAGE_KEYS.LAST_GROUP, group);
  }
}
