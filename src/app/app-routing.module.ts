import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminBoardComponent } from './components/admin-board/admin-board.component';
import { UserBoardComponent } from './components/user-board/user-board.component';
import { AuthGuard } from './helpers/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { RequestResetPasswordComponent } from './components/request-reset-password/request-reset-password.component';
import { QrCodeViewerComponent } from './components/qr-code-viewer/qr-code-viewer.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'detail/:id',
    component: RestaurantDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'qrcode/:id',
    component: QrCodeViewerComponent,
  },
  { path: 'add', component: AddRestaurantComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  // { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminBoardComponent },
  { path: 'user', component: UserBoardComponent, canActivate: [AuthGuard] },
  { path: 'request-reset-password', component: RequestResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'menus/:id', component: MenuListComponent },
  { path: ':id', component: MenuListComponent },
  {
    path: 'externalRedirect',
    canActivate: [externalUrlProvider],
    component: PageNotFoundComponent, // dummy component
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.paramMap.get('externalUrl');
        window.open(externalUrl, '_self');
      },
    },
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
