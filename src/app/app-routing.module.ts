import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'detail/:id', component: RestaurantDetailComponent },
  { path: 'add', component: AddRestaurantComponent },
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
