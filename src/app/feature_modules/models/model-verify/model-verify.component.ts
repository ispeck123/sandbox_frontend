import { Component, OnInit } from '@angular/core';
import { ModelVerifyConfig } from 'src/app/data-models/model';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ProjectListConfig } from 'src/app/data-models/project-model';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';

@Component({
  selector: 'app-model-verify',
  templateUrl: './model-verify.component.html',
  styleUrls: ['./model-verify.component.css']
})
export class ModelVerifyComponent implements OnInit {

  _apiSubscription!: Subscription;
  modalList!: any;
  pId!:any
  isModelVerified!: number;
  modelVerify!: ModelVerifyConfig;
  projectList!: ProjectListConfig;
  projectUIData!: any;
  constructor(private modelDataService: ModelDataService,private projectData: ProjectDataService,
    private graphService: GraphService, private getToken: GetTokenService, private pipelineService: PipelineDataService,
    public audit: AuditTrailService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pId=localStorage.getItem("pro_id")
    this.getProjectsById(this.pId);
    this.audit.addUrlAudit('userAuditLog');
  }

  getProjectsById(id:any){
    this._apiSubscription=this.projectData.getProjectList('projects', id)
    .subscribe( respArray => {
      this.projectList = respArray;
      this.projectUIData = respArray.data[0];

      if (this.projectUIData.pipeline_id !== null) {
        this.pipelineService.getPipelineData("pipeline", this.projectUIData.pipeline_id)
        .subscribe((res) => {
          this.projectUIData.pipeline_name = res.data[0].pipeline_name;
          this.projectUIData.processing_type_name = res.data[0].processing_type_name;
        }, (err) => {
          
        }, () => {
          // this.projectDataforUI = projectData;
        })
      }

      console.log('m',respArray)
      // if(!(checkVal != 'details'))
      //   this.dialogData(this.projectById, checkVal)
      // else
      // this.dialogData(id, checkVal)
    })
}

  getUI() {
    return localStorage.getItem("urlForClass")?.includes("edit") ? 'Update' : 'Create';
  }

  // verifyModel() {
  //   const payload = {
  //     Id: this.getToken.getUser_id(),
  //     Type: 'Model verification',
  //     Effect: 'Model verified successfully',
  //     Status: 1,
  //   }
    // this.modelDataService.verifyModel('modelVerify', parseInt(localStorage.getItem('mid')!))
    //   .subscribe(respArray => {
    //     this.modelVerify = respArray;
    //     console.log("response:: ", respArray);
    //     if (!respArray.message.includes("Fail")) {
    //       alert('Model Verification Was Successful');
          // this.router.navigate(["/", "model-list"]);
  //         this.audit.addAudit('userAuditLog', payload).subscribe(respArray => {
  //           console.log(respArray);
  //           this.ngOnInit();
  //         })
  //       }
  //       else {
  //         alert(respArray.message);
  //         // alert(this.modelVerify.message);
  //         payload.Effect = "Project Datasource creation Failed";
  //         payload.Status = 0;
  //         this.audit.addAudit('userAuditLog', payload).subscribe(
  //           respArray => {
  //             console.log(respArray)
  //           }
  //         )
  //       }
  //     })
  // }
  projectDeploy(pId:number){
    const payload= {
      Id     : this.getToken.getUser_id(),
      Type   : 'Deploy Project',
      Effect : 'Project deployed successfully',
      Status : 1,
    }

    this.modelDataService.projectDeploy('projectDeploy', parseInt(localStorage.getItem('pr_id')!))
    .subscribe((respArray:any) => {
      alert('ProjectDeploy')
      console.clear();
      console.log(respArray, respArray.data.msg);
      if(respArray.data.msg == 'Success') {
        this.audit.addAudit('userAuditLog',payload)
        .subscribe(respArray=>{
            console.log(respArray)
          })
          setTimeout(() => {
            this.router.navigateByUrl("/project-list");
          }, 5000);
      }
      else
      {
        alert(respArray.data.response.project_deploy.reason[0]);
        payload.Effect="Project deploy failed";
          payload.Status=0;
          this.audit.addAudit('userAuditLog',payload).subscribe(
            respArray=>{
              console.log(respArray)
            }
          )
      }
      // this.closebutton.nativeElement.click();
       //this.projectDepData = respArray;
       //alert(this.projectDepData.status)
    })
  }

}
