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

  Api_Path: string = '';
  authorization: string = '';

  constructor(private http: HttpClient, private getToken: GetTokenService) {
    this.Api_Path = servicedata.api_url;;
    this.authorization! = localStorage.getItem('tk')!;
  }

  saveZone(url: string, coordinates: any[]) {
    const uid = this.getToken.getUser_name();
    const headers = this.getToken.getLocalToken();
    this.data = {
      zone_coordinates: coordinates,
      created_by: uid,
      file_id: 24,
      source_id: 6
    };
    const payload = this.data;
    console.log(payload);
    return this.http.post<ZoneRespConfig>(`${this.Api_Path}/${url}`, payload, { headers });
  }

  updateZoneCoordinates (url: string, coordinates: any[]) {
    const uid = this.getToken.getUser_name();
    const headers = this.getToken.getLocalToken();
    this.data = {
      zone_id: 14,
      zone_coordinates: coordinates,
      modified_by: uid,
      file_id: 24,
      source_id: 6
    }

    const payload = this.data;
    console.log(payload);
    return this.http.put<ZoneRespConfig>(`${this.Api_Path}/${url}`, payload, { headers });

  }


}
