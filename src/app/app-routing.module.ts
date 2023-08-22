import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSelectionComponent } from './login-config/login-selection/login-selection.component';
import { LoginComponent } from './login-config/login/login.component';
import { RegisterComponent } from './login-config/register/register.component';
import { RouteGuard } from './_guards/route.guard';
import { LandingPageComponent } from './layout/landing-page-layout/landing-page/landing-page.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ForgotPasswordComponent } from './login-config/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './login-config/reset-password/reset-password.component';
import { PassLinkGuard } from './_guards/pass-link.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'',
    loadChildren: () => import('./feature_modules/feature.module').then(m => m.FeatureModule),
    canActivate:[RouteGuard]
  },

  // {
  //   path: 'login-selection',
  //   component: LoginSelectionComponent
  // },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset_password/:id/:auth',
    component: ResetPasswordComponent,
    canActivate:[PassLinkGuard]
  },
  {
    path: 'accessdenied',
    component: AccessDeniedComponent,
    data: {}
  },
  {
    path:'user-management',
    loadChildren: () => import('./user_management_module/user-management.module').then(m => m.UserManagementModule),
    canActivate:[RouteGuard]
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
