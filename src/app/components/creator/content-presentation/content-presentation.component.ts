import { Component, EventEmitter, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../../services/http/content.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';
import { Content } from '../../../models/content';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { RoomService } from '../../../services/http/room.service';
import { StepperComponent } from '../../shared/stepper/stepper.component';
import { Location } from '@angular/common';
import { ContentGroupService } from '../../../services/http/content-group.service';
import { InfoBarItem } from '../../shared/bars/info-bar/info-bar.component';
import { EventService } from '../../../services/util/event.service';
import { KeyboardUtils } from '../../../utils/keyboard';
import { KeyboardKey } from '../../../utils/keyboard/keys';
import { ContentGroup } from '../../../models/content-group';
import { DialogService } from '../../../services/util/dialog.service';
import { PublishContentComponent } from '../../shared/_dialogs/publish-content/publish-content.component';
import { AnnounceService } from '../../../services/util/announce.service';
import { ContentType } from '../../../models/content-type.enum';

@Component({
  selector: 'app-content-presentation',
  templateUrl: './content-presentation.component.html',
  styleUrls: ['./content-presentation.component.scss']
})
export class ContentPresentationComponent implements OnInit {

  @Input() isPresentation = false;
  @Input() groupChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(StepperComponent) stepper: StepperComponent;

  contents: Content[];
  isLoading = true;
  entryIndex = 0;
  contentIndex = 0;
  shortId: number;
  roomId: string;
  contentGroupName: string;
  currentStep = 0;
  infoBarItems: InfoBarItem[] = [];
  answerCount;
  routeChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  contentGroup: ContentGroup;

  constructor(
    protected route: ActivatedRoute,
    private roomService: RoomService,
    private contentService: ContentService,
    private contentGroupService: ContentGroupService,
    private translateService: TranslateService,
    protected langService: LanguageService,
    private globalStorageService: GlobalStorageService,
    private location: Location,
    private router: Router,
    private eventService: EventService,
    private dialogService: DialogService,
    private announceService: AnnounceService
  ) {
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.isPresentation && !this.eventService.focusOnInput) {
      if (KeyboardUtils.isKeyEvent(event, KeyboardKey.LetterL) === true) {
        this.updatePublishedIndexes();
      }
    }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
    this.route.params.subscribe(params => {
      const lastIndex = this.globalStorageService.getItem(STORAGE_KEYS.LAST_INDEX);
      this.entryIndex = (this.isPresentation && lastIndex > -1 ? lastIndex : params['contentIndex'] - 1) || 0;
      this.contentGroupName = this.globalStorageService.getItem(STORAGE_KEYS.LAST_GROUP) || params['contentGroup'];
      this.globalStorageService.setItem(STORAGE_KEYS.LAST_GROUP, this.contentGroupName);
      this.route.data.subscribe(data => {
        this.roomId = data.room.id;
        this.shortId = data.room.shortId;
        this.initGroup(true);
      });
    });
    if (this.isPresentation) {
      this.groupChanged.subscribe(group => {
        this.isLoading = true;
        this.contentGroupName = group;
        this.initGroup()
      })
    }
  }

  initScale() {
    if (this.isPresentation) {
      const scale = Math.max((Math.min(innerWidth, 2100) / 1100), 1);
      document.getElementById('stepper-container').style.transform = `scale(${scale})`;
      document.getElementById('stepper-container').style.left = `calc(50vw - calc(305px * ${scale})`;
      document.getElementById('stepper-container').style.top = `calc(4vw - calc(1em * ${scale}))`;
    }
  }

  initGroup(initial = false) {
    this.contentGroupService.getByRoomIdAndName(this.roomId, this.contentGroupName, true).subscribe(group => {
      this.contentGroup = group;
      this.contentService.getContentsByIds(this.contentGroup.roomId, this.contentGroup.contentIds, true).subscribe(contents => {
        this.contents = this.contentService.getSupportedContents(contents);
        this.isLoading = false;
        this.initScale();
        if (this.entryIndex > -1) {
          this.contentIndex = initial ? this.entryIndex : 0;
          this.currentStep = this.contentIndex;
          setTimeout(() => {
            this.stepper.init(this.contentIndex, this.contents.length);
          }, 100);
        }
        if (this.infoBarItems.length === 0) {
          this.infoBarItems.push(new InfoBarItem('content-counter', 'people', this.getStepString()));
        } else {
          this.updateInfoBar();
        }
        setTimeout(() => {
          const id = this.isPresentation ? 'presentation-mode-message' : 'presentation-message';
          document.getElementById(id).focus();
        }, 700);
      });
    });
  }

  announcePresentationShortcuts() {
    this.announceService.announce('presentation.a11y-content-shortcuts');
    document.getElementById('presentation-mode-message').blur();
  }

  getStepString(): string {
    return `${this.currentStep + 1} / ${this.contents.length}`;
  }

  updateURL(index: number) {
    this.currentStep = index;
    const urlIndex = index + 1;
    let urlTree;
    if (this.isPresentation) {
      urlTree = this.router.createUrlTree(['presentation', this.shortId, this.contentGroupName, urlIndex]);
    } else {
      urlTree = this.router.createUrlTree(['creator/room', this.shortId, 'group', this.contentGroupName, 'statistics', urlIndex]);
    }
    this.location.replaceState(this.router.serializeUrl(urlTree));
    if (index !== this.entryIndex) {
      this.contentIndex = null;
    }
    this.updateInfoBar();
    this.routeChanged.emit(true);
    setTimeout(() => {
      const id = [ContentType.SLIDE, ContentType.FLASHCARD].indexOf(this.contents[index].format) > -1 ? 'message-type-info-button' : 'message-button';
      document.getElementById(id).focus();
    }, 300);
  }

  updateCounter($event, isActive) {
    if (isActive) {
      this.answerCount = $event;
    }
  }

  updateInfoBar() {
    this.infoBarItems[0].count = this.getStepString();
    this.sendContentStepState();
  }

  sendContentStepState() {
    let position;
    if (this.currentStep === 0) {
      position = 'START';
    } else if (this.currentStep === this.contents.length - 1) {
      position = 'END';
    }
    const state = {position: position, index: this.currentStep};
    this.eventService.broadcast('ContentStepStateChanged', state);
  }

  areContentsPublished() {
    return this.contentGroup.firstPublishedIndex > -1;
  }

  isContentAfterPublished() {
    return this.contentGroup.firstPublishedIndex < this.currentStep
  }

  areContentsBetween() {
    return this.contentGroup.lastPublishedIndex + 1 < this.currentStep;
  }

  isFirstPublished() {
    return this.contentGroup.firstPublishedIndex === this.currentStep;
  }

  isLastPublished() {
    return this.contentGroup.lastPublishedIndex === this.currentStep;
  }

  isOutOfScope() {
    return this.contentGroup.lastPublishedIndex > this.currentStep;
  }


  updatePublishedIndexes() {
    let firstIndex = this.currentStep;
    let lastIndex = this.currentStep;
    if (this.areContentsPublished()) {
      if (this.isContentAfterPublished()) {
        if (this.areContentsBetween()) {
          const dialogRef = this.dialogService.openDialog(PublishContentComponent);
          this.eventService.makeFocusOnInputTrue();
          dialogRef.afterClosed().subscribe(result => {
            this.eventService.makeFocusOnInputFalse();
            if (result === true) {
              this.updateContentGroup(firstIndex, lastIndex);
            } else if (result === false) {
              firstIndex = this.contentGroup.firstPublishedIndex;
              this.updateContentGroup(firstIndex, lastIndex);
            }
          });
          return;
        } else {
          firstIndex = this.contentGroup.firstPublishedIndex;
          if (this.isLastPublished()) {
            lastIndex = this.currentStep - 1;
          }
          if (this.isOutOfScope()) {
            firstIndex = -1;
          }
        }
      } else {
        lastIndex = this.contentGroup.lastPublishedIndex;
        if (this.isFirstPublished()) {
          if (this.isLastPublished()) {
            firstIndex = -1;
          } else {
            firstIndex = this.contentGroup.firstPublishedIndex + 1;
          }
        }
      }
    }
    this.updateContentGroup(firstIndex, lastIndex);
  }

  updateContentGroup(firstIndex: number, lastIndex: number) {
    const changes: { firstPublishedIndex: number, lastPublishedIndex: number } = { firstPublishedIndex: firstIndex, lastPublishedIndex: lastIndex };
    this.contentGroupService.patchContentGroup(this.contentGroup, changes).subscribe(updatedContentGroup => {
      this.contentGroup = updatedContentGroup;
      this.eventService.broadcast('ContentGroupStateChanged', this.contentGroup);
    });
  }
}
