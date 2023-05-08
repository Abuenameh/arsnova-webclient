import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonTranslationLoader } from '@testing/test-helpers';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SettingsSlideToggleComponent } from './settings-slide-toggle.component';

describe('SettingsSlideToggleComponent', () => {
  let component: SettingsSlideToggleComponent;
  let fixture: ComponentFixture<SettingsSlideToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SettingsSlideToggleComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: JsonTranslationLoader,
          },
          isolate: true,
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSlideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});