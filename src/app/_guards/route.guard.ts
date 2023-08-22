import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/login_authorization.service';
import { RouteAuthorizationService } from '../services/route-authorization.service';

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate, CanActivateChild {
  authorizationService: any;

  constructor(private auth: AuthService, private router: Router, private routeAuth: RouteAuthorizationService) { }
  token: string = '';
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("Activated Route:: ", next);
    const allowedRoles = next.data['allowedPermission'];
    const isAuthorized = this.routeAuth.isAuthorized(allowedRoles);
    console.log("\n\n ALlowed Roles:: -------->>>>", allowedRoles);
    if (!(this.auth.authVerify() && isAuthorized)) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  canActivateChild( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("Activated Route:: ", next);
    const allowedRoles = next.data['allowedPermission'];
    console.log("Allowed Roles:: ", allowedRoles);
    const isAuthorized = this.routeAuth.isAuthorized(allowedRoles);
    console.log("is Authorized:: ", isAuthorized);

    if (!isAuthorized) {
      console.log('accessdenied');
      alert('Access denied contact admin for further query ............');
    }
    return isAuthorized;

  }
}


