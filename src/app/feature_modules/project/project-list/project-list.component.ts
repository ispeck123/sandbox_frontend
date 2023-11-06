import { Component, Inject, OnInit, OnDestroy, SecurityContext } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectDeployConfig, ProjectListConfig, ProjectTypeConfig } from 'src/app/data-models/project-model';
import { AddAuditConfig } from 'src/app/data-models/user.model';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GraphService } from 'src/app/services/graph.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { HttpClient } from '@angular/common/http';
import FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { GetTokenService } from 'src/app/services/get-token.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projectById!: ProjectListConfig;
  projectList!: ProjectListConfig;
  listdata: any;
  project_Id!: number;
  datetimestring:any;
  control!: boolean;
  projectDepData!: ProjectDeployConfig;
  private _apiSubscription!: Subscription;
  element!: boolean;
  Is_Canned_Check:any;
  role:any;
  useflowmode:any;
  projectid_model_verify:any;
  pId!:any;
  pro_id!: number;


  
  isButtonDisabled: boolean = true ;

  constructor(private projectData: ProjectDataService, public dialog: MatDialog,
    public audit: AuditTrailService,
    private graphService: GraphService, private tkService : GetTokenService, private router: Router, private deleteDialog: MatDialog,private sanitizer: DomSanitizer
  ) { }
  auditData!: AddAuditConfig;
  ngOnInit(): void {
    this.pId=localStorage.getItem("pro_id")
    this.role= localStorage.getItem("role");
    this.listdata = [];
    this.Is_Canned_Check=localStorage.getItem('cannedProject');
    this.useflowmode=localStorage.getItem('useflow');
    // alert(this.Is_Canned_Check);
   
;
    if(this.useflowmode=='useflow'){

      this.getuselist();
    }
    else{
      this.getProjects();
      this.audit.addUrlAudit('userAuditLog');
  
    }
    localStorage.removeItem("pr_id")
    
  }
getuselist(){
  this.projectData.viewUseProject("used/project/view",'all', localStorage.getItem("uid")!).subscribe(
    (resp: any) => {
     
      this.projectList=resp.response.projects;
      console.log('Success:', this.projectList);
     this.listdata = this.projectList;
     console.log("LIST",this.listdata)

      this.graphService.showLoader = false;
})
}
  getProjects() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.projectData.getProjectList('projects', 'all',localStorage.getItem("uid")!)
      .subscribe(respArray => {
       
        this.projectList=respArray;
        console.log("list....",this.projectList)
        if(respArray.length==0){
            alert("NO DATA FOUND !")
            this.graphService.showLoader = false;
        }
        else if (respArray.message == "Token invalid") {
          alert('API response failed');
          localStorage.removeItem("tk");
          localStorage.removeItem("uid");
          this.router.navigate(['/login']);
        }
        else {
          this.listdata = this.projectList.data;
          if(this.Is_Canned_Check=="canned")
          {
            console.log("Before Canned Array",this.listdata)
            this.listdata = this.listdata.filter((item: { is_canned: number; }) => item.is_canned === 1);
            console.log("After Canned Array",this.listdata)
          }
          else
          {
            this.listdata = this.listdata.filter((item: { is_canned: number; }) => item.is_canned === 0);
           
          }
        
          // this.projectList
          this.graphService.showLoader = false;
        }
      })
  }
  colorVariation(index: number) {
    return index % 10;
  }
  editflow(){
  localStorage.setItem('editflow','editflow')
  }
  createAvaterName(userName: string) {
    const name = userName.trim().split(' ');
    let avater: string;
    if (name.length > 1) {
      avater = name[0].substring(0, 1) + '' + name[1].substring(0, 1);
    } else {
      avater = userName.substring(0, 2);
    }
    return avater;
  }

  getProjectsById(id: number, checkVal: string) {
    this.projectData.getProjectList('projects', id,localStorage.getItem("uid")!)
      .subscribe(respArray => {
        this.projectById = respArray;
        console.log('m', respArray)
        if (!(checkVal != 'details'))
          this.dialogData(this.projectById, checkVal)
        else
          this.dialogData(id, checkVal)
      })
  }

  public projectId(id: number, bool: boolean) {
    
    return (this.element = false);
    this.project_Id = id;
    this.control = bool;
    
 
    }
  

  projectStartStop(pid: number) {
    if (this.control == false) {
      this.projectData.projectStart('projectExecuteStart', pid)
        .subscribe(respArray => {
          console.log(respArray)
        })
    }
    else {
      this.projectData.projectStop('projectExecuteStop', pid)
        .subscribe(respArray => {
          console.log(respArray)
        })
    }

  }


  dialogData(id: ProjectListConfig | number, val: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "100%";
    dialogConfig.maxWidth = "500px";
    dialogConfig.height = "80%";

    if (val == 'details') {
      dialogConfig.data = {
        projectData: id
      };
      return this.openDetailsDialog(dialogConfig);
    }
    else {
      dialogConfig.data = {
        projectId: id
      };
      return this.openEditDialog(dialogConfig);
    }

    return dialogConfig;
  }

  openDetailsDialog(dialogConfig: MatDialogConfig) {
    dialogConfig.panelClass = "projectDetailsDialog";

    this.dialog.open(ProjectDetails, dialogConfig);
  }
  openEditDialog(dialogConfig: any) {
    this.dialog.open(ProjectEdit, dialogConfig);
  }

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
  
          alert('An error occurred while fetching data from the API.');
        }
      );
   
  }


  downloadweightFile(project_id: number) {
    this.graphService.showLoader = true;
    this.projectData.weightFiledownload(project_id)
      .subscribe((resp:any) => {
  
        console.log("FILE",resp)
        // var blob=new Blob([resp],{type : mediaType});
        saveAs(resp,"project_"+project_id+"_weight.pt");
        this.graphService.showLoader = false;
      });
  }

  // use_project(project_id:any,userid:any){

  //   const jsonObject = {
  //     project_id: project_id,
  //     user_id: localStorage.getItem('uid'),
  //     // pipeline_id: localStorage.getItem('pipeline_id')
  //   };
  //   const jsonString = JSON.stringify(jsonObject);
  //   // console.log('JSON Object:', jsonString);
  //   this.projectData.createuseproject("used/project/create",jsonObject).subscribe((resp:any) => {

      
  //   });
  // }
  
  useProject(projectId: any, userId: string) {
   
    localStorage.setItem("useflow",'useflow');
    this.projectData.createUseProject("used/project/create",projectId, localStorage.getItem("uid")!).subscribe(
      (resp: any) => {
        console.log('Success:', resp); 
        sessionStorage.setItem('useflow_projectid',resp.response.project_id)
      },
      (error: any) => {
        console.error('Error:', error); 
      }
    );
   
    this.router.navigateByUrl('/project-datasource');
  }
  


  
  deletePopup (projectCard: HTMLElement) {
    const projectId = (<HTMLElement>projectCard).getAttribute("id");
    console.log(projectId, " is going to deleted...");
    let deleteDialog = this.deleteDialog.open(ProjectDeleteDialog, {
      data: projectId, 
      width: "450px",
    });
    
    deleteDialog.afterClosed().subscribe((res) => {
      if (res === "success") {
        this.ngOnInit();
      } else {
        console.log("project deletion had some problems...");
      }
    })
  }

  // ngOnDestroy(): void {
  //   this._apiSubscription.unsubscribe();
  // }
}


