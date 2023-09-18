import { Component, OnInit, ViewChild,OnDestroy } from '@angular/core';
import { ProjectDeployConfig, ProjectListConfig } from 'src/app/data-models/project-model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import {Subscription} from 'rxjs';
import { Router } from '@angular/router';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-deploy-project',
  templateUrl: './deploy-project.component.html',
  styleUrls: ['./deploy-project.component.css']
})
export class DeployProjectComponent implements OnInit ,OnDestroy{
  @ViewChild('closebutton') closebutton!: { nativeElement: { click: () => void; }; };

  projectDepData!: ProjectDeployConfig;
  projectList!: ProjectListConfig;
  projectUIData!: any;
  pId!: any;
  private _apiSubscription! : Subscription;
item: any;
projectId!: number;
pro_id!: number;

  constructor(private projectData: ProjectDataService, 
    private tkService : GetTokenService,
    public audit: AuditTrailService, 
    private router: Router, private pipelineService: PipelineDataService,  private graphService : GraphService,) { }

  ngOnInit(): void {
    //  this.pId = this.tkService.getProjectId();
    this.pId=localStorage.getItem("pro_id")
    // alert(this.pId)
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

//   projectDeploy(id:number){
//     const payload= {
//       Id     : this.tkService.getUser_id(),
//       Type   : 'Deploy Project',
//       Effect : 'Project deployed successfully',
//       Status : 1,
//     }

//     this.projectData.projectDeploy('projectDeploy', localStorage.getItem("pr_id")!)
//     .subscribe((respArray:any) => {
//       alert('ProjectDeploy')
//       console.clear();
//       console.log(respArray, respArray.data.msg);
//       if(respArray.data.msg == 'Success') {
//         this.audit.addAudit('userAuditLog',payload)
//         .subscribe(respArray=>{
//             console.log(respArray)
//           })
//           setTimeout(() => {
//             this.router.navigateByUrl("/project-list");
//           }, 5000);
//       }
//       else
//       {
//         alert(respArray.data.response.project_deploy.reason[0]);
//         payload.Effect="Project deploy failed";
//           payload.Status=0;
//           this.audit.addAudit('userAuditLog',payload).subscribe(
//             respArray=>{
//               console.log(respArray)
//             }
//           )
//       }
//       // this.closebutton.nativeElement.click();
//        //this.projectDepData = respArray;
//        //alert(this.projectDepData.status)
//     })
//   }

//   ngOnDestroy() {
//     this._apiSubscription.unsubscribe();
//   }

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
  this._apiSubscription = this.projectData.projectDeploy(projectId)
    .subscribe(
      respArray => {
        console.log('Project deploy response:', respArray);
        this.graphService.showLoader=false;
        if (respArray.response.project_deploy.mlflow_url) {
          const sanitizedURL = encodeURI(respArray.response.project_deploy.mlflow_url);
          const newWindow = window.open(sanitizedURL, '_blank');
          this.router.navigateByUrl("/project-list");
      
          if (newWindow) {

           
          } else {
            
          }
        }
        if(respArray.data.msg == 'Success') {
                  this.audit.addAudit('userAuditLog',payload)
                  .subscribe(respArray=>{
                      console.log(respArray)
                     
                    })
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
        // Handle the response here
      },
      error => {
        console.error('Error during project deploy:', error);
        // Handle the error here
      }
    );
 
}

ngOnDestroy() {
  if (this._apiSubscription) {
    this._apiSubscription.unsubscribe();
  }
}
}
