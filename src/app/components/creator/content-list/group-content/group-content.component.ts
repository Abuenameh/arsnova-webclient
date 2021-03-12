import { Component, HostListener, OnInit } from '@angular/core';
import { Content } from '../../../../models/content';
import { ContentService } from '../../../../services/http/content.service';
import { RoomService } from '../../../../services/http/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/util/language.service';
import { DialogService } from '../../../../services/util/dialog.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../../services/util/global-storage.service';
import { ContentGroupService } from '../../../../services/http/content-group.service';
import { ContentListBaseComponent } from '../content-list-base.component';
import { ContentGroup } from '../../../../models/content-group';
import { AnnounceService } from '../../../../services/util/announce.service';
import { KeyboardUtils } from '../../../../utils/keyboard';
import { KeyboardKey } from '../../../../utils/keyboard/keys';
import { EventService } from '../../../../services/util/event.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-group-content',
  templateUrl: './group-content.component.html',
  styleUrls: ['./group-content.component.scss']
})
export class GroupContentComponent extends ContentListBaseComponent implements OnInit {

  collectionName: string;
  isInTitleEditMode = false;
  isInSortingMode = false;
  updatedName: string;
  baseURL = 'creator/room/';
  published = false;
  statisticsPublished = true;
  firstPublishedIndex = 0;
  lastPublishedIndex = -1;
  lastPublishedIndexBackup = -1;
  firstPublishedIndexBackup = -1;
  copiedContents = [];

