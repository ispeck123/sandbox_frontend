import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  AssignRolePer,
  CreateRoleModelConfig,
  editModuleConfig,
  ModuleConfig,
  ModulePermConfig,
  PermissionModelConfig,
  RoleModelConfig,
  RolePermMapConfig,
  SubordinatePermissionConfig,
  UserDetailsConfig,
  UserModelConfig,
  UserPermByRoleConfig,
} from '../data-models/user.model';
import { GetTokenService } from './get-token.service';
import servicedata from 'src/assets/service.json'

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  readonly Api_Path: string = '';
  authorization: string = '';

  constructor(private http: HttpClient, private getToken: GetTokenService) {
    this.Api_Path = servicedata.api_url;
    this.authorization = localStorage.getItem('tk')!;
    console.log('b', this.authorization);
  }

  userRoleData(url: string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<RoleModelConfig>(`${this.Api_Path}/${url}`, {
      headers,
    });
  }

  userListData(url: string) {
    //console.log('auth:', this.authorization);
    const headers = this.getToken.getLocalToken();
    return this.http.get<UserModelConfig>(`${this.Api_Path}/${url}`, {
      headers,
    });
  }

  userCreateRolePermission(payload: object, url: string) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<CreateRoleModelConfig>(
      `${this.Api_Path}/${url}`,
      payload,
      { headers }
    );
  }

  saveRolePer(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post<AssignRolePer>(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }



  UpdateRolePer(url: string, payload: Object, id:number) {
    const headers = this.getToken.getLocalToken();
    return this.http.put<CreateRoleModelConfig>(`${this.Api_Path}/${url}/${id}`, payload, {
      headers,
    });
  }

  userDetailsById(url: string, payload: number, token: string) {
    const headers = new HttpHeaders().set('authorization', token);
    console.log(this.authorization);
    return this.http.get<UserDetailsConfig>(
      `${this.Api_Path}/${url}/${payload}`,
      { headers }
    );
  }

  userUpdate(url: string, payload: any,id:any ) {
    const authToken = this.getToken.getLocalToken();
    return this.http.put<UserDetailsConfig>(
      `${this.Api_Path}/${url}/${id}`, payload,{ headers:authToken });
  }
 

  userPermissionByRoleId(url: string, payload: number, token: string) {
    const headers = new HttpHeaders().set('authorization', token);

    return this.http.get<UserPermByRoleConfig>(
      `${this.Api_Path}/${url}/${payload}`,
      { headers }
    );
  }

  getModuleList(url: string) {
    const headers = this.getToken.getLocalToken();

    return this.http.get<ModuleConfig>(`${this.Api_Path}/${url}`, { headers });
  }

  getModuleById(url: string, id:number | string) {
    const headers = this.getToken.getLocalToken();

    return this.http.get<editModuleConfig>(`${this.Api_Path}/${url}/${id}`, { headers });
  }

  getPermissions(url: string) {
    const headers = this.getToken.getLocalToken();

    return this.http.get<PermissionModelConfig>(`${this.Api_Path}/${url}`, {
      headers,
    });
  }

  getSubordinatePermissions (id: any) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<SubordinatePermissionConfig>(`${this.Api_Path}/getSubrdinatePermissionsList/${id}`, {
      headers,
    });
  }

  getPermissionById(url: string, id:number) {
    const headers = this.getToken.getLocalToken();

    return this.http.get<PermissionModelConfig>(`${this.Api_Path}/${url}/${id}`, {
      headers,
    });
  }

  getModulePermissions(url: string, id: string) {
    const headers = this.getToken.getLocalToken();

    return this.http.get<ModulePermConfig>(
      `${this.Api_Path}/${url}/${id}`,
      {
        headers,
      }
    );
  }

  saveModule(url: string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.post(`${this.Api_Path}/${url}`, payload, {
      headers,
    });
  }

  updateModule(url: string, id:number, key:string, payload: Object) {
    const headers = this.getToken.getLocalToken();
    return this.http.put(`${this.Api_Path}/${url}/${id}/${key}`, payload, {
      headers,
    });
  }

  getRoleById(url: string, id:number) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<RoleModelConfig>(`${this.Api_Path}/${url}/${id}`, {
      headers,
    });
  }

  getRolePermMap(url: string) {
    const headers = this.getToken.getLocalToken();
    return this.http.get<RolePermMapConfig>(`${this.Api_Path}/${url}`, {
      headers,
    });
  }

  changePassword (url: string, payload: any) {
    const authToken = this.getToken.getLocalToken();
    return this.http.put(`${this.Api_Path}/${url}/${payload.id}`, payload, {headers: authToken});
  }

}
