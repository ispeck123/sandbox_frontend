import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-role-permission-mapping',
  templateUrl: './role-permission-mapping.component.html',
  styleUrls: ['./role-permission-mapping.component.css']
})
export class RolePermissionMappingComponent implements OnInit {

  constructor(public audit: AuditTrailService) { }

  ngOnInit(): void {
    this.audit.addUrlAudit('userAuditLog');

  }

}