  constructor(
    protected contentService: ContentService,
    protected roomService: RoomService,
    protected route: ActivatedRoute,
    protected location: Location,
    protected notificationService: NotificationService,
    protected translateService: TranslateService,
    protected langService: LanguageService,
    protected dialogService: DialogService,
    protected globalStorageService: GlobalStorageService,
    protected contentGroupService: ContentGroupService,
    protected announceService: AnnounceService,
    public eventService: EventService,
    protected router: Router
  ) {
    super(contentService, roomService, route, location, notificationService, translateService, langService, dialogService,
    globalStorageService, contentGroupService, announceService, router);
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const focusOnInput = this.eventService.focusOnInput;
    if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit1) === true && focusOnInput === false) {
      document.getElementById('content-create-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit2) === true && focusOnInput === false) {
      document.getElementById('statistic-button').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit3) === true && focusOnInput === false) {
      document.getElementById('direct-send-slide').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit4) === true && focusOnInput === false) {
      document.getElementById('lock-questions-slide').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit5) === true && focusOnInput === false) {
      document.getElementById('content-list').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Digit6) === true && focusOnInput === false) {
      document.getElementById('edit-group-name').focus();
    } else if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Escape) === true) {
      if (focusOnInput) {
        this.leaveTitleEditMode();
      }
      setTimeout(() => {
        document.getElementById('keys-button').focus();
      }, 200);
    }
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.room = data.room;
      this.route.params.subscribe(params => {
        this.collectionName = params['contentGroup'];
        this.globalStorageService.setItem(STORAGE_KEYS.LAST_GROUP, this.collectionName);
        this.roomService.getGroupByRoomIdAndName(this.room.id, this.collectionName).subscribe(group => {
          this.contentGroup = group;
          this.setRange();
          this.contentService.getContentsByIds(this.contentGroup.roomId, this.contentGroup.contentIds, true)
            .subscribe(contents => {
            this.initContentList(contents);
          });
        });
      });
    });
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
  }

  setSettings() {
    this.published = this.contentGroup.published;
    this.statisticsPublished = this.contentGroup.statisticsPublished;
  }

  goToEdit(content: Content) {
    const url = `creator/room/${this.room.shortId}/group/${this.contentGroup.name}/edit/${content.id}`;
    this.router.navigate([url]);
  }

  announce() {
    this.announceService.announce('content.a11y-content-list-shortcuts');
  }

  goInTitleEditMode(): void {
    this.updatedName = this.collectionName;
    this.isInTitleEditMode = true;
    setTimeout(() => {
      document.getElementById('nameInput').focus();
    }, 100);

  }

  leaveTitleEditMode(saved?: boolean): void {
    this.isInTitleEditMode = false;
    this.eventService.focusOnInput = false;
    if (!saved) {
      const msg = this.translateService.instant('content.not-updated-content-group');
      this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
    }
  }

  updateURL(): void {
    this.location.replaceState(`${this.baseURL}${this.room.shortId}/group/${this.collectionName}`);
  }

  saveGroupName(): void {
    if (this.updatedName !== this.collectionName) {
      const changes: { name: string } = { name: this.updatedName };
      this.updateContentGroup(changes).subscribe(updatedGroup => {
          this.contentGroup = updatedGroup;
          this.contentGroupService.updateGroupInMemoryStorage(this.collectionName, this.updatedName);
          this.collectionName = this.contentGroup.name;
          this.translateService.get('content.updated-content-group').subscribe(msg => {
            this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
          });
          this.updateURL();
        });
    }
    this.leaveTitleEditMode(true);
  }

  createCopy() {
    this.copiedContents = this.contents.map(content => ({ ...content }));
    this.firstPublishedIndexBackup = this.firstPublishedIndex;
    this.lastPublishedIndexBackup = this.lastPublishedIndex;
  }

  goInSortingMode(): void {
    this.createCopy();
    this.isInSortingMode = true;
  }

  leaveSortingMode(abort?: boolean): void {
    this.isInSortingMode = false;
    if (abort) {
      this.setPublishedIndexesToBackup();
    }
  }

  setPublishedIndexesToBackup() {
    this.firstPublishedIndex = this.firstPublishedIndexBackup;
    this.lastPublishedIndex = this.lastPublishedIndexBackup;
  }

  saveSorting(): void {
    const newContentIdOrder = this.copiedContents.map(c => c.id);
    if (this.contentGroup.contentIds !== newContentIdOrder) {
      const changes: { contentIds: string[], firstPublishedIndex: number, lastPublishedIndex: number } =
        { contentIds: newContentIdOrder, firstPublishedIndex: this.firstPublishedIndex, lastPublishedIndex: this.lastPublishedIndex };
      this.updateContentGroup(changes).subscribe(updatedContentGroup => {
        this.contentGroup = updatedContentGroup;
        this.contents = this.copiedContents;
        this.initContentList(this.contents);
        this.translateService.get('content.updated-sorting').subscribe(msg => {
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.SUCCESS);
        });
        this.leaveSortingMode();
      },
        error => {
        this.setPublishedIndexesToBackup()
      });
    }
  }

  updateContentGroup(changes: object): Observable<ContentGroup> {
    return this.contentGroupService.patchContentGroup(this.contentGroup, changes);
  }

  publishContents() {
    const changes: { published: boolean } = { published: !this.contentGroup.published };
    this.updateContentGroup(changes).subscribe(updatedContentGroup => {
      this.contentGroup = updatedContentGroup;
      this.published = this.contentGroup.published;
    });
  }

  publishContent(index: number, publish: boolean) {
    if (publish) {
      this.updatePublishedIndexes(index, index);
    } else {
      if (this.lastPublishedIndex === this.firstPublishedIndex) {
        this.resetPublishing()
      } else {
        if (index === this.firstPublishedIndex) {
          this.updatePublishedIndexes(index + 1, this.lastPublishedIndex);
        } else if (index === this.lastPublishedIndex) {
          this.updatePublishedIndexes(this.firstPublishedIndex, index - 1);
        }
      }
    }
  }

  publishContentFrom(index: number, publish: boolean) {
    if (publish) {
      const last = this.lastPublishedIndex === -1 || this.lastPublishedIndex < index ? this.contents.length - 1 : this.lastPublishedIndex;
      this.updatePublishedIndexes(index, last);
    } else {
      if (index === this.firstPublishedIndex) {
        this.resetPublishing();
      } else {
        const first = this.firstPublishedIndex === -1 || this.firstPublishedIndex > index ? 0 : this.firstPublishedIndex;
        this.updatePublishedIndexes(first, index - 1);
      }
    }
  }

  publishContentUpTo(index: number, publish: boolean) {
    if (publish) {
      const first = (this.firstPublishedIndex === -1 || this.firstPublishedIndex > index) ? 0 : this.firstPublishedIndex;
      this.updatePublishedIndexes(first, index);
    } else {
      if (index === this.lastPublishedIndex) {
        this.resetPublishing();
      } else {
        const last = this.lastPublishedIndex === -1 || this.lastPublishedIndex < index ? this.contents.length - 1 : this.lastPublishedIndex;
        this.updatePublishedIndexes(index + 1, last);
      }
    }
  }

  resetPublishing() {
    this.updatePublishedIndexes(-1, -1);
  }

  showDeleteAnswerDialog(content: Content): void {
    const dialogRef = this.dialogService.openDeleteDialog('really-delete-answers');
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteAnswers(content.id);
      }
    });
  }

  deleteAnswers(contentId: string) {
    this.contentService.deleteAnswers(this.contentGroup.roomId, contentId).subscribe(() => {
      this.translateService.get('content.answers-deleted').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
    });
  }

  toggleAnswersPublished(content: Content, answersPublished?: boolean) {
    if (answersPublished !== undefined) {
      content.state.answersPublished = answersPublished;
    } else {
      content.state.answersPublished = !content.state.answersPublished;
    }
    this.contentService.changeState(content).subscribe(updatedContent => content = updatedContent);
  }

  toggleStatisticsPublished() {
    const changes: { statisticsPublished: boolean } = { statisticsPublished: !this.contentGroup.statisticsPublished };
    this.updateContentGroup(changes).subscribe(updatedContentGroup => {
      this.contentGroup = updatedContentGroup;
      this.statisticsPublished = this.contentGroup.statisticsPublished;
    });
  }

  drop(event: CdkDragDrop<Content[]>) {
    const prev = event.previousIndex;
    const current = event.currentIndex;
    moveItemInArray(this.copiedContents, prev, current);
    this.sortPublishedIndexes(prev, current);
  }

  sortPublishedIndexes(prev: number, current: number) {
    if (this.firstPublishedIndex !== -1 && this.lastPublishedIndex !== -1) {
      if (prev !== current && !(this.isAboveRange(prev) && this.isAboveRange(current)
        || this.isBelowRange(prev) && this.isBelowRange(current))) {
        if (this.firstPublishedIndex === this.lastPublishedIndex) {
          const publishedIndex = this.firstPublishedIndex;
          if (prev === publishedIndex) {
            this.setTempRange(current, current);
          } else {
            const newPublishedIndex = prev < publishedIndex ? publishedIndex - 1 : publishedIndex + 1;
            this.setTempRange(newPublishedIndex, newPublishedIndex);
          }
        } else {
          if (this.isInRange(prev)) {
            if (!this.isInRangeExclusive(current)) {
              if (this.isAboveRange(current)) {
                this.setTempRange(this.firstPublishedIndex, this.lastPublishedIndex - 1);
              } else if (this.isBelowRange(current)) {
                this.setTempRange(this.firstPublishedIndex + 1, this.lastPublishedIndex);
              }
            }
          } else {
            if (this.isInRangeExclusive(current) || (this.isAboveRange(prev) && this.isEnd(current))
              || (this.isBelowRange(prev) && this.isStart(current))) {
              if (this.isBelowRange(prev)) {
                this.setTempRange(this.firstPublishedIndex - 1, this.lastPublishedIndex);
              } else if (this.isAboveRange(prev)) {
                this.setTempRange(this.firstPublishedIndex, this.lastPublishedIndex + 1);
              }
            } else {
              if (current <= this.firstPublishedIndex || current >= this.lastPublishedIndex) {
                const adjustment = this.isBelowRange(prev) ? -1 : 1;
                this.setTempRange(this.firstPublishedIndex + adjustment, this.lastPublishedIndex + adjustment);
              }
            }
          }
        }
      }
    }
  }

  isInRange(index: number): boolean {
    return index <= this.lastPublishedIndex && index >= this.firstPublishedIndex;
  }

  isInRangeExclusive(index: number): boolean {
    return index < this.lastPublishedIndex && index > this.firstPublishedIndex;
  }
  removeContent(delContent: Content) {
    const index = this.findIndexOfId(delContent.id);
    const dialogRef = this.dialogService.openDeleteDialog('really-remove-content', this.contents[index].body, 'remove');
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateContentChanges(index, result);
      }
    });
  }

  navigateToContentStats(content: Content) {
    const index = this.contents.filter(c => this.contentTypes.indexOf(c.format) > -1).
    map(co => co.id).indexOf(content.id);
    if (index > -1) {
      this.router.navigate([`/creator/room/${this.room.shortId}/group/${this.contentGroup.name}/statistics/${index + 1}`]);
    }
  }

  updatePublishedIndexes(first: number, last: number) {
    const changes: { firstPublishedIndex: number, lastPublishedIndex: number } = { firstPublishedIndex: first, lastPublishedIndex: last };
    this.updateContentGroup(changes).subscribe(updatedContentGroup => {
      this.contentGroup = updatedContentGroup;
      this.setRange();
    });
  }

  setRange() {
    this.firstPublishedIndex = this.contentGroup.firstPublishedIndex;
    this.lastPublishedIndex = this.contentGroup.lastPublishedIndex;
    const key = this.firstPublishedIndex === - 1 ? 'no' : this.lastPublishedIndex === -1 ? 'all'
      : this.firstPublishedIndex === this.lastPublishedIndex ? 'single' : 'range';
    const msg = this.translateService.instant('content.a11y-' + key + '-published',
      { first: this.firstPublishedIndex + 1, last: this.lastPublishedIndex + 1 });
    this.announceService.announce(msg);
  }

  setTempRange(first: number, last: number) {
    this.firstPublishedIndex = first;
    this.lastPublishedIndex = last;
  }

  isBelowRange(index: number): boolean {
    return index < this.firstPublishedIndex;
  }

  isAboveRange(index: number): boolean {
    return index > this.lastPublishedIndex;
  }

  isStart(index: number): boolean {
    return index === this.firstPublishedIndex;
  }

  isEnd(index: number): boolean {
    return index === this.lastPublishedIndex;
  }

  isPublished(index: number): boolean {
    if (this.lastPublishedIndex === -1 && this.firstPublishedIndex > -1) {
      return true;
    } else {
      if (this.firstPublishedIndex === -1) {
        return false;
      }
      return ((this.firstPublishedIndex <= index) && (index <= this.lastPublishedIndex));
    }
  }
}
