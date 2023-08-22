import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GetTokenService } from './get-token.service';
import { AddAuditConfig, AuditTrailConfig } from '../data-models/user.model';
import { Router } from '@angular/router';
import { NumberInput } from '@angular/cdk/coercion';
import servicedata from 'src/assets/service.json'


@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
  Api_Path: string = '';
  authorization: string = '';
  apiData!: any;
  auditData: any = [];
  pdfGeneratorUrl!: string;


  constructor(private http: HttpClient, private getToken: GetTokenService, private router: Router) {

    this.authorization = localStorage.getItem('tk')!;
    this.Api_Path = servicedata.api_url;
    // this.pdfGeneratorUrl = environment.pdf_server_url;
    //console.log('s',this.Api_Path);
    //this.Api_Path = this.getToken.getBaseUrl()


  }

  getApiPath(id: string) {
    console.log(id)

  }

  getAuditData(url: string, noOfItemsPerPage: string, skip: string) {
    const header = new HttpHeaders({
      "authorization": this.getToken.getJSONWebTokenString(),
      'pageno': skip,
      'noofitems': noOfItemsPerPage
    });
    console.log("All Headers:: ", header)
    return this.http.get<AuditTrailConfig>(`${this.Api_Path}/${url}`, { headers: header });
  }

  addAudit(url: string, payload: object) {
    const headers = this.getToken.getLocalToken();
    console.log("LOCAL:: ", payload);
    return this.http.post<AddAuditConfig>(`${this.Api_Path}/${url}`, payload, { headers });
  }

  addUrlAudit(url: string) {
    const headers = this.getToken.getLocalToken();
    let id = this.getToken.getUser_id();
    let date = new Date();
    const payload: AddAuditConfig = {
      Id: id,
      Type: 'Page Visit',
      Effect: this.router.url,
      Status: 1,
    }
    // payload.Id = id;
    // payload.Type = 'Page Visit';
    // payload.Effect = 'Url ->' + this.router.url;
    console.log(payload);
    this.http.post(`${this.Api_Path}/${url}`, payload, { headers })
      .subscribe(
        resp => {
          this.auditData = resp;
          console.log("Audit message--------------", this.auditData.message);
          if (this.auditData.message == "Token invalid" || this.auditData.message == "Token not present") {
            localStorage.removeItem("tk");
            localStorage.removeItem("uid");
            this.router.navigate(['/login']);
            alert("Invalid Token");
          }
        }
      )
  }

  auditSearch(url: string, noOfItemPerPage: string, skipBy: string, payload: string) {
    const headers = new HttpHeaders()
      .set('authorization', this.authorization)
      .set('inputdata', payload)
      .set("pageNo", skipBy)
      .set("noOfItems", noOfItemPerPage);
    return this.http.get<AuditTrailConfig>(`${this.Api_Path}/${url}`, { headers });
  }

  getFilterData(url: string, noOfItemPerPage: string, skipBy: string, payload: object) {
    const headers = new HttpHeaders({
      "authorization": localStorage.getItem("tk")!,
      "pageno": skipBy,
      "noofitems": noOfItemPerPage
    });
    // const headers = this.getToken.getLocalToken();
    console.log(headers, payload);
    return this.http.post<AuditTrailConfig>(`${this.Api_Path}/${url}`, payload, { headers });
  }

  exportPDF(keyword: string, fromdate: number, todate: number, userid: string) {
    const headers = new HttpHeaders({
      "authorization": localStorage.getItem("tk")!,
    });

    return this.http.post(this.Api_Path + "/exportAudits",  {
      fromdate,
      todate,
      keyword,
      userid
    }, {headers});
  }

  getExportsList () {
    const headers = this.getToken.getLocalToken();
    return this.http.get(this.Api_Path+"/exportsList", {headers});
  }

}


