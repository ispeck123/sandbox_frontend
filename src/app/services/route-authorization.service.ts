import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteAuthorizationService {
  token!: string;
  constructor() { }
  isAuthorized(allowedRoles: string[]): boolean {

    const permData = JSON.parse(localStorage.getItem('perm')!);

    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }

    var found = false;
     for(var i = 0; i <= permData.length; i++) {
       console.log('a',allowedRoles, 'p', permData[i])
       if ((allowedRoles.includes(permData[i])) || (permData[i] == 'All Accessible')) {
           found = true;
           break;
       }
       else {
         found = true;
       }
     }

     return found;
  }
}
