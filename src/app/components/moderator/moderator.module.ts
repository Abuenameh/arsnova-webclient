import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModeratorRoutingModule } from './moderator-routing.module';
import { extensions } from './moderator.extensions';
import { RoomModeratorPageComponent } from './room-moderator-page/room-moderator-page.component';
import { ModeratorCommentPageComponent } from './moderator-comment-page/moderator-comment-page.component';
import { EssentialsModule } from '../essentials/essentials.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TRANSLATION_MODULE_NAME } from '../../translate-module-name-token';
import { TranslateHttpLoaderFactory } from '../../translate-http-loader-factory';
import { HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        extensions,
        CommonModule,
        ModeratorRoutingModule,
        EssentialsModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (TranslateHttpLoaderFactory),
                deps: [
                  HttpClient,
                  TRANSLATION_MODULE_NAME
                ]
            },
            isolate: true
        })
    ],
  declarations: [
    RoomModeratorPageComponent,
    ModeratorCommentPageComponent
  ],
  providers: [
    { provide: TRANSLATION_MODULE_NAME, useValue: 'creator' }
  ]
})
export class ModeratorModule {
}
