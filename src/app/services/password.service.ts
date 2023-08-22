import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json'

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  Api_Path: string = '';
  authorization: string = '';
  isPassLink:boolean = false;
  constructor(private http: HttpClient, private getToken: GetTokenService) {
    this.Api_Path = servicedata.api_url;
  }

  sendPassResetLink(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(
      `${this.Api_Path}/${url}`,
      payload

    );
  }

verifyPassLink(linkCode: string | undefined) {
  let payload:[] = [];
    let isbool: boolean =false;
    let url:string = 'check_token/'+linkCode;
    console.log(url);
  return this.http.post(`${this.Api_Path}/${url}`, payload);

  }

  savePassword(url:string, payload:object){
    return this.http.post(`${this.Api_Path}/${url}`, payload);
  }



}
