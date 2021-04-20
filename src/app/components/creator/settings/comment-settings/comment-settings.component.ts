import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { RoomService } from '../../../../services/http/room.service';
import { Router } from '@angular/router';
import { CommentService } from '../../../../services/http/comment.service';
import { BonusTokenService } from '../../../../services/http/bonus-token.service';
import { CommentSettingsService } from '../../../../services/http/comment-settings.service';
import { Room } from '../../../../models/room';
import { CommentSettings } from '../../../../models/comment-settings';
import { DialogService } from '../../../../services/util/dialog.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { GlobalStorageService, STORAGE_KEYS } from '../../../../services/util/global-storage.service';
import { UpdateEvent } from '../settings.component';
import { Comment } from '../../../../models/comment';
import { EventService } from '../../../../services/util/event.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export class CommentExtensions {
  enableThreshold: boolean;
  commentThreshold: number;
  enableModeration: boolean;
  enableTags: boolean;
  tags: string[];
}

@Component({
  selector: 'app-comment-settings',
  templateUrl: './comment-settings.component.html',
  styleUrls: ['./comment-settings.component.scss']
})
export class CommentSettingsComponent implements OnInit {

  @Output() saveEvent: EventEmitter<UpdateEvent> = new EventEmitter<UpdateEvent>();

  @Input() room: Room;
  @Input() roomId: string;

