import { TestBed, inject } from '@angular/core/testing';

import { RoutingService } from '@arsnova/app/services/util/routing.service';
import { MockLangService, MockRouter, MockTranslateService } from '@arsnova/testing/test-helpers';
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import { LanguageService } from '@arsnova/app/services/util/language.service';

describe('RoutingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoutingService,
        {
          provide: Router,
          useClass: MockRouter
        },
        {
          provide: Location,
          useClass: MockLocationStrategy
        },
        {
          provide: TranslateService,
          useClass: MockTranslateService
        },
        {
          provide: LanguageService,
          useClass: MockLangService
        }
      ]
    });
  });

  it('should be created', inject([RoutingService], (service: RoutingService) => {
    expect(service).toBeTruthy();
  }));
});
