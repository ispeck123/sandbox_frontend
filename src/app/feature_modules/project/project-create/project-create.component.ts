import { Component, OnInit,OnDestroy } from '@angular/core';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { PipelineListConfig } from 'src/app/data-models/pipeline-model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetTokenService } from 'src/app/services/get-token.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import {
  ProjectCreateResp,
  ProjectListConfig,
  ProjectTypeConfig,
} from 'src/app/data-models/project-model';
import { MatDialog } from '@angular/material/dialog';
import { ClassUiChangerService } from 'src/app/services/class-ui-changer.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GraphService } from 'src/app/services/graph.service';
 import {Subscription} from 'rxjs';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
})
export class ProjectCreateComponent implements OnInit,OnDestroy {
  private _apiSubscription! : Subscription;
  submitted = false;
  labelPosition: string = '';
  url: string = '';
  pipelineList!: PipelineListConfig;
  pipelinedata:any=[];
  username!: string;
  projectTypeList!: ProjectTypeConfig;
  projectResp!: ProjectCreateResp;
  data: [] = [];
  projectId: number = 0;
  isCreate!: boolean;
  projectById!: ProjectListConfig;
  buttondisable:boolean=true;
  buttonvisible:boolean=false;
  resprojectid:any;
  respipelineid:any;
  projecttype!: ProjectTypeConfig;
  

  constructor(
    private pipelineData: PipelineDataService,
    private projectData: ProjectDataService,
    private getToken: GetTokenService,
    private classChangeUi: ClassUiChangerService,
    public audit: AuditTrailService,
    private route: ActivatedRoute,
     private graphService : GraphService,
     private router: Router
     
  ) {}
  

  ngOnInit(): void {
    localStorage.removeItem('pr_id');

    this.projectId = this.route.snapshot.params['id'];
    this.isCreate  = !this.projectId;
    if(!this.isCreate){
      this.getProjectsById(this.projectId)
      this.checkDataAvaibility();
    }

    this.getProjectType();
    this.getPipeline();
    this.username = this.getToken.getUser_name();
    this.audit.addUrlAudit('userAuditLog');
  }


  checkDataAvaibility(){
    this.buttonvisible=false;
    console.log("cvgvfh",this.addProject.value.project_name)
    console.log("cvgvfh",this.buttondisable)
    if(this.addProject.value.project_name=='' || this.addProject.value.project_type_id=='')
    {
      console.log("1")
      this.buttondisable=true;
    }
    else if(this.addProject.value.project_name!='' && this.addProject.value.project_type_id!='')
    {
      console.log("2")

      this.buttondisable=false;
    } 
    console.log("jkhdfhuidfhdfufhg",this.buttonvisible)
  }

  getProjectType() {
    this.graphService.showLoader=true;
    this.projectData.projectTypeData('projectTypes').subscribe((respArray) => {
      this.projectTypeList = respArray;
      console.log(this.projectTypeList.data[0].project_type);

      this.graphService.showLoader=false;

    });
  }
   getPipeline() {
    this.graphService.showLoader=true;
    this.pipelineData.getPipelineData('pipeline', 'all')
    .subscribe(
      respArray => {
        this.pipelineList = respArray;
        console.log("pipeline list:",this.pipelineList);
        this.pipelinedata = this.pipelineList.data;
        console.log(this.pipelinedata);
        this.graphService.showLoader=false;

    });
  }


  addProject   = new FormGroup({
    project_name   : new FormControl('',Validators.required),
    project_type_id: new FormControl('',Validators.required),
    created_by     : new FormControl(''),
    modified_by    : new FormControl(''),
    pipeline_id    : new FormControl('',Validators.required)
  });