  commentExtension: any;
  threshold: number;
  enableThreshold = false;
  enableModeration = false;
  directSend = true;
  directSendDefault = true;
  enableTags = false;
  tags: string[] = [];
  timestamp = new Date();
  tagExtension: object;
  tagName = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public dialog: MatDialog,
    public notificationService: NotificationService,
    public translationService: TranslateService,
    protected roomService: RoomService,
    public router: Router,
    public commentService: CommentService,
    public commentSettingsService: CommentSettingsService,
    private bonusTokenService: BonusTokenService,
    private dialogService: DialogService,
    private globalStorageService: GlobalStorageService,
    private liveAnnouncer: LiveAnnouncer,
    public eventService: EventService
  ) {
  }

  ngOnInit() {
    if (this.room.extensions && this.room.extensions.comments) {
      this.commentExtension = this.room.extensions.comments;
      if (this.commentExtension.enableThreshold !== null) {
        this.commentExtension.commentThreshold !== undefined ?
          this.threshold = this.commentExtension.commentThreshold : this.threshold = -100;
        this.enableThreshold = this.commentExtension.enableThreshold;
      }

      this.initTags();

      if (this.commentExtension.enableModeration !== null) {
        this.enableModeration = this.commentExtension.enableModeration;
      }
    }
    this.commentSettingsService.get(this.roomId).subscribe(settings => {
      this.directSend = settings.directSend;
      this.directSendDefault = settings.directSend;
    });
  }

  initTags() {
    this.enableTags = this.commentExtension.enableTags;
    if (this.room.extensions !== undefined && this.room.extensions.tags !== undefined) {
      this.tagExtension = this.room.extensions.tags;
    }
    if (!this.room.extensions) {
      this.tagExtension = {};
      this.tagExtension['enableTags'] = true;
      this.room.extensions = {};
      this.room.extensions.tags = this.tagExtension;
    } else {
      if (this.room.extensions.tags) {
        this.tags = this.room.extensions.tags['tags'] || [];
      }
    }
  }

  addTag() {
    if (this.tagName.length > 0) {
      if (this.checkIfTagExists()) {
        const msg = this.translationService.instant('settings.tag-error');
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      } else {
        this.tags.push(this.tagName);
        this.tagName = '';
        this.room.extensions.tags = { enableTags: true, tags: this.tags };
        this.saveChanges(true);
      }
    }
  }

  checkIfTagExists(): boolean {
    return this.tags.indexOf(this.tagName.trim()) > -1;
  }

  deleteTag(tag: string) {
    this.tags = this.tags.filter(o => o !== tag);
    this.tagExtension['tags'] = this.tags;
    this.room.extensions.tags = this.tagExtension;
    this.saveChanges(false);
  }

  onSliderChange(event: any) {
    if (event.value) {
      this.threshold = event.value;
    } else {
      this.threshold = 0;
    }
  }

  openDeleteCommentsDialog(): void {
    const dialogRef = this.dialogService.openDeleteDialog('really-delete-comments');
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteComments();
      }
    });
  }

  deleteComments(): void {
    this.commentService.deleteCommentsByRoomId(this.roomId).subscribe(() => {
      this.translationService.get('settings.comments-deleted').subscribe(msg => {
        this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
      });
    });
  }

  getExportData(comments: Comment[], delimiter: string): string {
    const exportComments = JSON.parse(JSON.stringify(comments));
    let valueFields = '';
    exportComments.forEach(element => {
      valueFields += this.filterNotSupportedCharacters(element['body']) + delimiter;
      let time;
      time = element['timestamp'];
      valueFields += time.slice(0, 10) + '-' + time.slice(11, 16) + delimiter;
      const answer = element['answer'];
      valueFields += (answer ? this.filterNotSupportedCharacters(answer) : '') + delimiter;
      valueFields += element['read'] + delimiter;
      valueFields += element['favorite'] + delimiter;
      valueFields += element['correct'] + delimiter;
      valueFields += element['score'] + delimiter;
      const tag = element['tag'];
      valueFields += (tag ? this.filterNotSupportedCharacters(tag) : '')  + '\r\n';
    });
    return valueFields;
  }

  filterNotSupportedCharacters(text: string): string {
    return '"' + text.replace(/[\r\n]/g, ' ').replace(/ +/g, ' ').replace(/"/g, '""') + '"';
  }

  export(): void {
    this.commentService.getAckComments(this.roomId)
      .subscribe(comments => {
          let csv: string;
          const fieldNames = ['settings.question', 'settings.timestamp', 'settings.answer', 'settings.presented',
            'settings.favorite', 'settings.correct/wrong', 'settings.score', 'settings.tag'];
          let keyFields;
          this.translationService.get(fieldNames).subscribe(msgs => {
            keyFields = [msgs[fieldNames[0]], msgs[fieldNames[1]], msgs[fieldNames[2]], msgs[fieldNames[3]],
              msgs[fieldNames[4]], msgs[fieldNames[5]], msgs[fieldNames[6]], msgs[fieldNames[7]], '\r\n'];
            const date = new Date();
            const dateString = date.toLocaleDateString();
            csv = keyFields + this.getExportData(comments, ',');
            const myBlob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            const fileName = this.room.name + '_' + this.room.shortId + '_' + dateString + '.csv';
            link.setAttribute('download', fileName);
            link.href = window.URL.createObjectURL(myBlob);
            link.click();
        });
      });
  }

  onExport(): void {
    this.export();
  }

  updateCommentSettings() {
    let commentExtension: CommentExtensions = new CommentExtensions();
    commentExtension.enableThreshold = this.enableThreshold;
    commentExtension.commentThreshold = this.threshold;
    commentExtension.enableModeration = this.enableModeration;
    commentExtension.enableTags = this.enableTags;
    commentExtension.tags = this.tags;
    if (!this.room.extensions) {
      this.room.extensions = { comments: commentExtension };
    } else {
      this.room.extensions.comments = commentExtension;
    }
    this.globalStorageService.setItem(STORAGE_KEYS.MODERATION_ENABLED, String(this.enableModeration));
    this.saveChanges();
  }

  updateDirectSend() {
    const commentSettings = new CommentSettings();
    commentSettings.roomId = this.roomId;
    commentSettings.directSend = this.directSend;
    this.commentSettingsService.update(commentSettings).subscribe();
  }

  saveChanges(addedTag?: boolean) {
    this.saveEvent.emit(new UpdateEvent(this.room, false));
    if (addedTag !== undefined) {
      const msg = this.translationService.instant(addedTag ? 'settings.tag-added' : 'settings.tag-removed');
      this.notificationService.showAdvanced(msg, addedTag ? AdvancedSnackBarTypes.SUCCESS : AdvancedSnackBarTypes.WARNING);
    }
  }

  announceThreshold() {
    this.translationService.get('settings.a11y-threshold-changed', { value: this.threshold }).subscribe(msg => {
      this.liveAnnouncer.clear();
      this.liveAnnouncer.announce(msg);
    });
  }
}
