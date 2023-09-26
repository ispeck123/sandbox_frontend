import { Component, OnInit,OnDestroy, ElementRef, TemplateRef, Renderer2 } from '@angular/core';
import { UserDetailsConfig } from 'src/app/data-models/user.model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import {Subscription} from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';




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
  USERNAME:any;
  EMAIL:any;
  ngEmail:any;
  

  token:string='';
  EMAILChangedSuccessfully: boolean=false;
  modal: any;
 
    constructor( private userData: UserDataService, private getToken: GetTokenService,
    private graphService : GraphService,public audit: AuditTrailService,private fb: FormBuilder

      ) {
        // this.EMAIL = this.fb.group({
        //   EMAIL: ['', [Validators.required, Validators.email]],
        // });
       }

  ngOnInit(): void {
    this.getUserDetails();
 
    this.initializeChangePasswordForm();

   
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
        console.log("User data",this.temp)
        this.USERNAME=this.temp.USER_NAME
        this.EMAIL=this.temp.USER_EMAIL
        const inputElement = document.getElementById("UserNameFromTs") as HTMLInputElement;
        const inputElements = document.getElementById("UserEmailFromTs") as HTMLInputElement;
      
        inputElement.value = this.USERNAME;
        inputElements.value=this.EMAIL;

        this.graphService.showLoader=false;
      });
  }

  updateEmail(event: Event) {
  
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    this.EMAIL = newValue;
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

  saveEmail(){
 
    let userid:number = this.getToken.getUser_id();

    const payload = {
      // EMAIL: this.EMAIL.value,
      Email: this.ngEmail
    };
    this._apiSubscription=this.userData
  .userUpdate("userUpdate",payload,userid)
  .subscribe((resp) => {
    this.EMAILChangedSuccessfully = true;
    alert("EMAIL Changed Successfully")
    this.errorMsg = null;
    console.log('Response:', resp);
    
        });
  }

  close() {
    // this.dialogRef.close();
  }
}

