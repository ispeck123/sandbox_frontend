import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login-config/login/login.component';
import { AuthService } from './services/login_authorization.service';
import { RouteGuard } from './_guards/route.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './services/material/material.module';
import { LoginSelectionComponent } from './login-config/login-selection/login-selection.component';
import { RegisterComponent } from './login-config/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainlayoutComponent } from './layout/mainlayout/mainlayout.component';
import { FeatureModule } from './feature_modules/feature.module';
import { LandingPageComponent } from './layout/landing-page-layout/landing-page/landing-page.component';
import { UserManagementModule } from './user_management_module/user-management.module';
import { SharedModule } from './shared_module/shared-module.module';
import { ForgotPasswordComponent } from './login-config/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login-config/reset-password/reset-password.component';
import { PassValidationDirective } from './directives/pass-validation.directive';
import { UserSpModule } from './user_settings_profile/user-sp.module';
import { LoaderComponent } from './loader/loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginSelectionComponent,
    RegisterComponent,
    MainlayoutComponent,
    LandingPageComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PassValidationDirective,
    LoaderComponent,
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserManagementModule,
    FeatureModule,
    SharedModule,
    UserSpModule,
    NgxSpinnerModule, 
    
   ],
  providers: [AuthService, RouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
