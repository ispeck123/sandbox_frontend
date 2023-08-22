import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PasswordService } from '../services/password.service';

@Injectable({
  providedIn: 'root'
})
export class PassLinkGuard implements CanActivate {
  auth: string = '';
  bool: boolean = false;
  constructor(private passService: PasswordService, private router: Router) {}
 canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const promise = new Promise<boolean>((resolve, reject) =>{
        this.passService.verifyPassLink((route.paramMap.get('auth')!))
        .subscribe((respArray: any) => {
          if (respArray.message == 'Success')
            this.bool = true;
          else{
            this.bool = false;
            alert(respArray.message);
            this.router.navigate(['/']);
          }
           resolve(this.bool);
        })
      })
      console.log("code", );
   return promise;

  }

}
