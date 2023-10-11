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
  pro_id!: number;
  constructor(private modelDataService: ModelDataService,private projectData: ProjectDataService,
    private graphService: GraphService, private getToken: GetTokenService, private pipelineService: PipelineDataService,
    public audit: AuditTrailService, 
    private router: Router, private tkService : GetTokenService,
  ) { }

  ngOnInit(): void {
    this.pId=localStorage.getItem("pro_id")
    // alert(this.pId)
     this.getProjectsById(this.pId);
     this.audit.addUrlAudit('userAuditLog');
  }

  getProjectsById(id:any){
    this._apiSubscription=this.projectData.getProjectList('projects', id,localStorage.getItem("uid")!)
    .subscribe( respArray => {
      this.projectList = respArray;
      this.projectUIData = respArray.data[0];

      if (this.projectUIData.pipeline_id !== null) {
        this.pipelineService.getPipelineData("pipeline", this.projectUIData.pipeline_id,localStorage.getItem("uid")!)
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
  projectDeploy(id: number) {
    const payload= {
            Id     : this.tkService.getUser_id(),
            Type   : 'Deploy Project',
            Effect : 'Project deployed successfully',
            Status : 1,
          }
    const projectId = localStorage.getItem('pro_id');
    
    if (!projectId) {
      console.log('Project ID not available.');
      return;
    }
   this.graphService.showLoader=true;
    this._apiSubscription = this.projectData.projectDeploy(projectId,localStorage.getItem('uid')!)
    .subscribe(
      respArray => {
        console.log('Project deploy response:', respArray);
      this.graphService.showLoader=false;
        if (respArray.response.project_deploy.inference_url) {
          const sanitizedURL = encodeURI(respArray.response.project_deploy.inference_url);
          const newWindow = window.open(sanitizedURL, '_blank');
          this.router.navigateByUrl("/project-list");
      
          if (newWindow) {

           
          } else {
            
          }
        }
  
        // if (respArray.response.project_deploy.inference_url) {
        //   // Show an alert with the inference URL
        //   alert(respArray.response.project_deploy.inference_url);
  
        //   // Open the URL in a new window
        //   window.open(respArray.response.project_deploy.inference_url, '_blank');
        // }
  
        // if (respArray.msg == 'Success') {
        //   this.audit.addAudit('userAuditLog', payload)
        //     .subscribe(auditResponse => {
        //       console.log('Audit response:', auditResponse);
        //       // Further handling if needed
        //     });
        // } 
        else {
          if (respArray.response.project_deploy.reason[0]) {
            alert(respArray.response.project_deploy.reason[0]);
          }
  
          payload.Effect = "Project deploy failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload)
            .subscribe(auditResponse => {
              console.log('Audit response:', auditResponse);
              // Further handling if needed
            });
        }
  
        // Handle other parts of the response here if necessary
      },
      error => {
        console.error('Error during project deploy:', error);
        // Handle the error here
      }
    );
  
  }

}
