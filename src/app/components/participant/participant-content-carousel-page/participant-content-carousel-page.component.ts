import { AfterContentInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContentType } from '../../../models/content-type.enum';
import { ContentService } from '../../../services/http/content.service';
import { Content } from '../../../models/content';
import { ContentGroup } from '../../../models/content-group';
import { TranslateService } from '@ngx-translate/core';
import { StepperComponent } from '../../shared/stepper/stepper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/http/room.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../services/util/global-storage.service';
import { AnnounceService } from '../../../services/util/announce.service';
import { Location } from '@angular/common';
import { ContentAnswerService } from '../../../services/http/content-answer.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { Answer } from '../../../models/answer';
import { RoutingService } from '../../../services/util/routing.service';
import { AdvancedSnackBarTypes, NotificationService } from '../../../services/util/notification.service';
import { ContentGroupService } from '../../../services/http/content-group.service';
import { EventService } from '../../../services/util/event.service';
import { EntityChanged } from '../../../models/events/entity-changed';
import { Subscription } from 'rxjs';
import { ContentFocusState } from '../../../models/events/remote/content-focus-state';
import { RemoteMessage } from '../../../models/events/remote/remote-message.enum';

@Component({
  selector: 'app-participant-content-carousel-page',
  templateUrl: './participant-content-carousel-page.component.html',
  styleUrls: ['./participant-content-carousel-page.component.scss']
})
export class ParticipantContentCarouselPageComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild(StepperComponent) stepper: StepperComponent;

  ContentType: typeof ContentType = ContentType;

  contents: Content[] = [];
  contentGroup: ContentGroup;
  contentGroupName: string;
  shortId: string;
  isLoading = true;
  alreadySent = new Map<number, boolean>();
  status = {
    LAST_CONTENT: 'LAST_CONTENT',
    FIRST_UNANSWERED: 'FIRST_UNANSWERED',
    NORMAL: 'NORMAL',
    PRE_START: 'PRE_START'
  };
  started: string;
  answers: Answer[];
  currentStep: number;
  isReloading = false;
  displaySnackBar = false;
  guided = false;
  lockedContentId: string;
  changesSubscription: Subscription;
  remoteSubscription: Subscription;
  focusStateSubscription: Subscription;

  constructor(
    private contentService: ContentService,
    protected translateService: TranslateService,
    protected roomService: RoomService,
    private contentgroupService: ContentGroupService,
    protected route: ActivatedRoute,
    private announceService: AnnounceService,
    private globalStorageService: GlobalStorageService,
    private location: Location,
    private answerService: ContentAnswerService,
    private authenticationService: AuthenticationService,
    private routingService: RoutingService,
    private notificationService: NotificationService,
    private eventService: EventService,
    private router: Router
  ) {
  }

  ngAfterContentInit() {
    setTimeout(() => {
      document.getElementById('live-announcer-button').focus();
    }, 700);
  }


  ngOnDestroy(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    if (this.remoteSubscription) {
      this.remoteSubscription.unsubscribe();
    }
    if (this.focusStateSubscription) {
      this.focusStateSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.translateService.use(this.globalStorageService.getItem(STORAGE_KEYS.LANGUAGE));
    const lastContentIndex = this.route.snapshot.params['contentIndex'] - 1;
    this.contentGroupName = this.route.snapshot.params['seriesName'];
    this.route.data.subscribe(data => {
      this.shortId = data.room.shortId;
      this.contentgroupService.getByRoomIdAndName(data.room.id, this.contentGroupName).subscribe(contentGroup => {
        this.contentGroup = contentGroup;
        this.getContents(lastContentIndex);
      },
        error => {
        this.finishLoading()
        });
    });
    this.changesSubscription = this.eventService.on('EntityChanged').subscribe(changes => {
      this.handleStateEvent(changes);
    });
    this.remoteSubscription = this.eventService.on<ContentFocusState>(RemoteMessage.CONTENT_STATE_UPDATED).subscribe(state => {
      if (this.contentGroup.id === state.contentGroupId) {
        if (!this.currentStep || this.contents[this.currentStep]?.id !== state.contentId) {
          const newIndex = this.getIndexOfContentById(state.contentId);
          if (newIndex > -1) {
            if (this.started === this.status.NORMAL) {
              this.stepper.onClick(newIndex);
            } else {
              this.initStepper(newIndex);
            }
          } else {
            this.lockedContentId = state.contentId;
          }
        }
      } else {
        this.contentgroupService.getById(state.contentGroupId).subscribe(group => {
          this.router.navigate(['p', 'room', this.shortId, 'group', group.name]).then(() => {
            this.contentGroup = group;
            this.isReloading = true;
            this.getContents(null, state.contentId);
          });
        });
      }
    });
    this.focusStateSubscription = this.eventService.on<boolean>(RemoteMessage.FOCUS_STATE_CHANGED).subscribe(guided => {
      this.guided = guided;
    });
  }

  getIndexOfContentById(id: string): number {
    return this.contents.map(c => c.id).indexOf(id);
  }

  getContents(lastContentIndex, nextContentId?: string) {
    this.contents = [];
    const publishedIds = this.contentgroupService.filterPublishedIds(this.contentGroup);
    if (publishedIds.length > 0 && this.contentGroup.published) {
      this.contentService.getContentsByIds(this.contentGroup.roomId, publishedIds).subscribe(contents => {
        this.contents = this.contentService.getSupportedContents(contents);
        if (nextContentId) {
          lastContentIndex = this.getIndexOfContentById(nextContentId);
        }
        if (lastContentIndex >= this.contents.length) {
          lastContentIndex = this.contents.length - 1;
        }
        if (this.isReloading) {
          if (this.lockedContentId) {
            const newIndex = this.getIndexOfContentById(this.lockedContentId);
            if (newIndex) {
              lastContentIndex = newIndex;
              this.lockedContentId = null;
            }
          }
          this.updateURL(lastContentIndex);
        }
        this.getAnswers(lastContentIndex);
      });
    } else {
      this.finishLoading();
    }
  }

  reloadContents() {
    this.isReloading = true;
    this.getContents(this.currentStep);
  }

  finishLoading() {
    this.isLoading = false;
    this.isReloading = false;
  }

  announce(key: string) {
    this.announceService.announce(key);
  }

  checkIfLastContentExists(contentIndex: number) {
    if (contentIndex >= 0) {
      this.initStepper(contentIndex);
    } else {
      if (!this.guided) {
        this.getFirstUnansweredContent();
      }
    }
  }

  initStepper(index: number, delay: number = 0) {
    setTimeout(() => {
      this.currentStep = index;
      this.stepper.init(index, this.contents.length);
    }, delay);
    this.started = this.status.NORMAL;
  }

  updateURL(index?: number) {
    if (this.currentStep !== index || !this.isReloading) {
      this.currentStep = index || 0;
      const urlTree = this.router.createUrlTree(['p', this.shortId, 'series', this.contentGroupName, index + 1]);
      this.location.replaceState(this.router.serializeUrl(urlTree));
    }
  }

  getFirstUnansweredContent() {
    let isInitialized = false;
    for (let i = 0; i < this.alreadySent.size; i++) {
      if (this.alreadySent.get(i) === false) {
        this.initStepper(i, 200);
        isInitialized = true;
        break;
      }
    }
    if (!isInitialized) {
      this.initStepper(0);
    }
    if (!this.currentStep && this.answers.length === 0 || this.contents.length === 1) {
      this.updateURL(0);
    }
  }

  nextContent(finish?: boolean) {
    if (!finish) {
      this.stepper.next();
    } else {
      this.stepper.headerPos = 0;
      this.stepper.onClick(0);
    }
  }

  receiveSentStatus(answer: Answer, index: number) {
    this.alreadySent.set(index, !!answer);
    this.answers[this.getIndexOfContentById(answer.contentId)] = answer;
    if (!this.guided) {
      if (this.started === this.status.NORMAL) {
        if (index < this.contents.length - 1) {
          let wait = 400;
          if (this.contents[index].state.answersPublished) {
            wait += 600;
          }
          setTimeout(() => {
            this.nextContent();
            setTimeout(() => {
              document.getElementById('step').focus();
            }, 200);
          }, wait);
        } else {
          this.announce('answer.a11y-last-content');
        }
      }
    }
  }

  getAnswers(lastContentIndex: number) {
    this.authenticationService.getCurrentAuthentication().subscribe(auth => {
      this.answerService.getAnswersByUserIdContentIds(this.contentGroup.roomId, auth.userId, this.contents
        .map(c => c.id)).subscribe(answers => {
          let answersAdded = 0;
          this.answers = [];
          for (const [index, content] of this.contents.entries()) {
            if (answersAdded < answers.length) {
              for (const answer of answers) {
                if (content.id === answer.contentId) {
                  this.answers[index] = answer;
                  answersAdded++;
                }
              }
            }
            this.alreadySent.set(index, !!this.answers[index]);
          }
          this.finishLoading();
          this.checkIfLastContentExists(lastContentIndex);
        },
        error => {
          this.finishLoading();
          const msg = this.translateService.instant('answer.group-not-available');
          this.notificationService.showAdvanced(msg, AdvancedSnackBarTypes.WARNING);
        });
    });
  }

  handleStateEvent(changes) {
    if (changes.entity.id === this.contentGroup.id) {
      this.contentGroup = changes.entity;
      const changedEvent = new EntityChanged('ContentGroup', changes.entity, changes.changedProperties);
      if (changedEvent.hasPropertyChanged('firstPublishedIndex') || changedEvent.hasPropertyChanged('lastPublishedIndex')
        || changedEvent.hasPropertyChanged('published')) {
        if (this.guided) {
          this.reloadContents();
        } else {
          if (!this.displaySnackBar) {
            this.displaySnackBar = true;
            const contentsChangedMessage = this.translateService.instant('answer.state-changed');
            const loadString = this.translateService.instant('answer.load');
            this.notificationService.show(contentsChangedMessage, loadString, { duration: 5000 });
            this.notificationService.snackRef.onAction().subscribe(() => {
              this.displaySnackBar = false;
              this.reloadContents();
            });
            this.notificationService.snackRef.afterDismissed().subscribe(() => {
              this.displaySnackBar = false;
            })
          }
        }
      }
    }
  }
}
