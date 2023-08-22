
import { ChangeDetectorRef, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RoleModelConfig } from 'src/app/data-models/user.model';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.css']
})
export class UserRoleListComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton!: { nativeElement: { click: () => void; }; };
  private _apiSubscription!: Subscription;
  roleId: number = 0;
  roleDetails!: RoleModelConfig;
  roleById!: RoleModelConfig;
  isCreate = true;
  data: [] = [];
  popupHeading: string = "Create New Role";

  constructor(private userData: UserDataService, private ref: ChangeDetectorRef,
    private graphService: GraphService, public audit: AuditTrailService, private getToken: GetTokenService

  ) { }

  ngOnInit(): void {
    this.getRoles();
    this.audit.addUrlAudit('userAuditLog');
  }


  public getRoles() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.userData.userRoleData('roles')
      .subscribe((respArray) => {
        this.roleDetails = respArray;
        this.graphService.showLoader = false;
        console.log(this.roleDetails);
      })

  }

  roleForm = new FormGroup({
    RoleName: new FormControl(''),
    RoleDesc: new FormControl('')
  })

  editRole(id: number, checkVal: string) {
    this.isCreate = false;
    this.roleId = id;
    this.userData.getRoleById('role', id)
      .subscribe(respArray => {
        this.roleById = respArray;
        this.roleForm.addControl('RoleStatus', new FormControl(''))
        this.roleForm.patchValue({
          RoleName: this.roleById.data[0].ROLE_NAME,
          RoleDesc: this.roleById.data[0].ROLE_DESC,
        })
        if (checkVal == 'edit') {
          this.roleForm.patchValue({
            RoleStatus: this.roleById.data[0].ROLE_STATUS
          })
        }
        else {
          this.roleForm.patchValue({
            RoleStatus: 0
          })
          this.onSubmit();
        }
      })
  }


  onSubmit() {
    this.data = this.roleForm.value;
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Create role',
      Effect: 'Role created Successfully',
      Status: 1,
    }
    if (this.isCreate) {
      this.userData.userCreateRolePermission(this.data, 'createRole')
        .subscribe(respArray => {
          if (this.roleForm.value.RoleName != '' && this.roleForm.value.RoleDesc != ''
          ) {
            this.closebutton.nativeElement.click();
          }
          console.log(respArray);
          alert(respArray.message);
          if (respArray.message == "Role successfully added!") {
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          else {
            payload.Effect = "Role creation failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }

        })
    }
    else {
      payload.Type = "Role Update";
      payload.Effect = "Role updated successfully";
      this.userData.UpdateRolePer('roleUpdate', this.data, this.roleId)
        .subscribe(respArray => {
          console.log(respArray);
          alert(respArray.message);

          this.ref.detectChanges();
          if (respArray.message == "Role Updated Successfully!") {
            this.closebutton.nativeElement.click();
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          else {
            payload.Effect = "Role updation failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
        })
    }
    this.getRoles();
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }

  popup(heading: string) {
    this.roleForm.reset({ RoleName: null, RoleDesc: null, });
    console.log("POPUP:: ROLE FORM:: ", this.roleForm)
    this.popupHeading = heading;
  }

  enableCreateRole () {
    this.isCreate = true;
  }

}
