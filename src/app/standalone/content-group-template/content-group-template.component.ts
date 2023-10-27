import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentGroupTemplate } from '@app/core/models/content-group-template';
import { CoreModule } from '@app/core/core.module';
import { LICENSES } from '@app/core/models/licenses';
import { MatCardAppearance } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [CommonModule, CoreModule],
  selector: 'app-content-group-template',
  templateUrl: './content-group-template.component.html',
  styleUrls: ['./content-group-template.component.scss'],
})
export class ContentGroupTemplateComponent {
  @Input() template: ContentGroupTemplate;
  @Input() appearance: MatCardAppearance = 'raised';
  @Output() templateSelected = new EventEmitter<string>();
  LICENSES = LICENSES;

  use() {
    this.templateSelected.emit(this.template.id);
  }
}