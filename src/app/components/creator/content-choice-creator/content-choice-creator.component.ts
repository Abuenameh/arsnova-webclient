import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AnswerOption } from '../../../models/answer-option';
import { ContentChoice } from '../../../models/content-choice';
import { ContentService } from '../../../services/http/content.service';
import { NotificationService } from '../../../services/util/notification.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { AnswerEditComponent } from '../_dialogs/answer-edit/answer-edit.component';
import { ContentType } from '../../../models/content-type.enum';
import { ContentListComponent } from '../content-list/content-list.component';
import { ContentDeleteComponent } from '../_dialogs/content-delete/content-delete.component';
import { TranslateService } from '@ngx-translate/core';

export class DisplayAnswer {
  answerOption: AnswerOption;
  correct: boolean;

  constructor(answerOption: AnswerOption, correct: boolean) {
    this.answerOption = answerOption;
    this.correct = correct;
  }
}

@Component({
  selector: 'app-content-choice-creator',
  templateUrl: './content-choice-creator.component.html',
  styleUrls: ['./content-choice-creator.component.scss']
})
export class ContentChoiceCreatorComponent implements OnInit {
  @Input() contentSub;
  @Input() contentBod;
  @Input() contentCol;
  @Output() resetP = new EventEmitter<boolean>();


  singleChoice = true;
  content: ContentChoice = new ContentChoice(
    '0',
    '1',
    '',
    '',
    '',
    1,
    [],
    [],
    [],
    true,
    ContentType.CHOICE
  );

  displayedColumns = ['label', 'actions'];

  displayAnswers: DisplayAnswer[] = [];
  lastDeletedDisplayAnswer: DisplayAnswer;

  newAnswerOptionChecked = false;
  newAnswerOptionLabel = '';

  editDisplayAnswer: DisplayAnswer;
  originalDisplayAnswer: DisplayAnswer;

  editDialogMode = false;
  changesAllowed = false;

  roomId: string;

  constructor(private contentService: ContentService,
              private notificationService: NotificationService,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<ContentListComponent>,
              private translationService: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.roomId = localStorage.getItem(`roomId`);
    this.fillCorrectAnswers();
  }

  fillCorrectAnswers() {
    this.displayAnswers = [];
    for (let i = 0; i < this.content.options.length; i++) {
      this.displayAnswers.push(new DisplayAnswer(this.content.options[i], this.content.correctOptionIndexes.includes(i)));
    }
  }

  findAnswerIndexByLabel(label: string): number {
    let index = -1;
    for (let i = 0; i < this.content.options.length; i++) {
      if (this.content.options[i].label.valueOf() === label.valueOf()) {
        index = i;
        break;
      }
    }
    return index;
  }

  addAnswer($event) {
    $event.preventDefault();
    if (this.newAnswerOptionLabel === '') {
      this.translationService.get('content.no-empty2').subscribe(message => {
        this.notificationService.show(message);
      });
      this.newAnswerOptionChecked = false;
      this.newAnswerOptionLabel = '';
      return;
    }
    if (this.singleChoice && this.content.correctOptionIndexes.length > 0 && this.newAnswerOptionChecked) {
      this.translationService.get('content.only-one').subscribe(message => {
        this.notificationService.show(message);
      });
      this.newAnswerOptionChecked = false;
      this.newAnswerOptionLabel = '';
      return;
    }
    for (let i = 0; i < this.content.options.length; i++) {
      if (this.content.options[i].label.valueOf() === this.newAnswerOptionLabel.valueOf()) {
        this.translationService.get('content.same-answer').subscribe(message => {
          this.notificationService.show(message);
        });
        return;
      }
    }
    const points = (this.newAnswerOptionChecked) ? '10' : '-10';
    this.content.options.push(new AnswerOption(this.newAnswerOptionLabel, points));
    this.newAnswerOptionChecked = false;
    this.newAnswerOptionLabel = '';
    this.fillCorrectAnswers();
  }

