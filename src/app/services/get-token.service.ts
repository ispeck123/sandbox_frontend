import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GetTokenService   {
  authorization!: string;
  userid!:string;
  apiData!:string;
  constructor(private http: HttpClient,private router: Router) {
  }

  getBaseUrl(id:string){
    return id;
}


  getLocalToken():HttpHeaders{
    this.authorization = localStorage.getItem('tk')!;
    console.log("get data---------------------",this.authorization)
  
    const header = new HttpHeaders()
    .set('authorization', this.authorization);
    console.log("set data--------------------------",header)
    if(!this.authorization){
      localStorage.removeItem("tk");
      localStorage.removeItem("uid");
      this.router.navigate(['/login']);
    }
    //else
    return header;
  }

  getJSONWebTokenString () {
    this.authorization = localStorage.getItem('tk')!;
    return this.authorization;
  }

  getUser_name():string{
    this.userid! = localStorage.getItem('uid')!;
    return this.userid;
  }

  getProjectType():string{
    const proTypeName = localStorage.getItem('proTypeName')!
    return proTypeName;
  }

  getUser_id():number{
    const user_id = parseInt(localStorage.getItem('user_id')!)
    // const project_id=parseInt(localStorage.getItem('pr_id')!)
    return user_id;

  }

  getPipelineId(){
    const pId = parseInt(localStorage.getItem('pid')!)
    return pId;
  }

  getModelId(){
    const mId = parseInt(localStorage.getItem('mid')!)
    return mId;
  }

  getProjectId(){
    const mId = parseInt(localStorage.getItem('pr_id')!)
    return mId;
  }




}
