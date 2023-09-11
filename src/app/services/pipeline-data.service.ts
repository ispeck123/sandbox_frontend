import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { ModelListConfig, ModelListData } from '../data-models/model';
import {
  AreaListConfig,
  AttachModelRespConfig,
  AttrRespConfig,
  AttrRespData,
  AttrValRespConfig,
  AttrValRespData,
  ClassListConfig,
  ClassRespConfig,
  PipelineCreateResp,
  PipelineListConfig,
  PipelineTypeConfig,
  PipeModelTypeConfig,
  ProcessingTypeConfig,
  SourceListConfig,ModelClassDelConfig,
  SourceRespConfig,UpdateSourceResp
} from '../data-models/pipeline-model';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json'
import { SourceUploadResp } from '../data-models/project-model';

@Injectable({
  providedIn: 'root',
})
export class PipelineDataService {
  Api_Path: string = '';
  authorization: string = '';
  fastapiurl='http://192.168.1.32:9000'

  constructor(private http: HttpClient, private getToken: GetTokenService) {
    this.Api_Path = servicedata.api_url;
    // this.getsource();
  }

  getPipelineData(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    const uid = null;
    return this.http.get<PipelineListConfig>(
      `${this.Api_Path}/${url}/${id}/${uid}`,
      { headers }
    );
  }

  getPipelineTypeData(url: string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<PipelineTypeConfig>(`${this.Api_Path}/${url}`, {
      headers,
    });
  }

  getProcessingTypeData(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<ProcessingTypeConfig>(
      `${this.Api_Path}/${url}/${id}`,
      { headers }
    );
  }

  savePipeline(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<PipelineCreateResp>(
      `${this.Api_Path}/${url}`,
      payload,
      { headers }
    );
  }

  updatePipeline(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.put<PipelineCreateResp>(
      `${this.Api_Path}/${url}`,
      payload,
      { headers }
    );
  }

 updateSource(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.put<UpdateSourceResp>(
      `${this.Api_Path}/${url}`,
      payload,
      { headers }
    );
  }

  saveClass(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<ClassRespConfig>(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }
  
  updateClass(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.put<ClassRespConfig>(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }

  saveAttribute(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<AttrRespConfig>(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }

  updateAttribute(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.put<AttrRespConfig>(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }

  saveAttributeVal(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<AttrValRespConfig>(
      `${this.Api_Path}/${url}`,
      payload,
      { headers }
    );
  }

  updateAttributeVal(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    console.log(headers)

    return this.http.put<AttrValRespConfig>(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }

  delModeldata(url: string,  id: number) {
    const headers = this.getToken.getLocalToken();
    console.log(this.getToken.getLocalToken())

    return this.http.get<ModelClassDelConfig>(`${this.Api_Path}/${url}/${id}` , 
    {headers}
    );
  } 
  
  delClass(url: string,  id: number) {
    const headers = this.getToken.getLocalToken();
    console.log(this.getToken.getLocalToken())

    return this.http.delete<ModelClassDelConfig>(`${this.Api_Path}/${url}/${id}` , 
    {headers}
    );
  }

  getClassListByModel(url: string, mdl_id: number) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<ClassListConfig>(`${this.Api_Path}/${url}/${mdl_id}`, {
      headers,
    });
  }

  getClassList(url: string, id: number) {
    console.log(id);
    const uid = null;
    const headers = this.getToken.getLocalToken();
    return this.http.get<ClassListConfig>(
      `${this.Api_Path}/${url}/${id}/${url}`,
      { headers }
    );
  }

  // getClassAttributes(url:string, id:number | string){
  //   const headers = this.getToken.getLocalToken();
  //   return this.http.get<Class>(`${this.Api_Path}/${url}/${id}`, {headers});
  // }

  getAreaList(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<AreaListConfig>(`${this.Api_Path}/${url}/${id}`, {
      headers,
    });
  }

  saveSource(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<any>(this.fastapiurl+url,payload,{ headers }
    );
  }

  getSourceList(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    const uid = this.getToken.getUser_name();
    return this.http.get<SourceListConfig>(
      `${this.Api_Path}/${url}/${id}/${uid}`,
      { headers }
    );
  }
  getSourceListCondition(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    const uid = this.getToken.getUser_name();
    return this.http.get<SourceListConfig>(
      `${this.Api_Path}/${url}/${id}`,
      { headers }
    );
  }


  getPipeModelType(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<PipeModelTypeConfig>(`${this.Api_Path}/${url}/${id}`, {
      headers,
    });
  }

  saveAttachedModel(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<AttachModelRespConfig>(
      `${this.Api_Path}/${url}`,
      payload,
      { headers }
    );
  }

  updatePipelineModel (payload: any) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(`${this.Api_Path}/updatePipelineModel`, payload, {headers});
  }

  getPipeModelList(url: string, id: number | string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<ModelListConfig>(`${this.Api_Path}/${url}/${id}`, {
      headers,
    });
  }
  getsource() {
    const headers = this.getToken.getLocalToken();
    this.http.get('http://localhost:3020/download/source/31', {
      headers,
    }).subscribe(resp => console.log(resp))
  }

  deleteModelFromPipeline (url: string, modelId: number | string, pipelineId: string | number) {
    const headers = this.getToken.getLocalToken();
    return this.http.get(`${this.Api_Path}/${url}/${modelId}/${pipelineId}`, {
      headers
    });
  }

  deletePipeline (pipelineId: number) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(`${this.Api_Path}/deletePipeline/${pipelineId}`, null, {headers});
  }

  // getPipeModelList(url: string, id: number | string) {
  //   const headers = this.getToken.getLocalToken();
  //   return this.http.get<any>(this.fastapiurl+'registered/model/view'+'/'+id, { headers });
  // }
      

   
}


