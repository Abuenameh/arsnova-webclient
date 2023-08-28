import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  NavBarComponent,
  NavBarItem,
} from '@app/shared/bars/nav-bar/nav-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService } from '@app/core/services/util/routing.service';
import {
  GlobalStorageService,
  STORAGE_KEYS,
} from '@app/core/services/util/global-storage.service';
import { RoomStatsService } from '@app/core/services/http/room-stats.service';
import { FeedbackService } from '@app/core/services/http/feedback.service';
import { ContentGroupService } from '@app/core/services/http/content-group.service';
import { EventService } from '@app/core/services/util/event.service';
import { BarItem } from '@app/shared/bars/bar-base';
import { ContentGroup } from '@app/core/models/content-group';
import { map, takeUntil } from 'rxjs/operators';
import { ApiConfigService } from '@app/core/services/http/api-config.service';
import { Subject } from 'rxjs';
import { AnnounceService } from '@app/core/services/util/announce.service';
import { Hotkey, HotkeyService } from '@app/core/services/util/hotkey.service';
import { HotkeyAction } from '@app/core/directives/hotkey.directive';
import { TranslateService } from '@ngx-translate/core';
import { RoutingFeature } from '@app/core/models/routing-feature.enum';
import { ContentService } from '@app/core/services/http/content.service';
import { Content } from '@app/core/models/content';
import { DialogService } from '@app/core/services/util/dialog.service';
import { ContentType } from '@app/core/models/content-type.enum';
import {
  AdvancedSnackBarTypes,
  NotificationService,
} from '@app/core/services/util/notification.service';
import { RoomService } from '@app/core/services/http/room.service';
import { CommentSettingsService } from '@app/core/services/http/comment-settings.service';
import { ContentPublishService } from '@app/core/services/util/content-publish.service';
import { CommentSort } from '@app/core/models/comment-sort.enum';
import { PresentationService } from '@app/core/services/util/presentation.service';
import { ContentPresentationState } from '@app/core/models/events/content-presentation-state';
import { PresentationStepPosition } from '@app/core/models/events/presentation-step-position.enum';
import { CommentPresentationState } from '@app/core/models/events/comment-presentation-state';
import { RoundState } from '@app/core/models/events/round-state';
import { FocusModeService } from '@app/creator/_services/focus-mode.service';

export class KeyNavBarItem extends NavBarItem {
  key: string;
  displayKey: string;
  disabled: boolean;

