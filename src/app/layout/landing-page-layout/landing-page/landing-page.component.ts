import { Component, OnInit } from '@angular/core';
import { GetTokenService } from 'src/app/services/get-token.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private getToken: GetTokenService,public audit: AuditTrailService) { }
  userName:string='';
  ngOnInit(): void {
    
    localStorage.removeItem("pr_id");
    this.userName = this.getToken.getUser_name();
    console.log(this.getToken.getLocalToken())
    this.audit.addUrlAudit('userAuditLog');

  }
  datasource()
{
  localStorage.removeItem("pr_type");
  localStorage.removeItem("editflow");
  localStorage.removeItem("useflow");
}
}
