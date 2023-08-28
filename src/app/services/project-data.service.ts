import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertCategoryConfig, ProExecConfig, ProjectCreateResp, ProjectDeployConfig, ProjectListConfig, ProjectTypeConfig, ProStartResp, ProStartRespConfig, ProStopResp, SourceFileListConfig, SourceLocationConfig, SourceUploadResp } from '../data-models/project-model';
import { GetTokenService } from './get-token.service';
import { map } from "rxjs/operators";
import servicedata from 'src/assets/service.json'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  readonly Api_Path: string = '';
  authorization: string     = '';
  fastapiurl='http://164.52.218.100:9000/'

  constructor(private http: HttpClient, private getToken: GetTokenService) {
    this.Api_Path       = servicedata.api_url;
    this.authorization  = localStorage.getItem('tk')!;
    console.log()  
  }
  getProjecttype(url: string, id: number | string): Observable<ProjectTypeConfig> {
    const headers = this.getToken.getLocalToken();
    return this.http.get<ProjectTypeConfig>(this.fastapiurl + url + '/' + id, { headers });
  }
  projectTypeData(url:string){
    const headers = this.getToken.getLocalToken();
    console.log(headers)
    return this.http.get<ProjectTypeConfig>(`${this.Api_Path}/${url}`, {headers});
  }

  createProjectData(url: string, payload:object){
    const headers = this.getToken.getLocalToken();
    return this.http.post<ProjectCreateResp>(`${this.Api_Path}/${url}`, payload , {headers});
  }

  updateProject(url: string, payload:object){
    const headers = this.getToken.getLocalToken();
    return this.http.put<ProjectCreateResp>(`${this.Api_Path}/${url}`, payload , {headers});
  }


  getProjectList(url: string, id: string | number){
    const headers = this.getToken.getLocalToken();
    console.log('l',headers)
    const uid = null;
    console.log("object",url,id,uid)

    return this.http.get<ProjectListConfig>(`${this.Api_Path}/${url}/${id}/${uid}`, {headers})
           .pipe(map(object =>{
            console.log("object",object)
             let pro_letters = object.data[0].project_name.split('').map(word => word[0])
                .join('');
              return  {...object, pro_letters: pro_letters};
           }))
  }

  getAlertCategory(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<AlertCategoryConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }

  uploadSourceFile(url:string, payload:object){
    const headers = this.getToken.getLocalToken();
    return this.http.post<SourceUploadResp>(`${this.Api_Path}/${url}`,payload, {headers});
  }

  sourceFileList(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    let name ='vivek';
    return this.http.get<SourceFileListConfig>(`${this.Api_Path}/${url}/${id}/${name}`, {headers});
  }

 
  getSourceLocation(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<SourceLocationConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
 
  getProjectType(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.get<SourceLocationConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  // getSourceFile( url: string,source_id : number | string,source_type:any){
  //   const headers = this.getToken.getLocalToken();
  //   return this.http.get<SourceLocationConfig>(this.fastapiurl+url+"/"+{source_id}+"/"+{source_type});
  // }


  getSourceFile(url: string, source_id: number | string, source_type: any) {
    const headers = this.getToken.getLocalToken();
    return this.http.get(this.fastapiurl + url + '/' + source_id + '/' + source_type, { responseType: 'arraybuffer' })
      .pipe(
        map((arrayBuffer: ArrayBuffer) => {
          const fileBlob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          return fileBlob;
        })
      );
  }
  projectStart(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    // console.log(headers)
    let payload:object = {};
    return this.http.post<ProStartRespConfig>(`${this.Api_Path}/${url}/${id}`,payload, {headers});
  }

  projectStop(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.post<ProStopResp>(`${this.Api_Path}/${url}/${id}`, {headers});
  }

  projectStatus(url: string , id : number | string){
    const headers = this.getToken.getLocalToken();
    return this.http.post<ProExecConfig>(`${this.Api_Path}/${url}/${id}`, {headers});
  }
  // projectDeploy(url: string, id: number | string): Observable<ProjectTypeConfig> {
  //   const headers = this.getToken.getLocalToken();

  //   let fastapi='http://216.48.180.125:9000/';
  //   var reqHeader = new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'No-Auth': 'True' });
  //   return this.http.post<any>(fastapi+'project/deploy' + '/' + id, { headers });
  // }
  
  // projectDeploy(url: string , id : number | string){
  //   const headers = this.getToken.getLocalToken();
  //   let payload:object = {};
  //   return this.http.post<any>(this.fastapiurl+'project/deploy' + '/' + id, { headers });
  // }

  projectDeploy(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // You might need to add more headers if required
    });

    return this.http.post<any>(this.fastapiurl+'project/deploy'+'/'+id, { headers });
  }

  weightFiledownload(project_id: number) {
    const headers = this.getToken.getLocalToken();
    return this.http.get(this.fastapiurl+'download_weight' + '/' + project_id, { responseType: 'arraybuffer' })
      .pipe(
        map((arrayBuffer: ArrayBuffer) => {
          const fileBlob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
          return fileBlob;
        })
      );
  }
  // weightFiledownload(url: string , project_id : number | string){
  //   const headers = this.getToken.getLocalToken();
  //   let payload:object = {};
  //   return this.http.get<any>(this.fastapiurl+'download_weight' + '/' + project_id , {observe:'response',responseType:'blob'});
  // }

  deleteProjectSource (url: string, project_id: number, source_id: number) {
    const headers = this.getToken.getLocalToken();
    return this.http.get(`${this.Api_Path}/${url}/${project_id}/${source_id}`, {headers})
  }

  mapProjectSource (url: string, project_id: number, source_id: number, created_by: string) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(`${this.Api_Path}/${url}/${project_id}/${source_id}/${created_by}`, {}, {headers});
  }

  deleteProject (id: number) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(`${this.Api_Path}/deleteProject/${id}`, null, { headers })
  }
}
