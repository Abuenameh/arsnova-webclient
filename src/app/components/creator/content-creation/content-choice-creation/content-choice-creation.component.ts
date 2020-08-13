import { Component, OnInit } from '@angular/core';
import { AnswerOption } from '../../../../models/answer-option';
import { ContentChoice } from '../../../../models/content-choice';
import { ContentService } from '../../../../services/http/content.service';
import { NotificationService } from '../../../../services/util/notification.service';
import { ContentType } from '../../../../models/content-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../../../services/util/event.service';
import { RoomService } from '../../../../services/http/room.service';
import { MatDialog } from '@angular/material/dialog';
import { GlobalStorageService } from '../../../../services/util/global-storage.service';
import { ContentGroupService } from '../../../../services/http/content-group.service';
import { ContentCreationComponent, DisplayAnswer } from '../content-creation/content-creation.component';

@Component({
  selector: 'app-content-choice-creator',
  templateUrl: './content-choice-creation.component.html',
  styleUrls: ['./content-choice-creation.component.scss']
})
export class ContentChoiceCreationComponent extends ContentCreationComponent implements OnInit {

  multipleCorrectAnswers = false;
  noCorrectAnswers = false;
  lastDeletedDisplayAnswer: DisplayAnswer;
  newAnswerOptionChecked = false;
  newAnswerOptionLabel = '';
  updatedAnswer: string;
  isAnswerEdit = -1;

  constructor(
    protected contentService: ContentService,
    protected notificationService: NotificationService,
    protected translationService: TranslateService,
    protected roomService: RoomService,
    protected globalStorageService: GlobalStorageService,
    protected contentGroupService: ContentGroupService,
    public eventService: EventService,
    public dialog: MatDialog
  ) {
    super(contentService, notificationService, translationService, roomService, globalStorageService, contentGroupService);
  }

  initContentCreation() {
    this.content = new ContentChoice(
      null,
      null,
      '',
      '',
      '',
      [],
      [],
      [],
      true,
      ContentType.CHOICE,
      null
    );
    this.fillCorrectAnswers();
  }

  findAnswerIndexByLabel(label: string): number {
    let index = -1;
    for (let i = 0; i < (this.content as ContentChoice).options.length; i++) {
      if ((this.content as ContentChoice).options[i].label.valueOf() === label.valueOf()) {
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
    if ((!this.multipleCorrectAnswers) && (this.content as ContentChoice).correctOptionIndexes.length > 0 && this.newAnswerOptionChecked) {
      this.translationService.get('content.only-one').subscribe(message => {
        this.notificationService.show(message);
      });
      this.newAnswerOptionChecked = false;
      this.newAnswerOptionLabel = '';
      return;
    }
    if (this.checkIfAnswerExists(this.newAnswerOptionLabel.valueOf())) {
      return;
    }
    if ((this.content as ContentChoice).options.length < 8) {
      const points = (this.newAnswerOptionChecked) ? 10 : -10;
      (this.content as ContentChoice).options.push(new AnswerOption(this.newAnswerOptionLabel, points));
      this.newAnswerOptionChecked = false;
      this.newAnswerOptionLabel = '';
      this.fillCorrectAnswers();
      document.getElementById('answer-input').focus();
    } else {
      this.translationService.get('content.max-answers').subscribe(msg => {
        this.notificationService.show(msg);
      });
    }
  }

  checkIfAnswerExists(label: string): boolean {
    for (let i = 0; i < (this.content as ContentChoice).options.length; i++) {
      if ((this.content as ContentChoice).options[i].label === label) {
        this.translationService.get('content.same-answer').subscribe(message => {
          this.notificationService.show(message);
        });
        return true;
      }
    }
  }

  updateAnswer(index: number, answer: DisplayAnswer) {
    answer.answerOption.label = this.updatedAnswer;
    this.saveChanges(index, answer);
    this.leaveEditMode();
  }

  goInEditMode(index: number, answer: DisplayAnswer): void {
    this.updatedAnswer = answer.answerOption.label;
    this.isAnswerEdit = index;
    document.getElementsByName('answerEdit').item(index).focus();
  }

  leaveEditMode(): void {
    this.isAnswerEdit = -1;
  }

  saveChanges(index: number, answer: DisplayAnswer) {
    if (!this.multipleCorrectAnswers) {
      for (const option of (this.content as ContentChoice).options) {
        option.points = -10;
      }
    }
    (this.content as ContentChoice).options[index].label = answer.answerOption.label;
    (this.content as ContentChoice).options[index].points = (answer.correct) ? 10 : -10;
    const indexInCorrectOptionIndexes = (this.content as ContentChoice).correctOptionIndexes.indexOf(index);
    if (indexInCorrectOptionIndexes === -1 && answer.correct) {
      if (!this.multipleCorrectAnswers) {
        (this.content as ContentChoice).correctOptionIndexes = [index];
        this.fillCorrectAnswers();
        return;
      }
      (this.content as ContentChoice).correctOptionIndexes.push(index);
    }
    if (indexInCorrectOptionIndexes !== -1 && !answer.correct) {
      (this.content as ContentChoice).correctOptionIndexes.splice(indexInCorrectOptionIndexes, 1);
    }
    this.fillCorrectAnswers();
  }

  deleteAnswer($event, label: string) {
    $event.preventDefault();
    const index = this.findAnswerIndexByLabel(label);
    this.lastDeletedDisplayAnswer = new DisplayAnswer((this.content as ContentChoice).options[index], false);
    (this.content as ContentChoice).options.splice(index, 1);
    for (let j = 0; j < (this.content as ContentChoice).correctOptionIndexes.length; j++) {
      if ((this.content as ContentChoice).correctOptionIndexes[j] === index) {
        this.lastDeletedDisplayAnswer.correct = true;
        (this.content as ContentChoice).correctOptionIndexes.splice(j, 1);
      }
      if ((this.content as ContentChoice).correctOptionIndexes[j] > index) {
        (this.content as ContentChoice).correctOptionIndexes[j] = (this.content as ContentChoice).correctOptionIndexes[j] - 1;
      }
    }
    this.fillCorrectAnswers();
    this.translationService.get('content.answer-deleted').subscribe(message => {
      this.notificationService.show(message);
    });
  }

  switchValue(label: string) {
    const index = this.findAnswerIndexByLabel(label);
    const answer = new DisplayAnswer(
      new AnswerOption(
        this.displayAnswers[index].answerOption.label,
        this.displayAnswers[index].answerOption.points),
      !this.displayAnswers[index].correct);
    this.saveChanges(index, answer);
  }

  removeCorrectAnswers() {
     for (let i = 0; i < this.displayAnswers.length; i++) {
      this.displayAnswers[i].correct = false;
      this.saveChanges(i, this.displayAnswers[i]);
    }
  }

  createContent(): boolean {
    if ((this.content as ContentChoice).options.length < 2) {
      this.translationService.get('content.need-answers').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    if ((!this.multipleCorrectAnswers) && (!this.noCorrectAnswers) && (this.content as ContentChoice).correctOptionIndexes.length !== 1) {
      this.translationService.get('content.select-one').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    if (this.multipleCorrectAnswers && (!this.noCorrectAnswers) && (this.content as ContentChoice).correctOptionIndexes.length < 1) {
      this.translationService.get('content.at-least-one').subscribe(message => {
        this.notificationService.show(message);
      });
      return;
    }
    (this.content as ContentChoice).multiple = this.multipleCorrectAnswers;
    return true;
  }
}
