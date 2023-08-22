import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetailsConfig } from 'src/app/data-models/user.model';
import { PasswordService } from 'src/app/services/password.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { PassStrengthValidator } from '../pass-validation';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  id:string='';
  auth:string='';
  email:string='';
  username:string='';
  userDetailsData!: UserDetailsConfig;
  constructor(private route: ActivatedRoute, private userData: UserDataService, private passService: PasswordService, private router: Router) {
     this.id = this.route.snapshot.params['id'];
     this.auth = this.route.snapshot.params['auth'];
     console.log(this.id, this.auth)
  }

  ngOnInit(): void {
    // this.getUserDetails(this.id)
  }

  // getUserDetails(userid: string) {
  //   let token:string = ''
  //   this.userData
  //     .userDetailsById('userDetails', userid, token)
  //     .subscribe((resp) => {
  //       console.log(resp)
  //       this.userDetailsData = resp;

  //       this.email = this.userDetailsData.data[0].USER_EMAIL;
  //       this.username = this.userDetailsData.data[0].USER_NAME;
  //     });
  // }

  resetPass = new FormGroup({
    NewPassword   : new FormControl('',[Validators.minLength(8), Validators.maxLength(32), PassStrengthValidator()]),
    conf_password : new FormControl(''),
   // gmail         : new FormControl(''),
    token         : new FormControl('')
  })

  resetPassword(){
     this.resetPass.patchValue({
     // gmail: this.email,
      token: this.auth
     });

    this.passService.savePassword('saveResetPassword', this.resetPass.value)
    .subscribe((respArray:any) =>{
      if(respArray.message == 'Password changed successfully'){
        alert(respArray.message);
        setTimeout(()=>{
          this.router.navigate(['/login'])
        },200);
      }
    })

  }

}
