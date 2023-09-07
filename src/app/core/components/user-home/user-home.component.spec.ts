import { Injectable, Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getTranslocoModule } from '@testing/transloco-testing.module';
import { of } from 'rxjs';
import { UserHomeComponent } from './user-home.component';

import { AuthenticationService } from '@app/core/services/http/authentication.service';
import { ClientAuthentication } from '@app/core/models/client-authentication';
import { A11yIntroPipe } from '@app/core/pipes/a11y-intro.pipe';

@Injectable()
class MockAuthenticationService {
  getCurrentAuthentication() {
    return of(null);
  }
}

@Component({ selector: 'app-room-list', template: '' })
class RoomListStubComponent {
  @Input() auth: ClientAuthentication;
}

/* eslint-disable @angular-eslint/component-selector */
@Component({ selector: 'mat-icon', template: '' })
class MatIconStubComponent {}
/* eslint-enable @angular-eslint/component-selector */

describe('UserHomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserHomeComponent,
        RoomListStubComponent,
        MatIconStubComponent,
        A11yIntroPipe,
      ],
      imports: [getTranslocoModule()],
      providers: [
        {
          provide: AuthenticationService,
          useClass: MockAuthenticationService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UserHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
