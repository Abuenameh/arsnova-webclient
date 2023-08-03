import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommentService } from '@app/core/services/http/comment.service';
import { Comment } from '@app/core/models/comment';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { DialogService } from '@app/core/services/util/dialog.service';
import { MarkdownFeatureset } from '@app/core/services/http/formatting.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreModule } from '@app/core/core.module';
import { RenderedTextComponent } from '@app/standalone/rendered-text/rendered-text.component';
import { DateComponent } from '@app/standalone/date/date.component';
import { FormattingToolbarComponent } from '@app/standalone/formatting-toolbar/formatting-toolbar.component';

@Component({
  standalone: true,
  imports: [
    CoreModule,
    RenderedTextComponent,
    DateComponent,
    FormattingToolbarComponent,
  ],
  selector: 'app-comment-answer',
  templateUrl: './comment-answer.component.html',
  styleUrls: ['./comment-answer.component.scss'],
})
export class CommentAnswerComponent implements OnInit {
  readonly dialogId = 'comment-answer';
  @ViewChild('answerInput') answerInput: ElementRef;

  comment: Comment;
  answer: string;
  edit = false;
  isEditor: boolean;
  MarkdownFeatureset = MarkdownFeatureset;
  renderPreview = false;

  constructor(
    private notificationService: NotificationService,
    private translateService: TranslateService,
    protected commentService: CommentService,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<CommentAnswerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.comment = this.data.comment;
    this.answer = this.comment.answer;
    this.isEditor = !!this.data.isEditor;
  }

  editAnswer() {
    this.edit = true;
    setTimeout(() => {
      this.answerInput.nativeElement.focus();
    });
  }

  saveAnswer() {
    this.commentService.answer(this.comment, this.answer).subscribe(() => {
      this.translateService
        .get('comment-page.comment-answered')
        .subscribe((msg) => {
          this.notificationService.showAdvanced(
            msg,
            AdvancedSnackBarTypes.SUCCESS
          );
        });
      this.edit = false;
    });
  }

  openDeleteAnswerDialog(): void {
    const dialogRef = this.dialogService.openDeleteDialog(
      'comment-answer',
      'really-delete-answer'
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.deleteAnswer();
      }
    });
  }

  deleteAnswer() {
    this.answer = '';
    this.commentService.answer(this.comment, this.answer).subscribe(() => {
      this.translateService
        .get('comment-page.answer-deleted')
        .subscribe((msg) => {
          this.notificationService.showAdvanced(
            msg,
            AdvancedSnackBarTypes.WARNING
          );
        });
    });
  }

  tabChanged($event) {
    this.renderPreview = $event.index === 1;
  }

  close() {
    this.dialogRef.close();
  }
}
