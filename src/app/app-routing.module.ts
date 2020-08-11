import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { UserHomeComponent } from './components/home/user-home/user-home.component';
import { DirectEntryComponent } from './components/shared/direct-entry/direct-entry.component';
import { LoginComponent } from './components/home/login/login.component';
import { ImportComponent } from './components/home/import/import.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { RegisterComponent } from './components/home/register/register.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'user',
    canActivate: [AuthenticationGuard],
    component: UserHomeComponent
  },
  {
    path: 'join/:shortId',
    component: DirectEntryComponent
  },
  {
    path: 'import',
    component: ImportComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'creator',
    loadChildren: () => import('./components/creator/creator.module').then(m => m.CreatorModule)
  },
  {
    path: 'participant',
    loadChildren: () => import('./components/participant/participant.module').then(m => m.ParticipantModule)
  },
  {
    path: 'moderator',
    loadChildren: () => import('./components/moderator/moderator.module').then(m => m.ModeratorModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
