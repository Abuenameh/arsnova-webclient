import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { RoomService } from '@app/core/services/http/room.service';
import { Router } from '@angular/router';
import { CommentService } from '@app/core/services/http/comment.service';
import { CommentSettingsService } from '@app/core/services/http/comment-settings.service';
import { Room } from '@app/core/models/room';
import { CommentSettings } from '@app/core/models/comment-settings';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EventService } from '@app/core/services/util/event.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UpdateEvent } from '@app/creator/settings-page/settings-page.component';

export class CommentExtensions {
  enableThreshold: boolean;
  commentThreshold: number;
  enableTags: boolean;
  tags: string[];
}

@Component({
  selector: 'app-comment-settings',
  templateUrl: './comment-settings.component.html',
  styleUrls: ['./comment-settings.component.scss'],
})
export class CommentSettingsComponent implements OnInit {
  @Output() saveEvent: EventEmitter<UpdateEvent> =
    new EventEmitter<UpdateEvent>();

  @Input() room: Room;
  @Input() roomId: string;

  commentExtension: CommentExtensions;
  threshold = -50;
  enableThreshold = false;
  enableTags = false;
  settings: CommentSettings;
  tags: string[] = [];
  timestamp = new Date();
  tagExtension: object;
  tagName = '';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isLoading = true;

  constructor(
    public dialog: MatDialog,
    public notificationService: NotificationService,
    public translationService: TranslateService,
    protected roomService: RoomService,
    public router: Router,
    public commentService: CommentService,
    public commentSettingsService: CommentSettingsService,
    private liveAnnouncer: LiveAnnouncer,
    public eventService: EventService
  ) {}

  ngOnInit() {
    if (!this.room.extensions) {
      this.room.extensions = {};
    }
    if (!this.room.extensions.comments) {
      this.room.extensions.comments = {};
    }
    this.commentExtension = this.room.extensions.comments as CommentExtensions;
    this.threshold = this.commentExtension.commentThreshold ?? this.threshold;
    this.enableThreshold =
      this.commentExtension.enableThreshold ?? this.enableThreshold;

    this.initTags();
    this.commentSettingsService.get(this.roomId).subscribe((settings) => {
      this.settings = settings;
      this.isLoading = false;
    });
  }

  initTags() {
    this.enableTags = this.commentExtension.enableTags ?? this.enableTags;
    if (this.room.extensions.tags) {
      this.tagExtension = this.room.extensions.tags;
      this.tags = this.room.extensions.tags['tags'] || [];
    } else {
      this.tagExtension = { enableTags: true };
      this.room.extensions.tags = this.tagExtension;
    }
  }

  addTag() {
    if (this.tagName.length > 0) {
      if (this.checkIfTagExists()) {
        const msg = this.translationService.instant('settings.tag-error');
        this.notificationService.showAdvanced(
          msg,
          AdvancedSnackBarTypes.WARNING
        );
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
    this.tags = this.tags.filter((o) => o !== tag);
    this.tagExtension['tags'] = this.tags;
    this.room.extensions.tags = this.tagExtension;
    this.saveChanges(false);
  }

  updateCommentExtensions(enableTreshold?: boolean) {
    this.enableThreshold = enableTreshold ?? this.enableThreshold;
    const commentExtension: CommentExtensions = new CommentExtensions();
    commentExtension.enableThreshold = this.enableThreshold;
    commentExtension.commentThreshold = this.threshold;
    commentExtension.enableTags = this.enableTags;
    commentExtension.tags = this.tags;
    this.room.extensions.comments = commentExtension;
    this.saveChanges();
  }

  updateCommentSettings(change: Partial<CommentSettings> = {}) {
    const commentSettings = new CommentSettings(
      this.roomId,
      change.directSend ?? this.settings.directSend,
      this.settings.fileUploadEnabled,
      change.disabled ?? this.settings.disabled,
      this.settings.readonly
    );
    this.commentSettingsService
      .update(commentSettings)
      .subscribe((settings) => {
        this.settings = settings;
      });
  }

  updateFileUploadEnabled(fileUploadEnabled: boolean) {
    this.settings.fileUploadEnabled = fileUploadEnabled;
    this.updateCommentSettings();
  }

  saveChanges(addedTag?: boolean) {
    this.saveEvent.emit(new UpdateEvent(this.room, false));
    if (addedTag !== undefined) {
      const msg = this.translationService.instant(
        addedTag ? 'settings.tag-added' : 'settings.tag-removed'
      );
      this.notificationService.showAdvanced(
        msg,
        addedTag ? AdvancedSnackBarTypes.SUCCESS : AdvancedSnackBarTypes.WARNING
      );
    }
  }

  announceThreshold() {
    this.translationService
      .get('settings.a11y-threshold-changed', { value: this.threshold })
      .subscribe((msg) => {
        this.liveAnnouncer.clear();
        this.liveAnnouncer.announce(msg);
      });
  }
}