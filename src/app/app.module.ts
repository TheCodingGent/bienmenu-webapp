import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AgmCoreModule } from '@agm/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { AddRestaurantComponent } from './components/add-restaurant/add-restaurant.component';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { UpdateMenuComponent } from './components/update-menu/update-menu.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminBoardComponent } from './components/admin-board/admin-board.component';
import { UserBoardComponent } from './components/user-board/user-board.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { RequestResetPasswordComponent } from './components/request-reset-password/request-reset-password.component';
import { QrCodeViewerComponent } from './components/qr-code-viewer/qr-code-viewer.component';
import { AppConfigService } from './services/app-config.service';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { AddressAutocompleteComponent } from './components/address-autocomplete/address-autocomplete.component';
import { QrcodeCardSvgComponent } from './components/qrcode-card-svg/qrcode-card-svg.component';
import { ContactTracingComponent } from './components/contact-tracing/contact-tracing.component';
import { SuccessComponent } from './components/success/success.component';
import { CancelComponent } from './components/cancel/cancel.component';
import { PricingPlansComponent } from './components/pricing-plans/pricing-plans.component';
import { CreateMenuComponent } from './components/create-menu/create-menu.component';
import { FoodItemManagerComponent } from './components/food-item-manager/food-item-manager.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MenuSectionComponent } from './components/menu-section/menu-section.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    RestaurantDetailComponent,
    AddRestaurantComponent,
    AddMenuComponent,
    UpdateMenuComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AdminBoardComponent,
    UserBoardComponent,
    ResetPasswordComponent,
    MenuListComponent,
    RequestResetPasswordComponent,
    QrCodeViewerComponent,
    MainNavbarComponent,
    AddressAutocompleteComponent,
    QrcodeCardSvgComponent,
    ContactTracingComponent,
    SuccessComponent,
    CancelComponent,
    PricingPlansComponent,
    CreateMenuComponent,
    FoodItemManagerComponent,
    MenuSectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    QRCodeModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    PdfViewerModule,
    RxReactiveFormsModule,
    ColorPickerModule,
    DragDropModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5OKLO-8r7Jy-SJszBQww_g7ci6n_jMGc',
      libraries: ['places'],
    }),
  ],
  providers: [
    authInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
