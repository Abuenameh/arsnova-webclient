import { Directive, ElementRef, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { themes } from './themes.const';
import { ThemeService } from './theme.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appTheme]'
})

export class ThemeDirective implements OnInit, OnDestroy {

  private themeName = 'arsnova';
  private themServiceSubscription: Subscription;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: any,
              private themService: ThemeService) {
  }

  ngOnInit() {
    this.updateTheme(this.themeName);
    this.themService.getTheme()
      .subscribe(themeName => {
        this.themeName = themeName;
        this.updateTheme(this.themeName);
      });
  }

  updateTheme(themeName: string) {
    const them = themes[themeName];
    for (const key in them) {
      if (Object.prototype.hasOwnProperty.call(them, key)) {
        this.renderer.setProperty(this.elementRef.nativeElement, key, them[key]);
        this.document.body.style.setProperty(key, them[key]);
      }
    }
  }

  ngOnDestroy() {
    if (this.themServiceSubscription) {
      this.themServiceSubscription.unsubscribe();
    }
  }
}
