import { Component, OnInit, ViewChild, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  editModuleConfig,
  ModuleConfig,
  PermissionModelConfig,
  SubordinatePermissionConfig,
} from 'src/app/data-models/user.model';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css'],
})
export class ModuleComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton!: { nativeElement: { click: () => void; }; };
  @ViewChild('popup') popupElement!: ElementRef;
  private _apiSubscription!: Subscription;
  moduleList!: ModuleConfig;
  editModule!: editModuleConfig;
  moduleKey!: string;
  moduleId: number = 0;
  isCreate = true;
  permissionDetails!: PermissionModelConfig;
  addModule!: FormGroup;
  check: boolean = true;

  popupHeading: string = "Update Module";

  constructor(
    private userData: UserDataService,
    private formBuilder: FormBuilder,
    private graphService: GraphService,
    public audit: AuditTrailService,
    private getToken: GetTokenService,
    private renderer: Renderer2
  ) {
    this.addModule = this.formBuilder.group({
      MODULE_NAME: new FormControl(null),
      PERMISSION: new FormArray([]),
      PERMISSION_ID: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.fetchModuleList();
    this.fetchPermList();
    this.audit.addUrlAudit('userAuditLog');
  }

  get permArray() {
    return this.addModule.controls['PERMISSION'] as FormArray;
  }

  fetchModuleList() {
    this.graphService.showLoader = true;

    this._apiSubscription = this.userData.getModuleList('modules')
    .subscribe((respArray) => {
      this.moduleList = respArray;
      console.log('m', respArray);
      this.graphService.showLoader = false;
    });
  }

  fetchPermList() {

    this.userData.getPermissions('permissions').subscribe((respArray) => {
      this.permissionDetails = respArray;
      console.log(this.permissionDetails.data[0]);
      this.addCheckBoxes();
    });
  }

  addCheckBoxes() {
    this.permissionDetails.data.forEach(() =>
      this.permArray.push(new FormControl(false))
    );
  }


  editModuleFn(id: number, checkVal: string, hash: string) {
    this.isCreate = false;
    this.removeCheckBoxes();
    this.moduleId = id;
    this.moduleKey = hash;
    console.log('editid', this.moduleId)
    this.userData.getModuleById('module', id)
      .subscribe(respArray => {
        this.editModule = respArray;

        console.log('module', this.editModule.data.PERMISSION_ID);
        this.addModule.patchValue({
          MODULE_NAME: this.editModule.data.MODULE_NAME
        })
        if (checkVal == 'edit') {
          this.permissionDetails.data.map((perm, i) => {
            if (this.editModule.data.PERMISSION_ID.indexOf(perm.PER_ID) !== -1) {
              this.permArray.at(i).patchValue(true)
            }
          })
        }
      })
  }

  removeCheckBoxes() {
    while ((this.addModule.controls['PERMISSION'] as FormArray).length) {
      (this.addModule.controls['PERMISSION'] as FormArray).removeAt(0)
    }
    this.addCheckBoxes();
  }


  submit(popup: HTMLElement) {
    // popup.classList.remove("show")
    // popup.classList.add("hide")
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Create module',
      Effect: 'Module created successfully',
      Status: 1,
    }
    const selectedPerms = this.addModule.value.PERMISSION.map((checked: boolean, i: number) =>
        checked ? this.permissionDetails.data[i].PER_ID : null
    ).filter((v: any) => v !== null);
    const perm = JSON.stringify(selectedPerms);
    this.addModule.patchValue({ PERMISSION_ID: selectedPerms });
    const data: any[] = this.addModule.value;

    if (this.isCreate) {
      this.userData.saveModule('createModule', data).subscribe((respArray) => {
        this.closebutton.nativeElement.click();
        alert('Module has been added');
        this.addModule.reset({ MODULE_NAME: '' })
        this.audit.addAudit('userAuditLog', payload).subscribe(
          respArray => {
            console.log(respArray)
          }
        )
      });
      if (this.addModule.value.MODULE_NAME != '' && this.addModule.value.PERMISSION != ''
      ) {
        this.closebutton.nativeElement.click();
        payload.Effect = "Module creation failed";
        payload.Status = 0;
        this.audit.addAudit('userAuditLog', payload).subscribe(
          respArray => {
            console.log(respArray)
          }
        )
      }
    }
    else {
      payload.Type = "Update module";
      payload.Effect = "Module updated successfully";
      this.userData.updateModule('updateModule', this.moduleId, this.moduleKey, data).subscribe((respArray: any) => {
        console.log("Response of updated module:: ", respArray)
        alert('Module has  been updated');
        this.addModule.reset({ MODULE_NAME: "", PERMISSION_ID: "", PERMISSION: '' })
        if (respArray.message.includes("sucess") || respArray.message.includes("success") ) {
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              this.closebutton.nativeElement.click();
              console.log(respArray)
            }
          )
        }
        else {
          payload.Effect = "Module updation failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log(respArray)
            }
          )
        }
      });
    }
    this.fetchModuleList();
  }

  selectSubordinatePermissions (permission_id: number, checkBoxField: HTMLInputElement) {
    console.log(permission_id);
    let subordinatePerId: any[] = [];
    this.userData.getSubordinatePermissions(permission_id).subscribe((res: SubordinatePermissionConfig) => {
      console.log(res);
      subordinatePerId = res.data;
    }, (err) => {
      console.log("error while fetching subordinate permissions: ", err);
    }, () => {
      console.log("Checkbox field state", checkBoxField.checked);
      if (checkBoxField.checked) {
        for (let i = 0; i < this.permissionDetails.data.length; i++) {
          const parent_permission_id = this.permissionDetails.data[i];
          for (let j = 0; j < subordinatePerId.length; j++) {
            const subordinatePermission = subordinatePerId[j];
            if (subordinatePermission.per_id === parent_permission_id.PER_ID) {
              this.permArray.at(i).patchValue(true);
            }
            // console.log(subordinatePermission.per_id, "===", parent_permission_id.PER_ID);          
          }
        }
      } else {
        for (let i = 0; i < this.permissionDetails.data.length; i++) {
          const parent_permission_id = this.permissionDetails.data[i];
          for (let j = 0; j < subordinatePerId.length; j++) {
            const subordinatePermission = subordinatePerId[j];
            if (subordinatePermission.per_id === parent_permission_id.PER_ID) {
              this.permArray.at(i).patchValue(false);
            }
            // console.log(subordinatePermission.per_id, "===", parent_permission_id.PER_ID);          
          }
        }
      }

    }); // end of complete http request
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }

  setpopupHeading(heading: string) {
    this.addModule.reset({ MODULE_NAME: "", PERMISSION_ID: "", PERMISSION: '' })
    this.popupHeading = heading;
  }


  enableCreateModule () {
    this.isCreate = true;
  }

}
