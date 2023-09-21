import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { EventConfig, GpuUsageConfig, LoginChartConfig, SystemUsageConfig,CheckingConfig,EventfailConfig,LoginfailChartConfig,ProcessConfig } from '../data-models/graph-model';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  Api_Path:string = '';
  authorization:string = '';
  private _showLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _loaderMessage: BehaviorSubject<string> = new BehaviorSubject<string>(''); // Add a message BehaviorSubject

  constructor(private http: HttpClient, private getToken:GetTokenService) {
    this.Api_Path       = servicedata.api_url;
   }


  fetchSystemUsage(url:string){
    const headers = this.getToken.getLocalToken();
    const uid     = null;
    return this.http.get<SystemUsageConfig>(`${this.Api_Path}/${url}`, {headers});
  }

  fetchGpuUsage(url:string){
    const headers = this.getToken.getLocalToken();
    const uid     = null;
    let payload:any[]=[];
    return this.http.post<GpuUsageConfig>(`${this.Api_Path}/${url}`,payload, {headers});
  }

  fetchprocess(url:string){
    const headers = this.getToken.getLocalToken();
    const uid     = null;
    return this.http.get<ProcessConfig>(`${this.Api_Path}/${url}`, {headers});
  }

getHeaders(id: number | string):HttpHeaders{
    this.authorization = localStorage.getItem('tk')!;
    const header = new HttpHeaders()
    .set('authorization', this.authorization)
    .set('id', id.toString())
    return header;
  }

  checkAdmin(url:string,id:number, token: string){
    const headers = new HttpHeaders().set('authorization', token);
    return this.http.get<CheckingConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  
  fetchLogin(url:string,payload:object,id:number | string){
    console.log('a',id)
    const headers =  this.getHeaders(id);
    return this.http.post<LoginChartConfig>(`${this.Api_Path}/${url}`,payload, {headers});
  }

  fetchLoginfail(url:string,payload:object,id:number | string){
    console.log('a',id)
    const headers =  this.getHeaders(id);
    return this.http.post<LoginfailChartConfig>(`${this.Api_Path}/${url}`,payload, {headers});
  }

  fetchEvent(url:string,payload:object,id:number | string){
    const headers = this.getHeaders(id);
    return this.http.post<EventConfig>(`${this.Api_Path}/${url}`,payload, {headers});
  }
  fetchEventfail(url:string,payload:object,id:number | string){
    const headers = this.getHeaders(id);
    return this.http.post<EventfailConfig>(`${this.Api_Path}/${url}`,payload, {headers});
  }



  // --------------------------------------------

  get showLoader(){
    return this._showLoader.asObservable();
  }
  
  set showLoader(value:any){
    console.log(value);
    this._showLoader.next(value);
  }

  set LoaderMessage(message: string) {
    this._loaderMessage.next(message);
  }


}
