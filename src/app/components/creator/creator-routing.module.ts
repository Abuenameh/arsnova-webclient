import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { UserRole } from '../../models/user-roles.enum';
import { RoomCreatorPageComponent } from './room-creator-page/room-creator-page.component';
import { ContentCreatePageComponent } from './content-create-page/content-create-page.component';
import { StatisticsPageComponent } from '../shared/statistics-page/statistics-page.component';
import { SurveyPageComponent } from '../shared/survey-page/survey-page.component';
import { StatisticComponent } from '../shared/statistic/statistic.component';
import { ContentPresentationComponent } from './content-presentation/content-presentation.component';
import { CommentPageComponent } from '../shared/comment-page/comment-page.component';
import { CommentAnswerComponent } from '../shared/comment-answer/comment-answer.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { RoomResolver } from '../../resolver/room.resolver';
import { CommentResolver } from '../../resolver/comment.resolver';
import { LooseContentComponent } from './loose-content/loose-content.component';
import { GroupContentComponent } from './group-content/group-content.component';

const routes: Routes = [
  {
    path: 'room/:shortId',
    component: RoomCreatorPageComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/settings',
    component: SettingsPageComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/create-content',
    component: ContentCreatePageComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/statistics',
    component: StatisticsPageComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/group/:contentGroup/statistics',
    component: StatisticComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/group/:contentGroup/statistics/:index',
    component: StatisticComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/comments',
    component: CommentPageComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/comment/:commentId',
    component: CommentAnswerComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      comment: CommentResolver
    }
  },
  {
    path: 'room/:shortId/survey',
    component: SurveyPageComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/group/:contentGroup',
    component: GroupContentComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/loosecontent',
    component: LooseContentComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  },
  {
    path: 'room/:shortId/group/:contentGroup/presentation',
    component: ContentPresentationComponent,
    canActivate: [AuthenticationGuard],
    data: { roles: [UserRole.CREATOR] },
    resolve : {
      room: RoomResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CreatorRoutingModule {
}
