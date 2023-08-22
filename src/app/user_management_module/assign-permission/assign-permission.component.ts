import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  AssignRolePer,
  ModuleConfig,
  ModulePermConfig,
  PermissionModelConfig,
  RoleModelConfig,
} from 'src/app/data-models/user.model';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { environment } from 'src/environments/environment';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assign-permission',
  templateUrl: './assign-permission.component.html',
  styleUrls: ['./assign-permission.component.css'],
})
export class AssignPermissionComponent implements OnInit, OnDestroy {
  permissionDetails!: ModulePermConfig;
  roleDetails!: RoleModelConfig;
  moduleList!: ModuleConfig;
  addRole!: FormGroup;
  data!: any;
  role: string = 'permission';
  roleResp!: AssignRolePer;
  authorization!: string;
  checked: boolean = false;
  Api_Path: string = environment.api_url;
  private _apiSubscription!: Subscription;

  constructor(
    private userData: UserDataService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private graphService: GraphService,
    public audit: AuditTrailService,
    private getToken: GetTokenService

  ) {
    this.addRole = this.formBuilder.group({
      roleperid: new FormControl(''),
      type: new FormControl(''),
      userid: new FormControl(''),
      PERMISSION: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.fetchModuleList();
    this.audit.addUrlAudit('userAuditLog');

  }

  get permArray() {
    return this.addRole.controls['PERMISSION'] as FormArray;
  }

  public getRoles() {
    this.userData.userRoleData('roles').subscribe((respArray) => {
      this.roleDetails = respArray;
      console.log(this.roleDetails);
    });
  }

  getPermData(id: string) {
    // this.permArray.removeAt(this.permArray.length - 1);

    this.ref.detectChanges();
    this.userData
      .getModulePermissions('modulePermission', id)
      .subscribe((respArray) => {
        console.log(respArray);
        this.permissionDetails = respArray;
        this.addCheckBoxes();
        this.ref.detectChanges();
      });
  }

  fetchModuleList() {
    this.graphService.showLoader = true;

    this._apiSubscription = this.userData.getModuleList('modules').subscribe((respArray) => {
      this.moduleList = respArray;
      this.ref.detectChanges();
      this.graphService.showLoader = false;

    });
  }

  addCheckBoxes() {
    // (this.addRole.controls['PERMISSION'] as FormArray).clear();
    // while ((this.addRole.controls['PERMISSION'] as FormArray).length) {
    //   (this.addRole.controls['PERMISSION'] as FormArray).removeAt(0)
    // }
    this.permissionDetails.data.forEach(() =>
      this.permArray.push(new FormControl(false))
    );
    this.ref.detectChanges();
    console.log(1);
  }

  assignPermission() {
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Assign permission',
      Effect: 'Permission assigned successfully',
      Status: 1,
    }
    
    // const selectedPerms = this.addRole.value.PERMISSION.map((checked: boolean, i: number) => {
    //   checked ? this.permissionDetails.data[i].PERMISSION_ID : null
    // }).filter((v: any) => v !== null);

    const selectedPerms = this.addRole.value.PERMISSION.map((checked: boolean, i: number) => {
      return checked ? this.permissionDetails.data[i].PERMISSION_ID : null
    }).filter((perm: number) => {
      return perm !== null;
    })

    const perm = JSON.stringify(selectedPerms);
    console.log("%c Selected Perms:: %s", "color: orange; font-size: 24px;", JSON.stringify(selectedPerms));
    console.log('perm');
    this.addRole.patchValue({ roleperid: perm });
    this.data = JSON.parse(JSON.stringify(this.addRole.value));
    console.log("\n\n:; -->>", this.data)
    let dataToBeSent: {roleperid: number[], userid: number, type: string} = this.data;
    let sanitizedData: { userid: number, type: string, roleperid: {'per_id': string}[] } = {userid: 2, roleperid: [], type: "permission"};
    sanitizedData.userid = dataToBeSent.userid;
    sanitizedData.type = dataToBeSent.type;

    console.log("this.data.roleperid", JSON.parse(this.data.roleperid));
    let rolePermissionIdArray = JSON.parse(this.data.roleperid);
    for (let i = 0; i < rolePermissionIdArray.length; i++) {
      const element = rolePermissionIdArray[i];
      sanitizedData.roleperid.push({'per_id': element.toString()});
    }
    console.log("%cSanitized Data::: %s", "color: green; font-size: 24px;", JSON.stringify(sanitizedData));
    console.log("%c Data to ben sent:: %s", "color: blue; font-size: 24px;", JSON.stringify(dataToBeSent));
    console.log(sanitizedData);

    this.userData
      .saveRolePer('assignUserRoleOrPermission', sanitizedData)
      .subscribe((respArray) => {
        this.roleResp = respArray;
        alert(respArray.message);
        if (respArray.message == "Permission assigned successfully") {
          this.audit.addAudit('userAuditLog', payload).subscribe(respArray => {
              console.log(respArray)
            });
        }
        else {
          payload.Effect = "Assign permission failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log(respArray)
            }
          )
        }
      });
  }

  selectAll() {
    this.checked = !this.checked;
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}