  openAnswerModificationDialog($event, label: string, points: string, correct: boolean) {
    $event.preventDefault();
    const index = this.findAnswerIndexByLabel(label);
    this.editDisplayAnswer = new DisplayAnswer(new AnswerOption(label, points), correct);
    this.originalDisplayAnswer = new DisplayAnswer(new AnswerOption(label, points), correct);
    const dialogRef = this.dialog.open(AnswerEditComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.answer = this.editDisplayAnswer;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'edit') {
          this.saveChanges(index, this.editDisplayAnswer, true);
        }
      });
  }

  saveChanges(index: number, answer: DisplayAnswer, matDialogOutput: boolean) {
    this.content.options[index].label = answer.answerOption.label;
    this.content.options[index].points = (answer.correct) ? '10' : '-10';
    const indexInCorrectOptionIndexes = this.content.correctOptionIndexes.indexOf(index);
    if (indexInCorrectOptionIndexes === -1 && answer.correct) {
      if (this.singleChoice) {
        this.content.correctOptionIndexes = [index];
        this.fillCorrectAnswers();
        return;
      }
      this.content.correctOptionIndexes.push(index);
    }
    if (indexInCorrectOptionIndexes !== -1 && !answer.correct) {
      this.content.correctOptionIndexes.splice(indexInCorrectOptionIndexes, 1);
    }
    this.fillCorrectAnswers();
    if (matDialogOutput) {
      this.translationService.get('content.changes-made').subscribe(message => {
        this.notificationService.show(message);
      });
    }
  }

  deleteAnswer($event, label: string) {
    $event.preventDefault();
    const index = this.findAnswerIndexByLabel(label);
    this.lastDeletedDisplayAnswer = new DisplayAnswer(this.content.options[index], false);
    this.content.options.splice(index, 1);
    for (let j = 0; j < this.content.correctOptionIndexes.length; j++) {
      if (this.content.correctOptionIndexes[j] === index) {
        this.lastDeletedDisplayAnswer.correct = true;
        this.content.correctOptionIndexes.splice(j, 1);
      }
      if (this.content.correctOptionIndexes[j] > index) { // [j] > i
        this.content.correctOptionIndexes[j] = this.content.correctOptionIndexes[j] - 1;
      }
    }
    this.fillCorrectAnswers();
    this.translationService.get('content.answer-deleted').subscribe(message => {
      this.notificationService.show(message);
    });
  }

  recoverDeletedAnswer($event) {
    $event.preventDefault();
    this.translationService.get('content.answer-recovered').subscribe(message => { this.notificationService.show(message);
    });
    for (let i = 0; i < this.content.options.length; i++) {
      if (this.content.options[i].label.valueOf() === this.lastDeletedDisplayAnswer.answerOption.label.valueOf()) {
        this.translationService.get('content.same-answer').subscribe(message => {
          this.notificationService.show(message);
        });
        return;
      }
    }
    this.content.options.push(this.lastDeletedDisplayAnswer.answerOption);
    if (this.lastDeletedDisplayAnswer.correct) {
      if (this.singleChoice && this.content.correctOptionIndexes.length > 0) {
        this.translationService.get('content.only-one-true').subscribe(message => { this.notificationService.show(message);
        });
      } else {
        this.content.correctOptionIndexes.push(this.content.options.length - 1);
      }
    }
    this.lastDeletedDisplayAnswer = null;
    this.fillCorrectAnswers();
  }

  switchValue(label: string) {
    const index = this.findAnswerIndexByLabel(label);
    this.editDisplayAnswer = new DisplayAnswer(
      new AnswerOption(
        this.displayAnswers[index].answerOption.label,
        this.displayAnswers[index].answerOption.points),
      !this.displayAnswers[index].correct);
    this.saveChanges(index, this.editDisplayAnswer, false);
  }

  reset($event) {
    this.resetP.emit(true);
    $event.preventDefault();
    this.content.subject = '';
    this.content.body = '';
    this.content.options = [];
    this.content.correctOptionIndexes = [];
    this.fillCorrectAnswers();
    this.translationService.get('content.reset-all').subscribe(message => {
      this.notificationService.show(message);
    });
  }

  resetAfterSubmit() {
    this.resetP.emit(true);
    this.content.options = [];
    this.content.correctOptionIndexes = [];
    this.fillCorrectAnswers();
    this.translationService.get('content.submitted').subscribe(message => {
      this.notificationService.show(message);
    });
  }

  submitContent() {
    if (this.contentBod === '' || this.contentSub === '') {
      this.translationService.get('content.no-empty').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    if (this.content.options.length === 0) {
      this.translationService.get('content.need-answers').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    if (this.singleChoice && this.content.correctOptionIndexes.length !== 1) {
      this.translationService.get('content.select-one').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    if (!this.singleChoice && this.content.correctOptionIndexes.length < 1) {
      this.translationService.get('content.at-least-one').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    if (this.singleChoice) {
      this.content.multiple = false;
      this.content.format = ContentType.BINARY;
    } else {
      this.content.multiple = true;
      this.content.format = ContentType.CHOICE;
    }
    if (this.editDialogMode) {
      this.changesAllowed = true;
      return;
    }
    let contentGroup: string;
    if (this.contentCol === 'Default') {
      contentGroup = '';
    } else {
      contentGroup = this.contentCol;
    }
    this.contentService.addContent(new ContentChoice(
      null,
      null,
      this.roomId,
      this.contentSub,
      this.contentBod,
      1,
      [contentGroup],
      this.content.options,
      this.content.correctOptionIndexes,
      this.content.multiple,
      ContentType.CHOICE
    )).subscribe();
    this.resetAfterSubmit();
  }

  editDialogClose($event, action: string) {
    $event.preventDefault();
    if (action.valueOf() === 'edit') {
      this.submitContent();
    }
    if (action.valueOf() === 'abort') {
      this.dialogRef.close(action);
    }
    if (this.changesAllowed) {
      this.dialogRef.close(action);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openDeletionContentDialog($event): void {
    $event.preventDefault();
    const dialogRef = this.dialog.open(ContentDeleteComponent, {
      width: '400px'
    });
    dialogRef.componentInstance.content = this.content;
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result === 'delete') {
          this.dialogRef.close(result);
        }
      });
  }
}
