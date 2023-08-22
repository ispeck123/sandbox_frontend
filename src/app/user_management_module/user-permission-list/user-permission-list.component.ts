import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PermissionModelConfig } from 'src/app/data-models/user.model';
import { FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from 'src/app/services/user-data.service';
import { environment } from 'src/environments/environment';
import { GraphService } from 'src/app/services/graph.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-permission-list',
  templateUrl: './user-permission-list.component.html',
  styleUrls: ['./user-permission-list.component.css'],
})
export class UserPermissionListComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton!: { nativeElement: { click: () => void; }; };
  private _apiSubscription!: Subscription;
  permId: number = 0;
  authorization: string | null = '';
  Api_Path: string = environment.api_url;
  permissionDetails!: PermissionModelConfig;
  permById!: PermissionModelConfig;
  data: [] = [];
  isCreate = true;
  popupHeading = "Create New Permission"

  constructor(
    private http: HttpClient,
    private userData: UserDataService,
    private ref: ChangeDetectorRef,
    private graphService: GraphService,
    public audit: AuditTrailService,
    private getToken: GetTokenService,


  ) { }

  ngOnInit(): void {
    this.getPermissions();
    this.audit.addUrlAudit('userAuditLog');

  }

  public getPermissions() {
    this.graphService.showLoader = true;

    this._apiSubscription = this.userData.getPermissions('permissions').subscribe((respArray) => {
      this.permissionDetails = respArray;
      this.ref.detectChanges();
      this.graphService.showLoader = false;

      console.log(this.permissionDetails.data[0].CREATION_DATE);
    });
  }

  permissionForm = new FormGroup({
    PER_NAME: new FormControl(''),
    PER_DESC: new FormControl(''),
  });

  editRole(id: number, checkVal: string) {
    this.isCreate = false;
    this.permId = id;
    this.userData.getPermissionById('permission', id)
      .subscribe(respArray => {
        this.permById = respArray;
        this.permissionForm.addControl('PER_STATUS', new FormControl(''))
        this.permissionForm.patchValue({
          PER_NAME: this.permById.data[0].PER_NAME,
          PER_DESC: this.permById.data[0].PER_DESC,
        })
        if (checkVal == 'edit') {
          this.permissionForm.patchValue({
            PER_STATUS: this.permById.data[0].PER_STATUS
          })
        }
        else {
          this.permissionForm.patchValue({
            PER_STATUS: 0
          })
          this.onSubmit();
        }
      })
  }

  onSubmit() {
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Create permission',
      Effect: 'Permission created successfully',
      Status: 1,
    }
    this.data = this.permissionForm.value;
    if (this.isCreate) {
      this.userData
        .userCreateRolePermission(this.data, 'createPermission')
        .subscribe((respArray) => {
          console.log("Saving Permission:: ", respArray)
          if (this.permissionForm.value.PER_NAME != '' && this.permissionForm.value.PER_DESC != '') {
            this.closebutton.nativeElement.click();
          }
          if (respArray.message == "Permission successfully added!") {
            this.closebutton.nativeElement.click();
            this.audit.addAudit('userAuditLog', payload).subscribe(respArray => {
              console.log(respArray)
            })
          }
          else {
            payload.Effect = "Permission updation failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          console.log(respArray);
          this.getPermissions();
          alert('Permission successfully added');
        });
    }
    else {
      payload.Type = "Update permission";
      payload.Effect = "Permission Updated Successfully";
      this.userData
        .UpdateRolePer('permissionsUpdate', this.data, this.permId)
        .subscribe((respArray) => {
          this.closebutton.nativeElement.click();
          console.log(respArray);
          this.getPermissions();
          alert('Permission successfully updated');
          if (respArray.message == "Permission Updated Successfully!") {
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
          else {
            payload.Effect = "Permission updation failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
        });
    }

  }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }

  setPopupHeading(heading: string) {
    this.permissionForm.reset({ PER_NAME: '', PER_DESC: '' });
    this.popupHeading = heading;
  }

  enableCreateRole () {
    this.isCreate = true;
  }

}
