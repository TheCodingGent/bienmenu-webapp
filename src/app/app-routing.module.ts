import { NgModule, InjectionToken } from '@angular/core';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  UrlSegment,
} from '@angular/router';

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
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { PricingPlansComponent } from './components/pricing-plans/pricing-plans.component';
import { ContactTracingHomeComponent } from './components/contact-tracing-home/contact-tracing-home.component';
import { BusinessPortalHomeComponent } from './components/business-portal-home/business-portal-home.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  { path: 'home', component: HomeComponent },

  {
    path: 'pricing-plans',
    component: PricingPlansComponent,
  },
  {
    path: 'contact-tracing-home',
    component: ContactTracingHomeComponent,
  },
  { path: 'register', component: RegisterComponent },
  { path: 'success/:session_id', component: SuccessComponent },
  { path: 'cancel', component: CancelComponent },
  { path: 'login', component: LoginComponent },
  { path: 'request-reset-password', component: RequestResetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'admin', component: AdminBoardComponent },
  {
    path: 'qrcode/:id',
    component: QrCodeViewerComponent,
  },
  {
    path: 'detail/:id',
    component: RestaurantDetailComponent,
    canActivate: [AuthGuard],
  },

  { path: 'add', component: AddRestaurantComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserBoardComponent, canActivate: [AuthGuard] },
  { path: 'menu-list', component: MenuListComponent },
  { path: 'menus/:id', component: BusinessPortalHomeComponent },
  {
    matcher: (url) => {
      if (
        url.length === 1 &&
        url[0].path.match(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i) //tries to match a url that has a restaurant ID in it
      ) {
        return {
          consumed: url,
          posParams: {
            id: new UrlSegment(url[0].path, {}),
          },
        };
      }
      return null;
    },
    component: BusinessPortalHomeComponent,
  },
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
