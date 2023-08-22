import { Component, OnInit,OnDestroy, ElementRef, TemplateRef, Renderer2 } from '@angular/core';
import { UserDetailsConfig } from 'src/app/data-models/user.model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import {Subscription} from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit,OnDestroy {
  // Reactive version of form #####################
  changePasswordForm!: FormGroup;
  canSubmitNow = false;
  showCurrentPassword = false;
  showNewPassword = false;

  // TD version of form ################# 
  userDetailsData!: UserDetailsConfig;
  temp: any = [];
  private _apiSubscription! : Subscription;
  passwordChangedSuccessfully: boolean = false;
  errorMsg!: string | null;

  token:string='';
    constructor( private userData: UserDataService, private getToken: GetTokenService,
    private graphService : GraphService,public audit: AuditTrailService

      ) { }

  ngOnInit(): void {
    this.initializeChangePasswordForm();

    this.getUserDetails();
    this.audit.addUrlAudit('userAuditLog');
  }

  getUserDetails() {
    this.graphService.showLoader=true;

    let userid:number = this.getToken.getUser_id();
    this.token = localStorage.getItem('tk')!;
    //console.log(userid)
    this._apiSubscription=this.userData
      .userDetailsById('userDetails', userid, this.token!)
      .subscribe((resp) => {
        this.userDetailsData = resp;
        this.temp = this.userDetailsData.data[0];
        // console.log("TEMP Data:: ", this.temp.USER_NAME);
        // const role_id = this.userDetailsData.data[0].USER_ROLE_ID;
        // const username = this.userDetailsData.data[0].USER_NAME;
        this.graphService.showLoader=false;
      });
  }

  initializeChangePasswordForm () {
    this.changePasswordForm = new FormGroup({
      'currentPassword': new FormControl(null, Validators.required), 
      'newPassword': new FormControl(null, [Validators.required])
    })
  }

  onFormSubmit() {
    console.log(this.changePasswordForm);
    console.log(this.changePasswordForm.get('currentPassword')?.valid);
    if (this.changePasswordForm.valid) {
      this.sendRequest();
      // this.canSubmitNow = false;
      this.errorMsg = null;
    } else {
      this.errorMsg = "validation error";
      console.log("some validation error still exists...");
    }

  }

  sendRequest () {
    const payload = {
      id: this.getToken.getUser_id(), 
      newPassword: this.changePasswordForm.controls['newPassword'].value,  
      oldPassword: this.changePasswordForm.controls['currentPassword'].value
    }
    this.userData.changePassword("changePassword", payload)
    .subscribe((res:Object) => {
        this.passwordChangedSuccessfully = true;
        this.errorMsg = null;
        console.log ("response::", res);

        let auditPayload = {
          id: this.getToken.getUser_id(), 
          Effect: "Password Changed Successfully",
          Type: "Password Change",  
          Status: 1
        }
        this.audit.addAudit("userAuditLog", auditPayload).subscribe((res) => {
          console.log("SERVER:: AUDIT:  ", res);
        }, (err) => {
          console.log("Audit Server: Error::", err);
        });
        
    }, err => {
      this.errorMsg = err.error.error;
      this.passwordChangedSuccessfully =false;
      console.log("error:::", err);
    
      let auditPayload = {
        Id: 1, 
        Effect: "Password Change Failed", 
        Type: "Password Change",  
        Status: 0
      }
      this.audit.addAudit("userAuditLog", auditPayload).subscribe((res) => {
        console.log("AUDIT::Server ", res);
      }, (err) => {
        console.log("Audit Server: Error::", err);
      });
      
    });

    

  }

  logger () {
    
  }

  onNewPasswordEyePatchClick() {
    this.showNewPassword = !this.showNewPassword;
  }

  onCurrentPasswordEyePatchClick () {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}

