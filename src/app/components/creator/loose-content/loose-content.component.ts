import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/http/content.service';
import { Content } from '../../../models/content';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ContentChoice } from '../../../models/content-choice';
import { ContentText } from '../../../models/content-text';
import { ContentType } from '../../../models/content-type.enum';
import { NotificationService } from '../../../services/util/notification.service';
import { Room } from '../../../models/room';
import { RoomService } from '../../../services/http/room.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';
import { DialogService } from '../../../services/util/dialog.service';
import { GlobalStorageService, MemoryStorageKey, LocalStorageKey } from '../../../services/util/global-storage.service';

@Component({
  selector: 'app-loose-content',
  templateUrl: './loose-content.component.html',
  styleUrls: ['./loose-content.component.scss']
})


export class LooseContentComponent implements OnInit {

  contents: Content[];
  roomId: string;
  room: Room;
  isLoading = true;
  labelMaxLength: number;
  labels: string[] = [];
  deviceType: string;
  contentGroups: string[] = [];
  currentGroupIndex: number;
  contentBackup: Content;
  contentCBackup: ContentChoice;
  collectionName: string;

  constructor(
    private contentService: ContentService,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private location: Location,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    protected langService: LanguageService,
    private dialogService: DialogService,
    private globalStorageService: GlobalStorageService
  ) {
    this.deviceType = this.globalStorageService.getMemoryItem(MemoryStorageKey.DEVICE_TYPE);
    langService.langEmitter.subscribe(lang => translateService.use(lang));
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.room = data.room;
      this.contentService.findContentsWithoutGroup(this.room.id).subscribe(contents => {
        this.initContentList(contents);
      });
      this.labelMaxLength = innerWidth / 20;
      this.translateService.use(this.globalStorageService.getLocalStorageItem(LocalStorageKey.LANGUAGE));
    });
  }

  initContentList(contentList: Content[]) {
    this.contents = contentList;
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i].subject.length > this.labelMaxLength) {
        this.labels[i] = this.contents[i].subject.substr(0, this.labelMaxLength) + '..';
      } else {
        this.labels[i] = this.contents[i].subject;
      }
    }
    this.getGroups();
    this.isLoading = false;
  }

  getGroups(): void {
    this.contentGroups = this.globalStorageService.getMemoryItem(MemoryStorageKey.CONTENT_GROUPS);
    if (!this.contentGroups) {
      this.roomService.getStats(this.room.id).subscribe(roomStats => {
        if (roomStats.groupStats) {
          this.contentGroups = roomStats.groupStats.map(stat => stat.groupName);
        }
      });
    }
  }

  findIndexOfSubject(subject: string): number {
    let index = -1;
    for (let i = 0; i < this.contents.length; i++) {
      if (this.contents[i].subject.valueOf() === subject.valueOf()) {
        index = i;
        break;
      }
    }
    return index;
  }

  createChoiceContentBackup(content: ContentChoice) {
    this.contentCBackup = new ContentChoice(
      content.id,
      content.revision,
      content.roomId,
      content.subject,
      content.body,
      content.groups,
      content.options,
      content.correctOptionIndexes,
      content.multiple,
      content.format,
      content.state
    );
  }

  createTextContentBackup(content: ContentText) {
    this.contentBackup = new ContentText(
      content.id,
      content.revision,
      content.roomId,
      content.subject,
      content.body,
      [],
      content.state
    );
  }

  deleteContent(delContent: Content) {
    const index = this.findIndexOfSubject(delContent.subject);
    this.createChoiceContentBackup(delContent as ContentChoice);
    const dialogRef = this.dialogService.openDeleteDialog('really-delete-content', delContent.subject);
    dialogRef.afterClosed().subscribe(result => {
      this.updateContentChanges(index, result);
    });
  }

  editContent(edContent: Content) {
    if (edContent.format === ContentType.TEXT) {
      this.createTextContentBackup(edContent as ContentText);
    } else {
      this.createChoiceContentBackup(edContent as ContentChoice);
    }
    const index = this.findIndexOfSubject(edContent.subject);
    const dialogRef = this.dialogService.openContentEditDialog(this.contentCBackup);
    dialogRef.afterClosed()
      .subscribe(result => {
        this.updateContentChanges(index, result);
      });
  }

  updateContentChanges(index: number, action: string) {
    if (!action) {
      this.contents[index] = this.contentCBackup;
    } else {
      switch (action.valueOf()) {
        case 'delete':
          this.translateService.get('content.content-deleted').subscribe(message => {
            this.notificationService.show(message);
          });
          this.contentService.deleteContent(this.contents[index].id).subscribe();
          this.contents.splice(index, 1);
          this.labels.splice(index, 1);
          if (this.contents.length === 0) {
            this.globalStorageService.setMemoryItem(MemoryStorageKey.LAST_GROUP, this.contentGroups[0]);
            this.location.back();
          }
          break;
        case 'update':
          this.contents[index] = this.contentCBackup;
          this.labels[index] = this.contentCBackup.subject;
          this.contentService.updateContent(this.contents[index]).subscribe();
          this.translateService.get('content.content-updated').subscribe(message => {
            this.notificationService.show(message);
          });
          break;
        case 'abort':
          this.contents[index] = this.contentCBackup;
          break;
      }
    }
  }

  saveGroupName(): void {
   /* Fix this to create a new content group

   if (this.updatedName !== this.collectionName) {
      this.contentGroup.name = this.updatedName;
      this.roomService.updateGroup(this.room.id, this.updatedName, this.contentGroup).subscribe(() => {
        this.updateGroupInSessionStorage(this.collectionName, this.updatedName);
        this.collectionName = this.updatedName;
        this.translateService.get('content.updated-content-group').subscribe(msg => {
          this.notificationService.show(msg);
        });
        this.updateURL();
      });
    }
    this.leaveEditMode(); */
  }

  addToContentGroup(contentId: string, cgName: string, newGroup: boolean): void {
    this.roomService.addContentToGroup(this.room.id, cgName, contentId).subscribe(() => {
      if (!newGroup) {
        this.translateService.get('content.added-to-content-group').subscribe(msg => {
          this.notificationService.show(msg);
        });
      }
    });
  }

  showContentGroupCreationDialog(contentId: string): void {
    const dialogRef = this.dialogService.openContentGroupCreationDialog();
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addToContentGroup(contentId, result, true);
      }
    });
  }
}
