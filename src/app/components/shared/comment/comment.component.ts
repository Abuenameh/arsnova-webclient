import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../models/comment';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommentService } from '../../../services/http/comment.service';
import { NotificationService } from '../../../services/util/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/util/language.service';
import { WsCommentServiceService } from '../../../services/websockets/ws-comment-service.service';
import { PresentCommentComponent } from '../_dialogs/present-comment/present-comment.component';
import { MatDialog } from '@angular/material';
import { trigger, transition, style, animate, state, keyframes } from '@angular/animations';

export const rubberBand = [
  style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
  style({ transform: 'scale3d(1.05, 0.75, 1)', offset: 0.3 }),
  style({ transform: 'scale3d(0.75, 1.05, 1)', offset: 0.4 }),
  style({ transform: 'scale3d(1.05, 0.95, 1)', offset: 0.5 }),
  style({ transform: 'scale3d(0.95, 1.05, 1)', offset: 0.65 }),
  style({ transform: 'scale3d(1.05, 0.95, 1)', offset: 0.75 }),
  style({ transform: 'scale3d(1, 1, 1)', offset: 1 })
];

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [
    trigger('slide', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void <=> *', animate(700)),
    ]),
    trigger('rubberBand', [
      transition('* => rubberBand', animate(1000, keyframes(rubberBand))),
    ])
  ]
})

export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  isStudent = false;
  isLoading = true;
  hasVoted = 0;
  language: string;
  animationState: string;

  constructor(protected authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private location: Location,
    private commentService: CommentService,
    private notification: NotificationService,
    private translateService: TranslateService,
    public dialog: MatDialog,
    protected langService: LanguageService,
    private wsCommentService: WsCommentServiceService) {
    langService.langEmitter.subscribe(lang => {
      translateService.use(lang);
      this.language = lang;
      } );
  }

  ngOnInit() {
    if (this.authenticationService.getRole() === 0) {
      this.isStudent = true;
    }
    this.language = localStorage.getItem('currentLang');
    this.translateService.use(this.language);
  }

  startAnimation(state_: any): void {
    if (!this.animationState) {
      this.animationState = state_;
    }
  }

  resetAnimationState(): void {
    this.animationState = '';
  }

  setRead(comment: Comment): void {
    this.comment = this.wsCommentService.toggleRead(comment);
  }

  setCorrect(comment: Comment): void {
    this.comment = this.wsCommentService.toggleCorrect(comment);
  }

  setFavorite(comment: Comment): void {
    this.comment = this.wsCommentService.toggleFavorite(comment);
  }

  voteUp(comment: Comment): void {
    if (this.hasVoted !== 1) {
      this.wsCommentService.voteUp(comment);
      this.hasVoted = 1;
    }
  }

  voteDown(comment: Comment): void {
    if (this.hasVoted !== -1) {
      this.wsCommentService.voteDown(comment);
      this.hasVoted = -1;
    }
  }

  delete(comment: Comment): void {
    this.commentService.deleteComment(comment.id).subscribe(room => {
      this.notification.show(`Comment '${comment.body}' successfully deleted.`);
    });
  }

  goToFullScreen(element: Element): void {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  exitFullScreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  openPresentDialog(comment: Comment): void {
    this.goToFullScreen(document.documentElement);
    if (this.isStudent === false) {
      this.wsCommentService.highlight(comment);
    }
    const dialogRef = this.dialog.open(PresentCommentComponent, {
      position: {
        left: '10px',
        right: '10px'
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%'
    });
    dialogRef.componentInstance.body = comment.body;
    dialogRef.afterClosed()
      .subscribe(result => {
        this.wsCommentService.lowlight(comment);
        this.exitFullScreen();

      });
  }
}
