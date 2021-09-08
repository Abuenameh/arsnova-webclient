import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommentPageComponent } from './comment-page.component';
import { Injectable, Renderer2, Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/util/notification.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { EventService } from '../../../services/util/event.service';
import { ClientAuthentication } from '../../../models/client-authentication';
import { GlobalStorageService } from '../../../services/util/global-storage.service';
import { AnnounceService } from '../../../services/util/announce.service';
import { CommentService } from '../../../services/http/comment.service';
import { HotkeyService } from '../../../services/util/hotkey.service';

const TRANSLATION_DE = require('../../../../assets/i18n/home/de.json');
const TRANSLATION_EN = require('../../../../assets/i18n/home/en.json');

const TRANSLATIONS = {
  DE: TRANSLATION_DE,
  EN: TRANSLATION_EN
};

class JsonTranslationLoader implements TranslateLoader {
  getTranslation(code: string = ''): Observable<object> {
    if (code !== null) {
      const uppercased = code.toUpperCase();

      return of(TRANSLATIONS[uppercased]);
    } else {
      return of({});
    }
  }

  public get(key: string): Observable<String> {
    return of(key);
  }
}

@Injectable()
class MockNotificationService {

}

@Injectable()
class MockCommentService {

}

@Injectable()
class MockAuthenticationService {
  getCurrentAuthentication() {
    return of(null);
  }
}

@Injectable()
class MockEventService {
  makeFocusOnInputFalse() {
  }
}

@Injectable()
class MockAnnouncer {

}

@Injectable()
class MockRenderer2 {

}

@Injectable()
class MockGlobalStorageService {
  getItem(key: symbol) {
    return undefined;
  }

  setItem(key: symbol, value: any) {
  }

  removeItem(key: symbol) {
  }
}

@Injectable()
class MockHotkeyService {
  registerHotkey() { }
}

@Component({ selector: 'app-comment-list', template: '' })
class CommentListStubComponent {
  @Input() auth: ClientAuthentication;
  @Input() roomId: String;
}

describe('CommentPageComponent', () => {
  let component: CommentPageComponent;
  let fixture: ComponentFixture<CommentPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommentPageComponent,
        CommentListStubComponent
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: JsonTranslationLoader
          },
          isolate: true
        })
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
            data: of()
          },
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService
        },
        {
          provide: CommentService,
          useClass: MockCommentService
        },
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService
        },
        {
          provide: EventService,
          useClass: MockEventService
        },
        {
          provide: AnnounceService,
          useClass: MockAnnouncer
        },
        {
          provide: Renderer2,
          useClass: MockRenderer2
        },
        {
          provide: GlobalStorageService,
          useClass: MockGlobalStorageService
        },
        {
          provide: HotkeyService,
          useClass: MockHotkeyService
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CommentPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
