import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserDetailsConfig } from 'src/app/data-models/user.model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Router } from '@angular/router';
import { GraphService } from 'src/app/services/graph.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit,OnDestroy {
  private _apiSubscription! : Subscription;

  userDetailsData!: UserDetailsConfig;
  token:string='';
  constructor( private userData: UserDataService, private getToken: GetTokenService,
    private graphService : GraphService,public audit: AuditTrailService

    ) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.audit.addUrlAudit('userAuditLog');

  }

  getUserDetails() {
    this.graphService.showLoader=true;

  let userid:number = this.getToken.getUser_id();
  this.token = localStorage.getItem('tk')!;
    //console.log(userid)
    this._apiSubscription=this.userData
      .userDetailsById('userDetails', userid, this.token!)
      .subscribe((resp) => {
        this.userDetailsData = resp;

        const role_id = this.userDetailsData.data[0].USER_ROLE_ID;
        const username = this.userDetailsData.data[0].USER_NAME;
        this.graphService.showLoader=false;

      });
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}