  getProjectsById(id:number){

    this._apiSubscription=this.projectData.getProjectList('projects', id)

    .subscribe( respArray => {

      this.projectById = respArray;
      this.addProject.addControl('project_id', new FormControl(''));
      this.addProject.patchValue({
        project_id      : this.projectById.data[0].project_id,
        project_name    : this.projectById.data[0].project_name,
        project_type_id : this.projectById.data[0].project_type_id,
        pipeline_id     : this.projectById.data[0].pipeline_id,
        created_by      : this.projectById.data[0].created_by,
        modified_by     : this.username

      })
      localStorage.setItem('pr_id', (this.addProject.value.project_id).toString());

    })
    return this.projectById;
}

  onSubmit(){

    if(this.isCreate)
      this.projectCreate();
    else
      this.projectUpdate();
  }

  projectCreate() {
    if(this.addProject.invalid){
return;
    }
    else{
      const payload= {
        Id     : this.getToken.getUser_id(),
        Type   : 'Project create',
        Effect : 'Project created successfully',
        Status : 1,
      }
      this.buttonvisible=true;
      // console.log(this.projectResp.data.project_id)
      // delete this.addProject.value.pipeline_id;
      console.log("Create project data to sent to server:: ", this.addProject.value)
      this.projectData
        .createProjectData('createProject', this.addProject.value)
        .subscribe((respArray) => {
          this.projectResp = respArray;
          console.log("project submited res",this.projectResp)
          if(this.projectResp.data.project_id != null) {
            this.resprojectid=this.projectResp.data.project_id,
            // this.respipelineid=this.projectResp.data.pipeline_id
            localStorage.setItem("pr_id",this.resprojectid);
            localStorage.setItem("pro_id",this.resprojectid);
            
            alert('Project Created');
            this.router.navigateByUrl('/project-datasource');
            // alert(localStorage.getItem("pr_id"))
            localStorage.setItem('pr_type', (this.addProject.get('project_type_id')?.value).toString());
            this.audit.addAudit('userAuditLog',payload).subscribe(
              respArray=>{
                console.log(respArray)
              }
            )
          }
          else{
            alert('Please Try again');
            payload.Effect="Project creation failed";
            payload.Status=0;
            this.audit.addAudit('userAuditLog',payload).subscribe(
              respArray=>{
                console.log(respArray)
              }
            )
          }
         // this.router.navigateByUrl('/project-list');
  
          console.log(respArray);
        });
    }
    
  }

  projectUpdate(){
    this.buttonvisible=true;

    const payload= {
      Id     : this.getToken.getUser_id(),
      Type   : 'Project update',
      Effect : 'Project updated successfully',
      Status : 1,
    }
    this.projectData
    .updateProject('updateProject', this.addProject.value)
    .subscribe((respArray) => {
      this.projectResp = respArray;
      if(this.projectResp.message == 'success' || this.projectResp.message == 'Success')
      {
        alert("Project Updated");
        this.audit.addAudit('userAuditLog',payload).subscribe(
          respArray=>{
            console.log(respArray)
          }
        )
      }
      else{
        alert('Please Try again')
        payload.Effect="Project update failed";
          payload.Status=0;
          // this.audit.addAudit('userAuditLog',payload).subscribe(
          //   respArray=>{
          //     console.log(respArray)
          //   }
          // )
      }
      
        // this.router.navigateByUrl('/project-list');
      console.log(respArray);
    });
  }

  getProTypeName(proTypeName: string) {
    // alert("latest"+ proTypeName)
    localStorage.setItem('proTypeName', proTypeName);
    if(this.addProject.value.project_name!='' && proTypeName!='')
    {
      this.buttondisable=false;
    } 
  }
  getPipeName(id:any) { 
    // localStorage.setItem('proTypeName', Name);
    localStorage.setItem("pipeline_id",id);

  }

  setUrlData() {
    this.classChangeUi.setClassUi();
  }
 
  ngOnDestroy():void{
    if(!this.isCreate){
      this._apiSubscription.unsubscribe();
    }
  }
  getProjectTypeflag(id:any){
    this._apiSubscription=this.projectData.getProjecttype('get_pipeline_by_type_id', id)
    .subscribe((respArray) => {
    this.projecttype = respArray;
   
    });
    }

}
