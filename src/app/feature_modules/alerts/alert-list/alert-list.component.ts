import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.css']
})
export class AlertListComponent implements OnInit {

  constructor(public audit: AuditTrailService,private alert:AlertService) { }

  ngOnInit(): void {
    this.audit.addUrlAudit('userAuditLog');
    this.getAlertList();
  }

  getAlertList(){
    this.alert.getAlertListData('alarms','all').subscribe(
      respArray=>{
        console.log("nnnnn",respArray)
      }
    )
  }
}
