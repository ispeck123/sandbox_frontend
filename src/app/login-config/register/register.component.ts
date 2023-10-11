import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { createPasswordStrengthValidator } from 'src/app/directives/pass-validation.directive';
import { PassStrengthValidator } from 'src/app/login-config/pass-validation';
import { LoginRegister } from 'src/app/services/login_register_data.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css',
    '../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private login_register: LoginRegister, private router: Router,private globalservice:GlobalService) { }
  status: string = '';
  ngOnInit(): void {
  }

  data: [] = [];
  hide: boolean = true;
  hideConf: boolean = true;
  isMatch: boolean = true;


  registerForm = new FormGroup({

    UserFullName: new FormControl('', [Validators.required]),
    Email: new FormControl('', [Validators.required, Validators.email]),
    UserName: new FormControl('', [Validators.required]),
    Password: new FormControl('', [Validators.required]),
    repeatpass: new FormControl('')


  })

  onSubmit() {
    this.data = this.registerForm.value;
    this.login_register.registerData('createUser', this.data)
      .subscribe(response => {
        console.log("response", response)
        if(response.message=="User created successfully")
        {
          this.globalservice.swalSuccess(response.message)
          this.router.navigateByUrl('/login');
        }
        if(response.message=="Username already exists")
        {
          this.globalservice.swalError(response.message)
          return;
        }
        if(response.message=="Account with this email id already exists")
        {
          this.globalservice.swalError(response.message)
          return;
        }
        
      });
    console.log(this.data);
  }

  public hideEye(e: Event) {

    e.preventDefault();
    this.hide = !this.hide;

  }
  public hideConfEye(e: Event) {

    e.preventDefault();
    this.hideConf = !this.hideConf;

  }


  // passwordMatch(e:Event){
  //   console.log(1);
  //    (this.password == (e.target as HTMLInputElement).value) ? this.isMatch = true : this.isMatch = false;
  // }


}
