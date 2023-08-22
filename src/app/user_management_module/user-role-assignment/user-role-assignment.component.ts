import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AssignRolePer, RoleModelConfig, UserModelConfig } from 'src/app/data-models/user.model';
import { GraphService } from 'src/app/services/graph.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';

@Component({
  selector: 'app-user-role-assignment',
  templateUrl: './user-role-assignment.component.html',
  styleUrls: ['./user-role-assignment.component.css']
})
export class UserRoleAssignmentComponent implements OnInit {

  roleDetails!: RoleModelConfig;
  userDetails!: UserModelConfig;
  data: [] = [];
  role:string = 'role';
  roleResp!: AssignRolePer;

  constructor(private userData: UserDataService,
    private graphService : GraphService,
    public audit: AuditTrailService,
    private getToken: GetTokenService

    ) { }

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
    this.audit.addUrlAudit('userAuditLog');

  }

  public getRoles(){
    this.graphService.showLoader=true;

    this.userData.userRoleData('roles')
    .subscribe((respArray) =>
             {
               this.roleDetails = respArray;
               this.graphService.showLoader=false;

               console.log(respArray);
              }
      )

  }

  public getUsers(){
    this.userData.userListData('allUserList')
    .subscribe(
     respArray => {

         this.userDetails = respArray;
         console.log(this.userDetails)
      }
    )


  }

  addRole = new FormGroup({
    roleperid    : new FormControl(''),
    type         : new FormControl(''),
    userid      : new FormControl('')
  })

  assignRole(){
    const payload= {
      Id     : this.getToken.getUser_id(),
      Type   : 'Assign user role',
      Effect : 'User role assigned successfully',
      Status : 1,
    }
    this.data = this.addRole.value;
    console.log("Assigning User Role:: ", this.data);
    this.userData.saveRolePer('assignUserRoleOrPermission',this.data)
    .subscribe(
      respArray => {
        this.roleResp = respArray;
        alert('Role successfully added');
        if(this.roleResp.message=="Permission assigned successfully"){
          this.audit.addAudit('userAuditLog',payload).subscribe(
            respArray=>{
              console.log(respArray)
            }
          )
        }
        else
        {
          payload.Effect="User role assignment failed";
          payload.Status=0;
          this.audit.addAudit('userAuditLog',payload).subscribe(
            respArray=>{
              console.log(respArray)
            }
          )
        }
      }
    )
    console.log(this.data);
  }


}
