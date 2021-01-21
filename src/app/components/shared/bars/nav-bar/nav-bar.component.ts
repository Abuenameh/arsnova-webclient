import { Component, OnInit } from '@angular/core';
import { BarBaseComponent, BarItem } from '../bar-base';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingService } from '../../../../services/util/routing.service';
import { GlobalStorageService, STORAGE_KEYS } from '../../../../services/util/global-storage.service';
import { UserRole } from '../../../../models/user-roles.enum';

export class NavBarItem extends BarItem {

  url: string;
  news: boolean;

  constructor(name: string, icon: string, url: string, news: boolean) {
    super(name, icon);
    this.url = url;
    this.news = news;
  }
}

export enum FEATURES {
  COMMENTS = 'comments',
  GROUP = 'group',
  SURVEY = 'survey',
  MODERATION = 'moderation'
}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent extends BarBaseComponent implements OnInit {

  barItems: NavBarItem[] = [];
  features: BarItem[] = [
    new BarItem(FEATURES.COMMENTS, 'question_answer'),
    new BarItem(FEATURES.GROUP, 'equalizer'),
    new BarItem(FEATURES.SURVEY, 'thumbs_up_down'),
    new BarItem(FEATURES.MODERATION, 'gavel')
  ];
  currentRouteIndex: number;
  isActive = true;
  activeFeatures: string[] = [FEATURES.COMMENTS];
  tooFewFeatures = false;

  constructor(private router: Router,
              private routingService: RoutingService,
              private route: ActivatedRoute,
              private globalStorageService: GlobalStorageService) {
    super();
  }

  initItems() {
    this.route.data.subscribe(data => {
      if (!data.room.settings['feedbackLocked']) {
        this.activeFeatures.push(FEATURES.SURVEY);
      }
      let group = this.globalStorageService.getItem(STORAGE_KEYS.LAST_GROUP);
      if (group) {
        this.activeFeatures.push(FEATURES.GROUP);
      }
      this.getItems(group, data.viewRole, data.room.shortId);
    });
  }

  getItems(group: string, role: UserRole, shortId: string) {
    for (const feature of this.features) {
      let url = `/${this.routingService.getRoleString(role)}/room/${shortId}/`;
      if (feature.name !== FEATURES.MODERATION) {
        url += feature.name;
        if (group && feature.name === FEATURES.GROUP) {
          url += this.getQuestionUrl(role, group);
        }
      } else {
        url += 'moderator/comments';
      }
      if ((this.activeFeatures.indexOf(feature.name) > -1 || (feature.name === FEATURES.SURVEY && role === UserRole.CREATOR))
          && role !== UserRole.EXECUTIVE_MODERATOR || (role === UserRole.EXECUTIVE_MODERATOR
          && (feature.name === FEATURES.MODERATION || feature.name === FEATURES.COMMENTS))) {
        this.barItems.push(
          new NavBarItem(
            feature.name,
            feature.icon,
            url,
            false));
      }
    }
    if (this.barItems.length > 1) {
      this.currentRouteIndex = this.barItems.map(s => s.url).indexOf(this.barItems.filter(s => this.router.url.includes(s.url))[0].url);
      setTimeout(() => {
        this.toggleVisibility(false);
      }, 500);
    } else {
      this.tooFewFeatures = true;
    }
  }

  getQuestionUrl(role: UserRole, group: string): string {
    let url =  '/' + group;
    if (role === UserRole.CREATOR) {
      url += '/statistics';
    }
    return url;
  }

  navToUrl(index: number) {
    const url = this.barItems[index].url;
    if (url) {
      this.router.navigate([url]);
    }
  }

  toggleVisibility(active: boolean) {
    const timeout = active ? 0 : 500;
    setTimeout(() => {
      this.isActive = active;
    }, timeout);
  }
}
