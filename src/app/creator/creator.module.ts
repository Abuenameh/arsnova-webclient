import { NgModule } from '@angular/core';
import { CreatorRoutingModule } from './creator-routing.module';
import { extensions } from './creator.extensions';
import { ContentChoiceCreationComponent } from './content-creation/content-choice-creation/content-choice-creation.component';
import { ContentCreationPageComponent } from './content-creation/content-creation-page/content-creation-page.component';
import { ContentScaleCreationComponent } from './content-creation/content-scale-creation/content-scale-creation.component';
import { ContentTextCreationComponent } from './content-creation/content-text-creation/content-text-creation.component';
import { ContentYesNoCreationComponent } from './content-creation/content-yes-no-creation/content-yes-no-creation.component';
import { CoreModule } from '@app/core/core.module';
import { RoomComponent } from './settings/room/room.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ContentPresentationComponent } from './content-presentation/content-presentation.component';
import { AccessComponent } from './settings/access/access.component';
import { CommentSettingsComponent } from './settings/comment-settings/comment-settings.component';
import { ContentGroupCreationComponent } from './_dialogs/content-group-creation/content-group-creation.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { GroupContentComponent } from './content-list/group-content/group-content.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ContentCreationComponent } from './content-creation/content-creation/content-creation.component';
import { PreviewComponent } from './content-creation/preview/preview.component';
import { TRANSLATION_MODULE_NAME } from '@app/translate-module-name-token';
import { TranslateHttpLoaderFactory } from '@app/translate-http-loader-factory';
import { ExtensionPointModule } from '@projects/extension-point/src/lib/extension-point.module';
import { ContentSortCreationComponent } from './content-creation/content-sort-creation/content-sort-creation.component';
import { ContentFlashcardCreationComponent } from './content-creation/content-flashcard-creation/content-flashcard-creation.component';
import { ContentWordcloudCreationComponent } from './content-creation/content-wordcloud-creation/content-wordcloud-creation.component';
import { ExportComponent } from './_dialogs/export/export.component';
import { DialogService } from '@app/core/services/util/dialog.service';
import { PublishContentComponent } from './_dialogs/publish-content/publish-content.component';
import { CreatorOverviewComponent } from './creator-overview/creator-overview.component';
import { AnnouncementSettingsComponent } from './settings/announcement-settings/announcement-settings.component';
import { CreateAnswerOptionComponent } from './content-creation/create-answer-option/create-answer-option.component';
import { ContentPrioritizationCreationComponent } from './content-creation/content-prioritization-creation/content-prioritization-creation.component';
import { CopyUrlComponent } from './copy-url/copy-url.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { StartNewRoundComponent } from './start-new-round/start-new-round.component';
import { StatisticListComponent } from '@app/creator/statistic-list/statistic-list.component';
import { StatisticsPageComponent } from '@app/creator/statistics-page/statistics-page.component';
import { SettingsPanelHeaderComponent } from '@app/standalone/settings-panel-header/settings-panel-header.component';
import { SettingsSlideToggleComponent } from '@app/standalone/settings-slide-toggle/settings-slide-toggle.component';

@NgModule({
  imports: [
    extensions,
    CreatorRoutingModule,
    CoreModule,
    SharedModule,
    DragDropModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslateHttpLoaderFactory,
        deps: [HttpClient, TRANSLATION_MODULE_NAME],
      },
      isolate: true,
    }),
    CdkStepperModule,
    ExtensionPointModule,
    ClipboardModule,
    SettingsPanelHeaderComponent,
    SettingsSlideToggleComponent,
  ],
  declarations: [
    ContentChoiceCreationComponent,
    ContentCreationPageComponent,
    ContentScaleCreationComponent,
    ContentTextCreationComponent,
    ContentYesNoCreationComponent,
    CreatorOverviewComponent,
    RoomComponent,
    ContentPresentationComponent,
    AccessComponent,
    CommentSettingsComponent,
    ContentGroupCreationComponent,
    SettingsPageComponent,
    GroupContentComponent,
    ContentCreationComponent,
    PreviewComponent,
    ContentSortCreationComponent,
    ContentFlashcardCreationComponent,
    ContentWordcloudCreationComponent,
    ExportComponent,
    PublishContentComponent,
    AnnouncementSettingsComponent,
    CreateAnswerOptionComponent,
    ContentPrioritizationCreationComponent,
    CopyUrlComponent,
    StatisticListComponent,
    StatisticsPageComponent,
    StartNewRoundComponent,
  ],
  exports: [
    ContentPresentationComponent,
    CopyUrlComponent,
    StartNewRoundComponent,
  ],
  providers: [
    { provide: TRANSLATION_MODULE_NAME, useValue: 'creator' },
    DialogService,
  ],
})
export class CreatorModule {}