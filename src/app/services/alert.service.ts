import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json'
import { AlertListConfig } from '../data-models/alert-model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  Api_Path:string = '';
  authorization:string = '';
  constructor(private http: HttpClient, private getToken:GetTokenService) {
    this.Api_Path       = servicedata.api_url;
      this.authorization! = localStorage.getItem('tk')!;
   }
   getAlertListData(url:string, id:number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<AlertListConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
}
