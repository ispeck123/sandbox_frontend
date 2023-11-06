import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ZoneRespConfig } from '../data-models/pipeline-model';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json';

@Injectable({
  providedIn: 'root'
})
export class ZoneDataService {

  // data!: {
  //   zone_coordinates: any[],
  //   created_by: string | undefined | null,
  //   modified_by: string | undefined | null,
  //   file_id: number,
  //   source_id: number
  // };

  data!: any;
  sourcesessionid:any;
  projectsessionid:any;
  fileid:any;
  used_project:any;
  useflowmode:any;

  Api_Path: string = '';
  authorization: string = '';
  savezone:boolean=false;

  constructor(private http: HttpClient, private getToken: GetTokenService) {
    this.Api_Path = servicedata.api_url;;
    this.authorization! = localStorage.getItem('tk')!;
  }

  saveZone(url: string, coordinates: any[]) {
    const uid = this.getToken.getUser_name();
    this.sourcesessionid = localStorage.getItem("source_id_session");
    this.useflowmode=localStorage.getItem('useflow');
    if(this.useflowmode=="useflow")
    {
      this.projectsessionid=sessionStorage.getItem("useflow_projectid")
    }
    else{
      this.projectsessionid=localStorage.getItem("pro_id")
    }
    ;
    this.fileid=localStorage.getItem("source_location_session_id")
    const headers = this.getToken.getLocalToken();
    this.used_project=localStorage.getItem("useflow");
    if(this.used_project=='useflow')
    {
      this.savezone=true;
    }
    else{
      this.savezone=false;
    }
  
  

    this.data = {
      zone_coordinates: coordinates,
      created_by: uid,
      // file_id: this.fileid,
      used_project:this.savezone,
      source_id: this.sourcesessionid,
      project_id:this.projectsessionid,
    };
    const payload = this.data;
    console.log(payload);
    return this.http.post<ZoneRespConfig>(`${this.Api_Path}/${url}`, payload, { headers });
  }

  updateZoneCoordinates (url: string, coordinates: any[]) {
    const uid = this.getToken.getUser_name();
    this.sourcesessionid = localStorage.getItem("source_id_session");
    this.projectsessionid=localStorage.getItem("pro_id");
    const headers = this.getToken.getLocalToken();
    this.data = {
      zone_id: 14,
      zone_coordinates: coordinates,
      modified_by: uid,
      // file_id: this.fileid,
      source_id: this.sourcesessionid,
      project_id:this.projectsessionid,
    }

    const payload = this.data;
    console.log(payload);
    return this.http.put<ZoneRespConfig>(`${this.Api_Path}/${url}`, payload, { headers });

  }


}
