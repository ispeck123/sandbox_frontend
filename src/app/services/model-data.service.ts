import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddModelRespConfig, AlgoListConfig, ArtifactConfig,artifactfileRespConfig, artifactStoreRespConfig, AttrDataTypeConfig, FrameworkListConfig, ModalTypeConfig, ModelCategoryconfig, ModelConfigType, ModelListConfig, ModelVerifyConfig } from '../data-models/model';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json'

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelDataService {
   Api_Path:string = '';
   authorization:string = '';
   fastapiurl='http://103.13.113.132:9000/'

  constructor(private http: HttpClient, private getToken:GetTokenService) {
      this.Api_Path       = servicedata.api_url;
      this.authorization! = localStorage.getItem('tk')!;
  }


  getModelListData(url:string, id:number | string, userid:any){
    const headers = this.getToken.getLocalToken();
    // const uid     = null;
    return this.http.get<ModelListConfig>(`${this.Api_Path}/${url}/${id}/${userid}`, {headers});
  }



  getRigisterModelList(url: string, model_id: any ,userid:any) {
    const headers = this.getToken.getLocalToken();

    return this.http.get<any>(this.fastapiurl+url+model_id+"?userid="+userid,{ headers }
      );
  }
  getModelType(url:string, id:number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<ModalTypeConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  getFramework(url:string, id:number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<FrameworkListConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  getFrameworklist(url:string, id:number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<FrameworkListConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  getFrameworkByID(url:string, id:string | number){
    const headers = this.getToken.getLocalToken();
    return this.http.get<FrameworkListConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }

  getAlgoByID(url:string, id:string | number | undefined ){
    const headers = this.getToken.getLocalToken();
    return this.http.get<AlgoListConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }

  saveModal(url:string, payload:Object){
    const headers = this.getToken.getLocalToken();
    return this.http.post<AddModelRespConfig>(`${this.Api_Path}/${url}`, payload, {headers});
  }

  updateModal(url:string, payload:Object){
    const headers = this.getToken.getLocalToken();
    return this.http.put<AddModelRespConfig>(`${this.Api_Path}/${url}`, payload, {headers});
  }

  getDataType(url:string ){
    const headers = this.getToken.getLocalToken();
    return this.http.get<AttrDataTypeConfig>(`${this.Api_Path}/${url}`, {headers});
  }

  uploadConfigFile(url:string, payload:object){
    const headers = this.getToken.getLocalToken();
    let fastapi='http://103.13.113.132:9000/';
    var reqHeader = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'No-Auth': 'True' });
    return this.http.post<any>(fastapi+'artifact/store',payload);
  }
  uploadWeightFile(url:string, payload:object){
    const headers = this.getToken.getLocalToken();
    let fastapi='http://103.13.113.132:9000/';
    var reqHeader = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'No-Auth': 'True' });
    return this.http.post<any>(fastapi+'artifact/weight/store',payload);
  }


  

  getModelConfigType(url:string ){
    const headers = this.getToken.getLocalToken();
    return this.http.get<ModelConfigType>(`${this.Api_Path}/${url}`, {headers});
  }

  getModelCategory(url:string ){
    const headers = this.getToken.getLocalToken();
    return this.http.get<ModelCategoryconfig>(`${this.Api_Path}/${url}`, {headers});
  }

  // verifyModel(url:string, id:number){
  //   const headers = new HttpHeaders({
  //     'authorization': this.getToken.getJSONWebTokenString()
  //   });
  //   // console.log("Model Verification:: ", headers);
  //   return this.http.post<ModelVerifyConfig>(`${this.Api_Path}/${url}/${id}`, null, {headers});
  // }

  projectDeploy(url: string , project_id : number | string){
    const headers = this.getToken.getLocalToken();
    let payload:object = {};
    return this.http.post<any>(this.fastapiurl+'project/deploy' + '/' + project_id, { headers });
  }

  getArtifactList(url:string, id: number | string ){
    const headers = this.getToken.getLocalToken();
    return this.http.get<ArtifactConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }

  getModalType(url:string, id: number | string ){
    const headers = this.getToken.getLocalToken();
    return this.http.get<ModalTypeConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  // registerModel(url: string , id : number | string){
  //   const headers = this.getToken.getLocalToken();
  // let fastapi='http://216.48.180.125:9000/';
  // var reqHeader = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'No-Auth': 'True' });
  // return this.http.post<any>(fastapi+'model/register' + '/' + id, headers);
  // }

  registerModel(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    let payload:object = {};
    return this.http.post(`${this.Api_Path}/${url}/${id}`, payload, {headers});
  }

  getArtifactByModel(url:string,payload:object){
    const headers = this.getToken.getLocalToken();
    return this.http.post<artifactStoreRespConfig>(`${this.Api_Path}/${url}`,payload, {headers});
  }

  getArtifactfile(url:string,fileid:any,artifactid:any){
    const headers = this.getToken.getLocalToken();
    return this.http.get<artifactfileRespConfig>(`${this.Api_Path}/${url}/${fileid}/${artifactid}/default/json`, {headers});
  }

  deleteModel (modelid: number) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(`${this.Api_Path}/deleteModel/${modelid}`, null, { headers });
  }

}
