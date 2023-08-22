import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-selection',
  templateUrl: './login-selection.component.html',
  styleUrls: ['./login-selection.component.css']
})
export class LoginSelectionComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  Login(){
    this.router.navigate(['login']);
  }
  Register(){
    this.router.navigate(['register']);
  }
}
