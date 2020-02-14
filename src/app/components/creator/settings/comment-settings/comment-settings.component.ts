import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RoomCreatorPageComponent } from '../../room-creator-page/room-creator-page.component';
import { NotificationService } from '../../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { RoomService } from '../../../../services/http/room.service';
import { Router } from '@angular/router';
import { CommentService } from '../../../../services/http/comment.service';
import { BonusTokenService } from '../../../../services/http/bonus-token.service';
import { CommentSettingsService } from '../../../../services/http/comment-settings.service';
import { DeleteCommentsComponent } from '../../_dialogs/delete-comments/delete-comments.component';
import { CommentExportComponent } from '../../_dialogs/comment-export/comment-export.component';
import { Room } from '../../../../models/room';
import { CommentBonusTokenMixin } from '../../../../models/comment-bonus-token-mixin';
import { CommentSettings } from '../../../../models/comment-settings';
import { TSMap } from 'typescript-map';

@Component({
  selector: 'app-comment-settings',
  templateUrl: './comment-settings.component.html',
  styleUrls: ['./comment-settings.component.scss']
})
export class CommentSettingsComponent implements OnInit {

  @Input() editRoom: Room;
  @Input() roomId: string;

  comments: CommentBonusTokenMixin[];
  commentExtension: any;
  threshold = -100;
  enableThreshold = false;
  enableModeration = false;
  directSend = true;
  directSendDefault = true;
  enableTags = false;
  tags: string[] = [];

  constructor(
    public dialog: MatDialog,
    public notificationService: NotificationService,
    public translationService: TranslateService,
    protected roomService: RoomService,
    public router: Router,
    public commentService: CommentService,
    public commentSettingsService: CommentSettingsService,
    private bonusTokenService: BonusTokenService
  ) {
  }

  ngOnInit() {
    if (this.editRoom.extensions && this.editRoom.extensions['comments']) {
      this.commentExtension = this.editRoom.extensions['comments'];
      if (this.commentExtension.enableThreshold !== null) {
        if (this.commentExtension.commentThreshold) {
          this.threshold = this.commentExtension.commentThreshold;
        } else {
          this.threshold = -100;
        }
        this.enableThreshold = this.commentExtension.enableThreshold;
      }

      if (this.commentExtension.enableTags !== null) {
        this.enableTags = this.commentExtension.enableTags;
        this.tags = this.commentExtension.tags;
      }

      if (this.commentExtension.enableModeration !== null) {
        this.enableModeration = this.commentExtension.enableModeration;
      }
    }
    this.commentSettingsService.get(this.roomId).subscribe(settings => {
      this.directSend = settings.directSend;
      this.directSendDefault = settings.directSend;
    });
  }

  onSliderChange(event: any) {
    if (event.value) {
      this.threshold = event.value;
    } else {
      this.threshold = 0;
    }
  }


  openDeleteCommentsDialog(): void {
    const dialogRef = this.dialog.open(DeleteCommentsComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.roomId = this.roomId;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'delete') {
          this.deleteComments();
        }
      });
  }

  deleteComments(): void {
    this.translationService.get('settings.comments-deleted').subscribe(msg => {
      this.notificationService.show(msg);
    });
    this.commentService.deleteCommentsByRoomId(this.roomId).subscribe();
  }

  export(delimiter: string, date: string): void {
    this.commentService.getAckComments(this.roomId)
      .subscribe(comments => {
        this.bonusTokenService.getTokensByRoomId(this.roomId).subscribe(list => {
          this.comments = comments.map(comment => {
            const commentWithToken: CommentBonusTokenMixin = <CommentBonusTokenMixin>comment;
            for (const bt of list) {
              if (commentWithToken.creatorId === bt.userId && comment.id === bt.commentId) {
                commentWithToken.bonusToken = bt.token;
              }
            }
            return commentWithToken;
          });
          const exportComments = JSON.parse(JSON.stringify(this.comments));
          let csv: string;
          let valueFields = '';
          const fieldNames = ['settings.question', 'settings.timestamp', 'settings.presented',
            'settings.favorite', 'settings.correct/wrong', 'settings.score', 'settings.token'];
          let keyFields;
          this.translationService.get(fieldNames).subscribe(msgs => {
            keyFields = [msgs[fieldNames[0]], msgs[fieldNames[1]], msgs[fieldNames[2]], msgs[fieldNames[3]],
              msgs[fieldNames[4]], msgs[fieldNames[5]], msgs[fieldNames[6]], '\r\n'];

            exportComments.forEach(element => {
              element.body = '"' + element.body.replace(/[\r\n]/g, ' ').replace(/ +/g, ' ').replace(/"/g, '""') + '"';
              valueFields += Object.values(element).slice(3, 4) + delimiter;
              let time;
              time = Object.values(element).slice(4, 5);
              valueFields += time[0].slice(0, 10) + '-' + time[0].slice(11, 16) + delimiter;
              valueFields += Object.values(element).slice(5, 8) + delimiter;
              valueFields += Object.values(element).slice(9, 11).join(delimiter) + '\r\n';
            });
            csv = keyFields + valueFields;
            const myBlob = new Blob([csv], { type: 'text/csv' });
            const link = document.createElement('a');
            const fileName = this.editRoom.name + '_' + this.editRoom.shortId + '_' + date + '.csv';
            link.setAttribute('download', fileName);
            link.href = window.URL.createObjectURL(myBlob);
            link.click();
          });
        });
      });
  }

  onExport(exportType: string): void {
    const date = new Date();
    const dateString = date.toLocaleDateString();
    if (exportType === 'comma') {
      this.export(',', dateString);
    } else if (exportType === 'semicolon') {
      this.export(';', dateString);
    }
  }

  openExportDialog(): void {
    const dialogRef = this.dialog.open(CommentExportComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.onExport(result);
    });
  }

  updateCommentSettings() {
    const commentExtension: TSMap<string, any> = new TSMap();
    commentExtension.set('enableThreshold', this.enableThreshold);
    commentExtension.set('commentThreshold', this.threshold);
    commentExtension.set('enableModeration', this.enableModeration);
    commentExtension.set('enableTags', this.enableTags);
    commentExtension.set('tags', this.tags);
    this.editRoom.extensions['comments'] = commentExtension;
    localStorage.setItem('moderationEnabled', String(this.enableModeration));
    this.saveChanges();
  }

  saveChanges() {
    const commentSettings = new CommentSettings();
    commentSettings.roomId = this.roomId;
    commentSettings.directSend = this.directSend;
    this.commentSettingsService.update(commentSettings).subscribe();

    this.roomService.updateRoom(this.editRoom)
      .subscribe((room) => {
        this.editRoom = room;
        this.translationService.get('settings.changes-successful').subscribe(msg => {
          this.notificationService.show(msg);
        });
      });
  }
}
