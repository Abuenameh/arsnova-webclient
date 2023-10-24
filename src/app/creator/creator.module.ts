import { NgModule } from '@angular/core';
import { CreatorRoutingModule } from './creator-routing.module';
import { extensions } from './creator.extensions';
import { CoreModule } from '@app/core/core.module';
import { RoomComponent } from './settings/room/room.component';
import { SharedModule } from '@app/shared/shared.module';
import { TranslocoModule, provideTranslocoScope } from '@ngneat/transloco';
import { AccessComponent } from './settings/access/access.component';
import { CommentSettingsComponent } from './settings/comment-settings/comment-settings.component';
import { ContentGroupCreationComponent } from './_dialogs/content-group-creation/content-group-creation.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { ExtensionPointModule } from '@projects/extension-point/src/lib/extension-point.module';
import { DialogService } from '@app/core/services/util/dialog.service';
import { AnnouncementSettingsComponent } from './settings/announcement-settings/announcement-settings.component';
import { SettingsPanelHeaderComponent } from '@app/standalone/settings-panel-header/settings-panel-header.component';
import { SettingsSlideToggleComponent } from '@app/standalone/settings-slide-toggle/settings-slide-toggle.component';
import { HintComponent } from '@app/standalone/hint/hint.component';
import { CreatorPageComponent } from './creator-page.component';
import { FooterComponent } from '@app/standalone/footer/footer.component';
import { DividerComponent } from '@app/standalone/divider/divider.component';
import { RenderedTextComponent } from '@app/standalone/rendered-text/rendered-text.component';
import { FormattingToolbarComponent } from '@app/standalone/formatting-toolbar/formatting-toolbar.component';
import { FocusModeService } from '@app/creator/_services/focus-mode.service';
import { LoadingButtonComponent } from '@app/standalone/loading-button/loading-button.component';
import { TemplateService } from '@app/creator/_services/template.service';
import { ContentGroupTemplateSelectionComponent } from './_dialogs/content-group-template-selection/content-group-template-selection.component';
import { ContentGroupTemplateComponent } from '@app/standalone/content-group-template/content-group-template.component';
import { TemplateTagSelectionComponent } from '@app/standalone/template-tag-selection/template-tag-selection.component';
import { TemplateLanguageSelectionComponent } from '@app/standalone/template-language-selection/template-language-selection.component';

@NgModule({
  imports: [
    extensions,
    CreatorRoutingModule,
    CoreModule,
    SharedModule,
    TranslocoModule,
    ExtensionPointModule,
    SettingsPanelHeaderComponent,
    SettingsSlideToggleComponent,
    HintComponent,
    FooterComponent,
    DividerComponent,
    RenderedTextComponent,
    FormattingToolbarComponent,
    LoadingButtonComponent,
    ContentGroupTemplateComponent,
    TemplateTagSelectionComponent,
    TemplateLanguageSelectionComponent,
  ],
  declarations: [
    RoomComponent,
    AccessComponent,
    CommentSettingsComponent,
    ContentGroupCreationComponent,
    SettingsPageComponent,
    AnnouncementSettingsComponent,
    CreatorPageComponent,
    ContentGroupTemplateSelectionComponent,
  ],
  providers: [
    provideTranslocoScope('creator'),
    DialogService,
    FocusModeService,
    TemplateService,
  ],
})
export class CreatorModule {}
