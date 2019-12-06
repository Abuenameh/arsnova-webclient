import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRole } from '../../models/user-roles.enum';
import { RoomParticipantPageComponent } from './room-participant-page/room-participant-page.component';
import { FeedbackBarometerPageComponent } from '../shared/feedback-barometer-page/feedback-barometer-page.component';
import { ParticipantContentCarouselPageComponent } from './participant-content-carousel-page/participant-content-carousel-page.component';
import { StatisticsPageComponent } from '../shared/statistics-page/statistics-page.component';
import { StatisticComponent } from '../shared/statistic/statistic.component';
import { CommentPageComponent } from '../shared/comment-page/comment-page.component';

const routes: Routes = [
  {
    path: 'room/:shortId',
    component: RoomParticipantPageComponent,
    data: { roles: [UserRole.PARTICIPANT] }
  },
  {
    path: 'room/:shortId/statistics',
    component: StatisticsPageComponent,
    data: { roles: [UserRole.PARTICIPANT] }
  },
  {
    path: 'room/:shortId/statistics/:contentId',
    component: StatisticComponent,
    data: { roles: [UserRole.PARTICIPANT] }
  },
  {
    path: 'room/:shortId/comments',
    component: CommentPageComponent,
    data: { roles: [UserRole.PARTICIPANT] }
  },
  {
    path: 'room/:shortId/feedback-barometer',
    component: FeedbackBarometerPageComponent,
    data: { roles: [UserRole.PARTICIPANT] }
  },
  {
    path: 'room/:shortId/:contentGroup',
    component: ParticipantContentCarouselPageComponent,
    data: { roles: [UserRole.PARTICIPANT] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantRoutingModule { }
