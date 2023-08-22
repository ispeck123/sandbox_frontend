import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClassUiChangerService {

  public href: string = "";
  routeCheck:boolean = false;
  url:string = '';

  constructor(private router: Router) { }

  setClassUi(){
    this.href = this.router.url;

    localStorage.setItem('urlForClass', this.href);
    // if(this.href != '/project-create'){
    //   this.router.navigate(['/model-class']);
    // }
  }
  getClassUi(){
    this.url = localStorage.getItem('urlForClass')!;
    console.log(this.url)
    if((this.url === '/model-create') || (this.url === '/model-verify')) {
      this.routeCheck = true;
    } else {
      this.routeCheck = false;
    }
      return this.routeCheck;
  }
}
