import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomOverviewRoutingModule } from './room-overview-routing.module';
import { RoomActionButtonComponent } from '@app/standalone/room-action-button/room-action-button.component';
import { RoomOverviewPageComponent } from '@app/creator/room-overview/room-overview-page.component';
import { CoreModule } from '@app/core/core.module';
import { DividerComponent } from '@app/standalone/divider/divider.component';
import { RoomOverviewHeaderComponent } from '@app/standalone/room-overview-header/room-overview-header.component';
import { ContentGroupsComponent } from '@app/standalone/content-groups/content-groups.component';

@NgModule({
  declarations: [RoomOverviewPageComponent],
  imports: [
    CommonModule,
    RoomOverviewRoutingModule,
    CoreModule,
    RoomOverviewHeaderComponent,
    RoomActionButtonComponent,
    DividerComponent,
    ContentGroupsComponent,
  ],
})
export class RoomOverviewModule {}
