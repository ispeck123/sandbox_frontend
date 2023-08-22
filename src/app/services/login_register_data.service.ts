import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginReg } from '../data-models/user.model';
import servicedata from 'src/assets/service.json'


@Injectable({
  providedIn: 'root'
})
export class LoginRegister {

  readonly Api_Path: string = '';

  constructor(private http: HttpClient) {
    this.Api_Path = servicedata.api_url;
   }

  registerData(url:string, payload:Object){
    return this.http.post<LoginReg>(`${this.Api_Path}/${url}`, payload);
  }

  loginData(url:string, payload:Object){
    return this.http.post<LoginReg>(`${this.Api_Path}/${url}`, payload);
  }
}
