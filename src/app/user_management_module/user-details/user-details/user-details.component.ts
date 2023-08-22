import { ConstantPool } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserModelConfig } from 'src/app/data-models/user.model';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  userDetails!: UserModelConfig;
  private _apiSubscription!: Subscription;
  constructor(private userData: UserDataService,
    private graphService: GraphService, private router: Router
    , public audit: AuditTrailService
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.audit.addUrlAudit('userAuditLog');
  }

  public getUsers() {
    this.graphService.showLoader = true;
    console.log('users');
    this._apiSubscription = this.userData.userListData('allUserList')
      .subscribe(
        respArray => {
          if (respArray.message == "Token invalid") {
            localStorage.removeItem("tk");
            localStorage.removeItem("uid");
            this.router.navigate(['/login']);
          }
          else {
            this.userDetails = respArray;
            this.graphService.showLoader = false;
          }
          console.log("All Users List:: ", this.userDetails)

        }
      )
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}
