import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DisplayAnswer } from '../../../creator/content-creation/content-creation/content-creation.component';
import { AnswerOption } from '../../../../models/answer-option';
import { TranslateService } from '@ngx-translate/core';
import { AdvancedSnackBarTypes, NotificationService } from '../../../../services/util/notification.service';
import { EventService } from '../../../../services/util/event.service';
import { Content } from '../../../../models/content';
import { ContentType } from '../../../../models/content-type.enum';
import { ContentChoice } from '../../../../models/content-choice';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss']
})
export class ContentEditComponent implements OnInit {
  displayAnswers: DisplayAnswer[] = [];
  displayedColumns = ['label', 'checked'];
  ansCounter = 1;

  constructor(private translateService: TranslateService,
              private notificationService: NotificationService,
              public dialogRef: MatDialogRef<ContentEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Content,
              public eventService: EventService) {
  }

  ngOnInit() {
    if (this.data.format !== ContentType.TEXT) {
      for (let i = 0; i < (this.data as ContentChoice).options.length; i++) {
        let correct: boolean;
        correct = (this.data as ContentChoice).options[i].points > 0;
        this.displayAnswers[i] = new DisplayAnswer(new AnswerOption((this.data as ContentChoice).options[i].label,
          (this.data as ContentChoice).options[i].points), correct);
      }
    }
  }

  updateAnswer(index: number) {
    if (this.displayAnswers[index].correct === true) {
      this.ansCounter++;
      if ((!(this.data as ContentChoice).multiple) && this.ansCounter > 1) {
        for (let i = 0; i < this.displayAnswers.length; i++) {
          if (!(i === index)) {
            this.displayAnswers[i].correct = false;
            (this.data as ContentChoice).options[i].points = -10;
          }
        }
        this.ansCounter = 1;
      }
      (this.data as ContentChoice).options[index].points = 10;
    } else {
      this.ansCounter--;
      (this.data as ContentChoice).options[index].points = -10;
    }
  }

  updateContent() {
    if (this.data.body === '') {
      this.translateService.get('dialog.no-empty').subscribe(message => {
        this.notificationService.showAdvanced(message, AdvancedSnackBarTypes.WARNING);
      });
      return;
    }
    if (this.data.format !== ContentType.TEXT && this.data.format !== ContentType.SLIDE) {
      for (let i = 0; i < (this.data as ContentChoice).options.length; i++) {
        if (this.displayAnswers[i].answerOption.label === '') {
          this.translateService.get('dialog.no-empty-answers').subscribe(message => {
            this.notificationService.showAdvanced(message, AdvancedSnackBarTypes.WARNING);
          });
          return;
        }
      }
      if (this.data.format === ContentType.CHOICE) {
        for (let i = 0; i < (this.data as ContentChoice).options.length; i++) {
          (this.data as ContentChoice).options[i].label = this.displayAnswers[i].answerOption.label;
        }
      }
    }
    this.dialogRef.close('update');
    return;
  }
}
