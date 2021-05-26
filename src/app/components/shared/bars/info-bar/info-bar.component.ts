import { Component, Input, OnInit } from '@angular/core';
import { BarBaseComponent, BarItem } from '../bar-base';

export class InfoBarItem extends BarItem {

  count;

  constructor(name: string, icon: string, count: any) {
    super(name, icon);
    this.count = count;
  }
}

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent extends BarBaseComponent implements OnInit {

  @Input() barItems: InfoBarItem[] = [];
  @Input() mode = 'badge';

  constructor() {
    super();
  }
}
