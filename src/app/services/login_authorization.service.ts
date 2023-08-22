import { Injectable } from '@angular/core';
import { LoginRegister } from './login_register_data.service';
import { Router } from '@angular/router';
import { UserDataService } from './user-data.service';
import {
  UserDetailsConfig,
  UserDetailsData,
  UserPermByRoleConfig,
  UserPermRoleData,
} from '../data-models/user.model';


@Injectable()
export class AuthService {
  private isloggedIn!: boolean;
  token: string | null = '';
  status_Code!: number;
  userid!: number;
  userPermList!: UserPermByRoleConfig;
  userDetailsData!: UserDetailsConfig;
  constructor(
    private login_register: LoginRegister,
    private router: Router,
    private userData: UserDataService
  ) {
    this.isloggedIn = false;
  }

  public authHelper(payload: object): boolean {
    console.log(payload);
    this.login_register.loginData('login', payload).subscribe(
      (resp) => {
        console.log("login success:",resp)
        const message = resp.message;
        if (message == 'Success') {
          this.token = resp.data.accessToken;
          this.userid = resp.data.userid;

          localStorage.setItem('tk', this.token);
          localStorage.setItem('user_id', this.userid.toString());
          this.getUserDetails(this.userid);
          // console.log("user details",this.getUserDetails(this.userid))

          //  this.router.navigate(['/home']);
        } else {
          alert(message);
          return;
        }
      },
      (error) => {
        alert('Please check your username and password');
      }
    );
    return this.isloggedIn;
  }

  public authVerify(): boolean {
    this.token = localStorage.getItem('tk');
    if (this.token === null) {
      this.isloggedIn = false;
      return this.isloggedIn;
    }
    this.isloggedIn = true;
    return this.isloggedIn;
  }

  getUserDetails(userid: number) {
    //console.log('entered')
    //console.log(userid)
    this.userData
      .userDetailsById('userDetails', userid, this.token!)
      .subscribe((resp) => {
        this.userDetailsData = resp;

        const role_id = this.userDetailsData.data[0].USER_ROLE_ID;
        const username = this.userDetailsData.data[0].USER_NAME;
        localStorage.setItem('uid', username);
        console.log(resp);

        this.getUserPermission(role_id);
      });
  }

  getUserPermission(uid: number) {
    this.userData
      .userPermissionByRoleId('permissionDetailsByRoleid', uid, this.token!)
      .subscribe((resp) => {
        this.userPermList = resp;
        let userPermData: (string | number)[] = [];
        this.userPermList.data.forEach((data) => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              if (key == 'PERMISSION_NAME') {
                //console.log(key)
                userPermData.push(data[key as keyof UserPermRoleData]);
              }
            }
          }
        });
        console.log(userPermData);
        const dataPerm = JSON.stringify(userPermData);
        console.log(resp);
        localStorage.setItem('perm', dataPerm);
        //  alert('signed in');

        this.router.navigate(['/home']);
      });
  }
}