  constructor(
    name: string,
    icon: string,
    url: string,
    key: string,
    disabled = false
  ) {
    super(name, icon, url, false);
    const keyInfo = HotkeyService.getKeyDisplayInfo(key);
    this.key = key;
    this.displayKey = keyInfo.translateKeyName
      ? 'control-bar.' + keyInfo.keyName
      : keyInfo.keySymbol;
    this.disabled = disabled;
  }
}

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss'],
})
export class ControlBarComponent
  extends NavBarComponent
  implements OnInit, OnDestroy
{
  @Input() shortId: string;
  @Output() activeFeature: EventEmitter<string> = new EventEmitter<string>();
  @Output() activeGroup: EventEmitter<string> = new EventEmitter<string>();

  isLoading = true;
  destroyed$ = new Subject<void>();
  destroyed = false;
  inFullscreen = false;
  barItems: KeyNavBarItem[] = [];
  surveyStarted = false;
  contentStepState = PresentationStepPosition.START;
  commentStepState = PresentationStepPosition.START;
  menuOpen = false;
  joinUrl: string;
  currentCommentZoom = 100;
  currentCommentSort: CommentSort;
  commentSortTypes = [CommentSort.TIME, CommentSort.VOTEDESC];
  isCurrentContentPublished = false;
  contentIndex = 0;
  content: Content;
  notificationMessage: string;
  notificationIcon: string;
  showNotification = false;

  features: BarItem[] = [
    new BarItem(RoutingFeature.COMMENTS, 'question_answer'),
    new BarItem(RoutingFeature.CONTENTS, 'equalizer'),
    new BarItem(RoutingFeature.FEEDBACK, 'thumbs_up_down'),
  ];
  groupItems: KeyNavBarItem[] = [
    new KeyNavBarItem('results', 'insert_chart', '', ' '),
    new KeyNavBarItem('correct', 'check_circle', '', 'c'),
    new KeyNavBarItem('lock', 'lock', '', 'l'),
  ];
  surveyItems: KeyNavBarItem[] = [
    new KeyNavBarItem('start', 'play_arrow', '', ' '),
    new KeyNavBarItem('change-type', 'swap_horiz', '', 'c'),
  ];
  arrowItems: KeyNavBarItem[] = [
    new KeyNavBarItem('left', 'arrow_back', '', 'ArrowLeft', true),
    new KeyNavBarItem('right', 'arrow_forward', '', 'ArrowRight'),
  ];
  generalItems: KeyNavBarItem[] = [
    new KeyNavBarItem('share', 'qr_code', '', 'q'),
    new KeyNavBarItem('fullscreen', 'open_in_full', '', 'f'),
    new KeyNavBarItem('exit', 'close', '', 'Escape'),
  ];
  zoomItems: KeyNavBarItem[] = [
    new KeyNavBarItem('zoom-in', 'zoom_in', '', '+'),
    new KeyNavBarItem('zoom-out', 'zoom_out', '', '-'),
  ];
  moreItem: KeyNavBarItem = new KeyNavBarItem('more', 'more_horiz', '', 'm');

  cursorTimer?: ReturnType<typeof setTimeout>;
  barTimer?: ReturnType<typeof setTimeout>;
  cursorVisible = true;
  barVisible = false;
  HotkeyAction = HotkeyAction;

  private hotkeyRefs: symbol[] = [];

  multipleRounds = false;
  contentRounds = new Map<string, number>();
  rounds = ['1', '2', '1 & 2'];
  ContentType: typeof ContentType = ContentType;

  constructor(
    protected router: Router,
    protected routingService: RoutingService,
    protected route: ActivatedRoute,
    protected globalStorageService: GlobalStorageService,
    protected roomStatsService: RoomStatsService,
    protected feedbackService: FeedbackService,
    protected contentGroupService: ContentGroupService,
    protected eventService: EventService,
    protected apiConfigService: ApiConfigService,
    protected roomService: RoomService,
    protected commentSettingsService: CommentSettingsService,
    protected focusModeService: FocusModeService,
    private announceService: AnnounceService,
    private hotkeyService: HotkeyService,
    private translateService: TranslateService,
    private contentService: ContentService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private contentPublishService: ContentPublishService,
    private presentationService: PresentationService
  ) {
    super(
      router,
      routingService,
      route,
      globalStorageService,
      roomStatsService,
      feedbackService,
      contentGroupService,
      eventService,
      roomService,
      commentSettingsService,
      focusModeService
    );
    this.showBar();
    this.setBarTimer(3000);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyed = true;
    this.showCursor();
    clearTimeout(this.cursorTimer);
    this.hotkeyRefs.forEach((h) => this.hotkeyService.unregisterHotkey(h));
  }

  sendControlBarState() {
    this.eventService.broadcast('ControlBarVisible', this.barVisible);
  }

  isActiveFeature(feature: string): boolean {
    return (
      this.barItems.map((b) => b.name).indexOf(feature) ===
      this.currentRouteIndex
    );
  }

  afterInit() {
    const lastSort = this.globalStorageService.getItem(
      STORAGE_KEYS.COMMENT_SORT
    );
    this.subscribeFullscreen();
    this.registerHotkeys();
    this.currentCommentSort =
      lastSort && lastSort !== CommentSort.VOTEASC
        ? lastSort
        : CommentSort.TIME;
    this.route.data.subscribe((data) => {
      this.surveyStarted = !data.room.settings.feedbackLocked;
      this.setSurveyState();
      if (this.groupName && this.contentGroups.length > 0) {
        const group = this.contentGroups.find((g) => g.name === this.groupName);
        if (group) {
          this.group = group;
        }
        this.checkIfContentLocked();
        if (
          this.isActiveFeature(RoutingFeature.CONTENTS) &&
          !this.group.published
        ) {
          this.publishContentGroup();
        }
      }
    });
    this.subscribeToStates();
    this.subscribeToEvents();
    setTimeout(() => {
      this.sendControlBarState();
    }, 300);
    this.apiConfigService
      .getApiConfig$()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((config) => {
        if (config.ui.links?.join) {
          this.joinUrl =
            this.removeProtocolFromString(config.ui.links.join.url) +
            this.shortId;
        }
      });
    this.isLoading = false;
    document.onmousemove = () => {
      if (!this.destroyed) {
        this.afterMouseMoved();
      }
    };
  }

  hideCursor() {
    this.cursorTimer = undefined;
    document.body.style.cursor = 'none';
    this.cursorVisible = false;
  }

  showCursor() {
    document.body.style.cursor = 'default';
    this.cursorVisible = true;
  }

  afterMouseMoved() {
    if (!this.cursorVisible) {
      this.showCursor();
    }
    if (this.cursorTimer) {
      clearTimeout(this.cursorTimer);
    }
    this.cursorTimer = setTimeout(() => {
      this.hideCursor();
    }, 3000);
  }

  subscribeToStates() {
    this.presentationService
      .getContentState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        this.evaluateContentState(state);
      });
    this.presentationService
      .getCommentState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((state) => {
        this.evaluateCommentState(state);
      });
    this.presentationService
      .getMultipleRoundState()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (multipleRounds) => (this.multipleRounds = multipleRounds || false)
      );
  }

  subscribeToEvents() {
    this.barItems.map((b) => (b.key = this.getFeatureKey(b.name)));
    this.presentationService
      .getFeedbackStarted()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((started) => {
        this.surveyStarted = started;
        this.setSurveyState();
      });
    this.presentationService
      .getCommentZoomChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((zoom) => {
        this.currentCommentZoom = Math.round(zoom);
        this.announceService.announce(
          'presentation.a11y-comment-zoom-changed',
          { zoom: this.currentCommentZoom }
        );
      });
    this.presentationService
      .getContentGroupChanges()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((group) => {
        this.group = group;
        this.checkIfContentLocked();
      });
    this.contentService
      .getAnswersDeleted()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((contentId) => {
        if (contentId === this.content?.id) {
          this.content.state.round = 1;
          this.changeRound(0);
          this.multipleRounds = false;
        }
      });
    this.contentService
      .getRoundStarted()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((content) => {
        if (content) {
          this.afterRoundStarted(content);
        }
      });
  }

  evaluateContentState(state?: ContentPresentationState) {
    if (state) {
      this.contentStepState = state.position;
      this.contentIndex = state.index;
      this.content = state.content;
      this.contentRounds.set(this.content.id, this.content.state.round - 1);
      this.globalStorageService.setItem(
        STORAGE_KEYS.LAST_INDEX,
        this.contentIndex
      );
      this.setArrowsState(this.contentStepState);
      this.checkIfContentLocked();
    }
  }

  evaluateCommentState(state?: CommentPresentationState) {
    if (state) {
      this.commentStepState = state.stepState;
      if (this.isActiveFeature(RoutingFeature.COMMENTS)) {
        this.setArrowsState(this.commentStepState);
      }
    }
  }

  checkIfContentLocked() {
    if (this.contentIndex !== undefined) {
      this.isCurrentContentPublished =
        this.contentPublishService.isIndexPublished(
          this.group,
          this.contentIndex
        );
      this.groupItems[2].icon = this.isCurrentContentPublished
        ? 'lock'
        : 'lock_open';
      this.groupItems[2].name = this.isCurrentContentPublished
        ? 'lock'
        : 'publish';
      if (!this.isCurrentContentPublished) {
        if (!this.showNotification) {
          this.notificationMessage = 'control-bar.content-locked';
          this.notificationIcon = 'lock';
          this.showNotification = true;
          this.announceService.announce('control-bar.content-locked');
        }
      } else if (this.showNotification) {
        this.showNotification = false;
        this.announceService.announce('control-bar.content-published');
      }
    }
  }

  removeProtocolFromString(url: string): string {
    return url.replace(/^https?:\/\//, '');
  }

  setSurveyState() {
    this.surveyItems[0].name = this.surveyStarted ? 'stop' : 'start';
    this.surveyItems[0].icon = this.surveyStarted ? 'stop' : 'play_arrow';
    this.surveyItems[1].disabled = this.surveyStarted;
  }

  setArrowsState(state: PresentationStepPosition) {
    switch (state) {
      case PresentationStepPosition.START:
        this.setArrowItemsState(true, false);
        break;
      case PresentationStepPosition.END:
        this.setArrowItemsState(false, true);
        break;
      default:
        this.setArrowItemsState(false, false);
    }
  }

  setArrowItemsState(leftDisabled: boolean, rightDisabled: boolean) {
    this.arrowItems[0].disabled = leftDisabled;
    this.arrowItems[1].disabled = rightDisabled;
  }

  getFeatureKey(name: string): string {
    return (this.features.map((f) => f.name).indexOf(name) + 1).toString();
  }

  updateFeature(feature: string) {
    if (
      this.currentRouteIndex !==
      this.barItems.map((i) => i.name).indexOf(feature)
    ) {
      if (feature) {
        this.getCurrentRouteIndex(feature);
      } else {
        this.currentRouteIndex = undefined;
      }
      this.activeFeature.emit(feature);
      if (feature === RoutingFeature.CONTENTS) {
        this.setArrowsState(this.contentStepState);
        if (!this.group.published) {
          this.publishContentGroup();
        }
      } else if (feature === RoutingFeature.COMMENTS) {
        this.setArrowsState(this.commentStepState);
      }
      setTimeout(() => {
        this.sendControlBarState();
      }, 300);
    }
  }

  getCurrentRouteIndex(feature?: string) {
    let index;
    if (feature) {
      index = this.barItems.map((s) => s.name).indexOf(feature);
    } else {
      const matchingRoutes = this.barItems.filter((s) =>
        this.isRouteMatching(s)
      );
      if (matchingRoutes.length > 0) {
        index = this.barItems.map((s) => s.url).indexOf(matchingRoutes[0].url);
      }
    }
    this.currentRouteIndex = index;
  }

  subscribeFullscreen() {
    document.addEventListener('fullscreenchange', () => {
      this.inFullscreen = !!document.fullscreenElement;
    });
  }

  getBaseUrl(): string {
    return `/present/${this.shortId}/`;
  }

  getFeatureUrl(feature: string): string {
    return this.groupName && feature === RoutingFeature.CONTENTS
      ? feature + this.getGroupUrl()
      : feature;
  }

  navToUrl(index: number) {
    const item = this.barItems[index];
    const url = item.url;
    if (url) {
      this.router.navigateByUrl(url);
    }
  }

  toggleFullscreen() {
    if (this.inFullscreen) {
      this.exitFullscreen();
    } else {
      this.requestFullscreen();
    }
  }

  requestFullscreen() {
    document.documentElement.requestFullscreen();
    this.announceService.announce('presentation.a11y-entered-fullscreen');
  }

  exitFullscreen() {
    document.exitFullscreen();
    this.announceService.announce('presentation.a11y-leaved-fullscreen');
  }

  exitPresentation() {
    if (this.dialogService.dialog.openDialogs.length === 0) {
      if (this.inFullscreen) {
        this.exitFullscreen();
      }
      this.router.navigateByUrl(`edit/${this.shortId}`);
    }
  }

  changeGroup(contentGroup: ContentGroup) {
    if (this.group.id !== contentGroup.id) {
      if (contentGroup.published) {
        this.updateGroup(contentGroup);
      } else {
        this.publishContentGroup(contentGroup);
      }
    }
  }

  updateGroup(contentGroup: ContentGroup) {
    this.setGroup(contentGroup);
    this.activeGroup.emit(this.groupName);
  }

  publishContentGroup(contentGroup: ContentGroup = this.group) {
    const changes = { published: true };
    const dialogRef = this.dialogService.openPublishGroupDialog(
      contentGroup.name,
      () => this.contentGroupService.patchContentGroup(contentGroup, changes)
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'publish') {
        const msg = this.translateService.instant('content.group-published');
        this.notificationService.showAdvanced(
          msg,
          AdvancedSnackBarTypes.SUCCESS
        );
        contentGroup.published = true;
        this.updateGroup(contentGroup);
      }
    });
  }

  toggleBarVisibility(visible: boolean) {
    if (!this.menuOpen) {
      if (visible) {
        if (this.barTimer) {
          clearTimeout(this.barTimer);
        } else {
          this.showBar();
        }
      } else {
        this.setBarTimer(1000);
      }
    }
  }

  showBar() {
    this.barVisible = true;
    this.sendControlBarState();
  }

  hideBar() {
    this.barTimer = undefined;
    this.barVisible = false;
    this.sendControlBarState();
  }

  setBarTimer(millis: number) {
    this.barTimer = setTimeout(() => {
      this.hideBar();
    }, millis);
  }

  menuClosed() {
    this.menuOpen = false;
    this.toggleBarVisibility(false);
  }

  changeCommentSort(sort: CommentSort) {
    this.currentCommentSort = sort;
    this.presentationService.updateCommentSort(this.currentCommentSort);
  }

  private registerHotkeys() {
    const actions: Record<string, () => void> = {
      share: () => this.updateFeature(undefined),
      fullscreen: () => this.toggleFullscreen(),
      exit: () => this.exitPresentation(),
    };
    this.generalItems.forEach((item) =>
      this.translateService
        .get('control-bar.' + item.name)
        .pipe(
          map(
            (t) =>
              ({
                key: item.key,
                action: actions[item.name],
                actionTitle: t,
              }) as Hotkey
          )
        )
        .subscribe((h: Hotkey) =>
          this.hotkeyService.registerHotkey(h, this.hotkeyRefs)
        )
    );
  }

  hasFormatAnswer(format: ContentType): boolean {
    return ![ContentType.SLIDE, ContentType.FLASHCARD].includes(format);
  }

  hasFormatRounds(format: ContentType): boolean {
    return this.contentService.hasFormatRounds(format);
  }

  editContent() {
    this.contentService.goToEdit(
      this.content.id,
      this.shortId,
      this.group.name
    );
  }

  deleteContentAnswers() {
    this.dialogService.openDeleteDialog(
      'content-answers',
      'really-delete-answers',
      undefined,
      undefined,
      () =>
        this.contentService.deleteAnswersOfContent(this.content.id, this.roomId)
    );
  }

  changeRound(round: number) {
    this.contentRounds.set(this.content.id, round);
    const roundState = new RoundState(this.contentIndex, round);
    this.presentationService.updateRoundState(roundState);
  }

  afterRoundStarted(content: Content) {
    this.content = content;
    this.changeRound(this.content.state.round - 1);
    this.multipleRounds = true;
  }

  startNewRound() {
    this.contentService.startNewRound(this.content);
  }
}
