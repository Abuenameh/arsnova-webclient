import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { UserRole } from '../../models/user-roles.enum';
import { RoomModeratorPageComponent } from './room-moderator-page/room-moderator-page.component';
import { CommentPageComponent } from '../shared/comment-page/comment-page.component';
import { ModeratorCommentPageComponent } from './moderator-comment-page/moderator-comment-page.component';
import { CommentAnswerComponent } from '../shared/comment-answer/comment-answer.component';
import { RoomResolver } from '../../resolver/room.resolver';
import { CommentResolver } from '../../resolver/comment.resolver';
import { RoomViewUserRoleResolver } from '../../resolver/room-view-user-role.resolver';
import { RoomUserRoleResolver } from '../../resolver/room-user-role.resolver';

const routes: Routes = [
  {
    path: 'room/:shortId',
    canActivate: [AuthenticationGuard],
    data: { requiredRole: UserRole.EXECUTIVE_MODERATOR },
    resolve: {
      room: RoomResolver,
      viewRole: RoomViewUserRoleResolver
    },
    children: [
      {
        path: '',
        component: RoomModeratorPageComponent,
        resolve: {
          userRole: RoomUserRoleResolver
        }
      },
      {
        path: 'comments',
        component: CommentPageComponent
      },
      {
        path: 'moderator/comments',
        component: ModeratorCommentPageComponent
      },
      {
        path: 'comment/:commentId',
        component: CommentAnswerComponent,
        resolve: {
          comment: CommentResolver
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeratorRoutingModule {
}
