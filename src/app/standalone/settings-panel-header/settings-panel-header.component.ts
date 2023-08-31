import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatIconModule,
    MatExpansionModule,
    FlexModule,
  ],
  selector: 'app-settings-panel-header',
  templateUrl: './settings-panel-header.component.html',
  styleUrls: ['./settings-panel-header.component.scss'],
})
export class SettingsPanelHeaderComponent {
  @Input() text: string;
  @Input() icon: string;
}
