import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { themes, themes_meta } from './themes.const';
import { Theme } from './Theme';
import { GlobalStorageService, STORAGE_KEYS } from '../app/services/util/global-storage.service';

@Injectable()
export class ThemeService {
  private themeName: string;
  private activeTheme = new BehaviorSubject(null);
  private themes: Theme[] = [];
  private barColors = ['blue', 'yellow', 'teal', 'red', 'purple', 'brown', 'green', 'pink'];

  constructor(private globalStorageService: GlobalStorageService) {
    let currentTheme = this.globalStorageService.getItem(STORAGE_KEYS.THEME);
    if (!currentTheme) {
      currentTheme = 'arsnova';
    }
    this.themeName = currentTheme;
    this.activate(this.themeName);
    // eslint-disable-next-line guard-for-in
    for (const k in themes) {
      this.themes.push(new Theme(
        k,
        themes[k],
        themes_meta[k])
      );
    }
    this.themes.sort((a, b) => {
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      }
      return 0;
    });
  }

  public getTheme() {
    return this.activeTheme.asObservable();
  }

  public activate(name) {
    this.activeTheme.next(name);
    this.themeName = name;
    this.globalStorageService.setItem(STORAGE_KEYS.THEME, name);
  }

  public getThemes(): Theme[] {
    return this.themes;
  }

  public getThemeByKey(key: string): Theme {
    for (let i = 0; i < this.themes.length; i++) {
      if (this.themes[i].key === key) {
        return this.themes[i];
      }
    }
    return null;
  }

  getColorArray(names: string[]) {
    const currentTheme = this.getThemeByKey(this.themeName);
    return names.map(c => currentTheme.get('color-' + c));
  }

  public getBarColors() {
    return this.getColorArray(this.barColors);
  }

}
