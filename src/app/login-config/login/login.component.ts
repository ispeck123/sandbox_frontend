import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/login_authorization.service';
import { GraphService } from 'src/app/services/graph.service';
import { GlobalService } from 'src/app/services/global.service';


export interface CheckboxColor {
  color: ThemePalette;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authservice: AuthService,
   private graphService : GraphService,private globalservice:GlobalService
    
    ) { }

  ngOnInit(): void {

  }


  hide:boolean = true;
  data: [] = [];

  loginForm = new FormGroup({

     UserName      : new FormControl(''),
     Password      : new FormControl(''),

  })


  public checkboxcolor: CheckboxColor = {

      color: 'primary'
  }

  public hideEye(e:Event) {

       e.preventDefault();
       this.hide = !this.hide;

 }

 onSubmit() {
  this.graphService.showLoader=true;
  this.data = this.loginForm.value;
  this.authservice.authHelper(this.data);
  this.graphService.showLoader=false;
 

}



}
