import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { KeyboardUtils } from '../../../../utils/keyboard';
import { KeyboardKey } from '../../../../utils/keyboard/keys';
import { GlobalStorageService, STORAGE_KEYS } from '../../../../services/util/global-storage.service';
import { Comment } from '../../../../models/comment';

@Component({
  selector: 'app-present-comment',
  templateUrl: './present-comment.component.html',
  styleUrls: ['./present-comment.component.scss']
})
export class PresentCommentComponent implements OnInit {

  @Input() isPresentation = false;
  @Input() comment: Comment;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public dialogRef: MatDialogRef<PresentCommentComponent>,
    private translateService: TranslateService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private globalStorageService: GlobalStorageService
  ) {
  }

  ngOnInit() {
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    // ToDo: migrate from deprecated event api
    if (KeyboardUtils.isKeyEvent(event, KeyboardKey.Escape) === true) {
      this.onCloseClick();
    }
  }

  onCloseClick(): void {
    this.dialogRef.close('close');
  }

  updateFontSize(event: any): void {
    document.getElementById('comment').style.fontSize = (event.value * 2.5) + 'em';
  }
}
