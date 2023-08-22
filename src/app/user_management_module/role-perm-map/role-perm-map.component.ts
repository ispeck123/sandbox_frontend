import { Component, OnInit,OnDestroy } from '@angular/core';
import { RolePermMapConfig, UserModelConfig } from 'src/app/data-models/user.model';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import {Subscription} from 'rxjs';
import { SanitizePermissionListPipe } from './remove-bracket.pipe';

@Component({
  selector: 'app-role-perm-map',
  templateUrl: './role-perm-map.component.html',
  styleUrls: ['./role-perm-map.component.css']
})
export class RolePermMapComponent implements OnInit,OnDestroy {
  private _apiSubscription! : Subscription;
  userDetails!: UserModelConfig;
  rolePermMap!: RolePermMapConfig;
  rolmMap:any=[];
  constructor(private userData: UserDataService,
    private graphService : GraphService,
    public audit: AuditTrailService
    ) { }

  ngOnInit(): void {
    this.getRolePermMap();
    this.audit.addUrlAudit('userAuditLog');

  }


  public getRolePermMap(){
    this.graphService.showLoader=true;

    console.log('users');
    this._apiSubscription=this.userData.getRolePermMap('rolePermissionMap')
    .subscribe(
     respArray => {

         this.rolePermMap= respArray;
         this.rolmMap =  this.rolePermMap.data;
         console.log(this.rolePermMap.data)
         this.graphService.showLoader=false;

      }
    )
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}
