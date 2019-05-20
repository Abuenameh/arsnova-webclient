import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/home/_dialogs/register/register.component';
import { PasswordResetComponent } from './components/home/_dialogs/password-reset/password-reset.component';
import { AppRoutingModule } from './app-routing.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserService } from './services/http/user.service';
import { NotificationService } from './services/util/notification.service';
import { AuthenticationService } from './services/http/authentication.service';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RoomService } from './services/http/room.service';
import { CommentService } from './services/http/comment.service';
import { DataStoreService } from './services/util/data-store.service';
import { ContentService } from './services/http/content.service';
import { ContentAnswerService } from './services/http/content-answer.service';
import { WsConnectorService } from './services/websockets/ws-connector.service';
import { UserActivationComponent } from './components/home/_dialogs/user-activation/user-activation.component';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { EssentialsModule } from './components/essentials/essentials.module';
import { SharedModule } from './components/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageService } from './services/util/language.service';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { NewLandingComponent } from './components/home/new-landing/new-landing.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { AppConfig } from './app.config';
import { ThemeModule } from '../theme/theme.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function dialogClose(dialogResult: any) {
}

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    PasswordResetComponent,
    RegisterComponent,
    UserActivationComponent,
    NewLandingComponent,
    HomePageComponent
  ],
  entryComponents: [
    RegisterComponent,
    PasswordResetComponent,
    UserActivationComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    EssentialsModule,
    SharedModule,
    ThemeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    WsConnectorService,
    NotificationService,
    AuthenticationService,
    AuthenticationGuard,
    DataStoreService,
    RoomService,
    CommentService,
    ContentService,
    ContentAnswerService,
    LanguageService,
    MarkdownService,
    MarkedOptions,
    UserService,
    WsConnectorService,
    {
      provide: MatDialogRef,
      useValue: {
        dialogClose
      }
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: []
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
