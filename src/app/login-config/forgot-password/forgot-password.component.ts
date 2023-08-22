import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css',
               '../login/login.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private resetPassService : PasswordService) { }

  ngOnInit(): void {
  }

  resetPass = new FormGroup({
    Email : new FormControl('')
  })

  resetPassLink(){
    console.log(this.resetPass.value)
    this.resetPassService.sendPassResetLink('resetPassword', this.resetPass.value)
    .subscribe(
      (respArray : any) => {
        alert(respArray.message);
      }
    )
  }

}