// Project Details dialog COMPONENT # # # # # # # # # # #  
@Component({
  selector: 'project-details',
  templateUrl: 'project-details.html',
  styleUrls: ['../deploy-project/deploy-project.component.css', './project-list.component.css']
})
export class ProjectDetails implements OnInit {
  projectList!: any;
  projectDataforUI: any;
  constructor(private dialogRef: MatDialogRef<ProjectDetails>, 
    @Inject(MAT_DIALOG_DATA) public data: ProjectListConfig, 
    private pipelineService: PipelineDataService) {
      
    }
    
    ngOnInit () {
      this.projectList = this.data;
      console.log("Prokect List::  ", this.projectList.projectData.data[0]);
      let projectData = this.projectList.projectData.data[0];
      this.projectDataforUI = projectData;
      if (projectData.pipeline_id !== null) {
        this.pipelineService.getPipelineData("pipeline", projectData.pipeline_id,localStorage.getItem("uid")!)
        .subscribe((res) => {
          projectData.pipeline_name = res.data[0].pipeline_name;
          projectData.processing_type_name = res.data[0].processing_type_name;
        }, (err) => {
          
        }, () => {
          this.projectDataforUI = projectData;
        })
      }

      if (!(projectData.source_ids.length <= 0)) {
        projectData.sources = new Array();
        for (let i = 0; i < projectData.source_ids.length; i++) {
          const source_id = projectData.source_ids[i];
          this.pipelineService.getSourceList("source", source_id,localStorage.getItem('uid')!).subscribe((res: any) => {
            // console.log("Data sources:: ", res);
            if (res.data !== null) {
              console.log("Data sources:: ", res.data);
              projectData.sources.push(res.data[0].source_name);
            }
          }, err => {

          }, () => {
            this.projectDataforUI = projectData;
          })
        }
      }
    
  }
}
// END Project Details dialog COMPONENT # # # # # # # # # # #  


@Component({
  selector: 'project-edit',
  templateUrl: 'project-edit.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectEdit {
  url: string = '';
  projectId!: any;
  constructor(private dialogRef: MatDialogRef<ProjectDetails>,

    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.projectId = data.projectId;
    this.url = `${'/project-edit'}/${this.projectId}`
  }
  close() {
    this.dialogRef.close();
  }
}


// Delete Dialog start # # # # # # #
@Component({
  selector: "delete-dialog", 
  templateUrl: "./delete-dialog.component.html",
})
export class ProjectDeleteDialog implements OnInit {
  constructor ( private dialogRef: MatDialogRef<ProjectDeleteDialog>, private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) public data: any, private projectDataService: ProjectDataService ) {
  }

  ngOnInit(): void {
      
  }

  deleteProject () {
    console.log(this.data);
    this.projectDataService.deleteProject(this.data).subscribe((res) => {
      console.log(res, "Response from delete project");
    }, err => {
      console.log("some error in deleting the project occurred...");
    }, () => {
      this.dialogRef.close("success");
    })
  }

  close () {
    this.dialogRef.close();
  }
}

// Delete Dialog  # # # # # # # END
