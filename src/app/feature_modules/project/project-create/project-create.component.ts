import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  private _apiSubscription!: Subscription;
  submitted = false;
  labelPosition: string = '';
  url: string = '';
  pipelineList!: PipelineListConfig;
  pipelinedata: any = [];
  username!: string;
  projectTypeList!: ProjectTypeConfig;
  projectResp!: ProjectCreateResp;
  data: [] = [];
  projectId: number = 0;
  isCreate!: boolean;
  projectById!: ProjectListConfig;
  buttondisable: boolean = true;
  buttonvisible: boolean = false;
  resprojectid: any;
  respipelineid: any;
  projecttype!: ProjectTypeConfig;
  modelsessionid: any;
  projectTypeSelected: boolean = false;
  filteredPipeline: any;
  isCreateMode!: boolean;
  isChecked: boolean = false;
  role: any;
  cannedCondition:boolean=false;
  projectType:any;



  constructor(
    private pipelineData: PipelineDataService,
    private projectData: ProjectDataService,
    private getToken: GetTokenService,
    private classChangeUi: ClassUiChangerService,
    public audit: AuditTrailService,
    private route: ActivatedRoute,
    private graphService: GraphService,
    private router: Router,
    private globalService: GlobalService


  ) { }


  ngOnInit(): void {

    this.role = localStorage.getItem("role");

    localStorage.removeItem('pr_id')
    // this.modelsessionid= localStorage.getItem("model_id");
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isCreateMode = false;
    } else {

      this.isCreateMode = true;
    }

    this.projectId = this.route.snapshot.params['id'];
    this.isCreate = !this.projectId;
    if (!this.isCreate) {
      this.getProjectsById(this.projectId)
      this.checkDataAvaibility();
    }

    this.getProjectType();
    // this.getPipeline();
    this.username = this.getToken.getUser_name();
    this.audit.addUrlAudit('userAuditLog');
  }



  checkDataAvaibility() {
    this.buttonvisible = false;
    if (this.addProject.value.project_name == '' || this.addProject.value.project_type_id == '') {
      console.log("1")
      this.buttondisable = true;
    }
    else if (this.addProject.value.project_name != '' && this.addProject.value.project_type_id != '') {
      console.log("2")

      this.buttondisable = false;
    }
   
  }

  getProjectType() {
    this.graphService.showLoader = true;
    this.projectData.projectTypeData('projectTypes').subscribe((respArray) => {
      this.projectTypeList = respArray;
      console.log("Project TYpe",this.projectTypeList)

      console.log("TYPE", this.projectTypeList);
      if (respArray.message === 'failed') {

        alert('API response failed');
      }

      this.graphService.showLoader = false;

    });
  }
  getPipeline() {
    this.graphService.showLoader = true;
    this.pipelineData.getPipelineData('pipeline', 'all', localStorage.getItem("uid")!)
      .subscribe(
        respArray => {
          console.log("pipeline project", respArray)
          this.pipelineList = respArray;
          console.log("pipeline list:", this.pipelineList);
          this.pipelinedata = this.pipelineList.data;
          console.log(this.pipelinedata);
          this.graphService.showLoader = false;

        });
  }


  addProject = new FormGroup({
    project_name: new FormControl('', Validators.required),
    project_type_id: new FormControl('', Validators.required),
    created_by: new FormControl(''),
    modified_by: new FormControl(''),
    pipeline_id: new FormControl('', Validators.required),
    is_canned: new FormControl('')
  });

  getProjectsById(id: number) {

    this._apiSubscription = this.projectData.getProjectList('projects', id, localStorage.getItem("uid")!)

      .subscribe(respArray => {

        this.projectById = respArray;
        this.addProject.addControl('project_id', new FormControl(''));
        this.addProject.patchValue({
          project_id: this.projectById.data[0].project_id,
          project_name: this.projectById.data[0].project_name,
          project_type_id: this.projectById.data[0].project_type_id,
          pipeline_id: this.projectById.data[0].pipeline_id,
          created_by: this.projectById.data[0].created_by,
          modified_by: this.username,
          is_canned: this.projectById.data[0].is_canned
        })

        localStorage.setItem('pr_id', (this.addProject.value.project_id).toString());
        this.isChecked = this.projectById.data[0].is_canned
      })
    return this.projectById;
  }

  onSubmit() {
    this.addProject.controls['is_canned'].setValue(this.isChecked);
    const addProject = this.addProject.value;
    console.log('Form Data:', addProject);
    if (this.isCreate)
      this.projectCreate();
    else
      this.projectUpdate();
  }


  projectCreate() {
    if (this.addProject.invalid) {
      return;
    }
    else {
      const payload = {
        Id: this.getToken.getUser_id(),
        Type: 'Project create',
        Effect: 'Project created successfully',
        Status: 1,
      }
      this.buttonvisible = true;
      // console.log(this.projectResp.data.project_id)
      // delete this.addProject.value.pipeline_id;
      console.log("Create project data to sent to server:: ", this.addProject.value);
      this.graphService.showLoader = true;
      this.projectData
        .createProjectData('createProject', this.addProject.value)
        .subscribe((respArray) => {
          this.projectResp = respArray;
          this.graphService.showLoader = false;
          if (this.projectResp.data.project_id != null) {
            this.resprojectid = this.projectResp.data.project_id,
              localStorage.setItem("pr_id", this.resprojectid);
            localStorage.setItem("pro_id", this.resprojectid);
            this.globalService.swalSuccess('Project Created');
            localStorage.setItem('tab', "tab".toString());
            this.router.navigateByUrl('/project-datasource');
            localStorage.setItem('pr_type', (this.addProject.get('project_type_id')?.value).toString());
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
              }
            )
          }
          else {
            this.globalService.swalError('Failed !');
            payload.Effect = "Project creation failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
              }
            )
          }
        });
    }

  }

  projectUpdate() {
    this.buttonvisible = true;

    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Project update',
      Effect: 'Project updated successfully',
      Status: 1,
    }
    this.projectData
      .updateProject('updateProject', this.addProject.value)
      .subscribe((respArray) => {
        this.projectResp = respArray;
        if (this.projectResp.data.project_id != null) {
          this.resprojectid = this.projectResp.data.project_id,
            localStorage.setItem("pr_id", this.resprojectid);
          localStorage.setItem("pro_id", this.resprojectid);
          this.globalService.swalSuccess('Project Updated Successful !');
          localStorage.setItem('tab', "tab".toString());
          this.router.navigateByUrl('/project-datasource');
          localStorage.setItem('pr_type', (this.addProject.get('project_type_id')?.value).toString());
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
            }
          )
        }
        else {
          this.globalService.swalSuccess('Failed !');
          payload.Effect = "Project creation failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
            }
          )
        }

      });
  }

  // getProTypeName(proTypeName: string) {
  //   alert(proTypeName)
  //   if(proTypeName=="Inference")
  //   {
  //     this.cannedCondition=true;
  //   }
  //   else
  //   {
  //     this.cannedCondition=false;
  //   }
  //   localStorage.setItem('proTypeName', proTypeName);
  //   if (this.addProject.value.project_name != '' && proTypeName != '') {
  //     this.buttondisable = false;
  //   }
  // }
  getPipeName(id: any) {
    localStorage.setItem("model_id", id);
    localStorage.setItem("pipeline_id", id);
  }
  setUrlData() {
    this.classChangeUi.setClassUi();
  }

  ngOnDestroy(): void {
    if (!this.isCreate) {
      this._apiSubscription.unsubscribe();
    }
  }
  getProjectTypeflag(id: any) {
    this._apiSubscription = this.projectData.getProjecttype('get_pipeline_by_type_id', id, localStorage.getItem('uid')!)
      .subscribe((respArray) => {
        this.projecttype = respArray;

      });
  }

  onProjectTypeChange(projectTypeId: any) {
    this._apiSubscription = this.projectData.getProjecttypebyId('projectTypedata', projectTypeId)
        .subscribe((respArray) => {
          this.projectType = respArray.response.projecttype[0].operation_type_name;
          if(this.projectType=="Inference")
          {
            this.cannedCondition=true;
          }
          else
          {
            this.cannedCondition=false;
          }
          localStorage.setItem('proTypeName', this.projectType);
          // if (this.addProject.value.project_name != '' && this.projectType != '') {
          //   this.buttondisable = false;
          // }
        });

    if (projectTypeId) {
      this._apiSubscription = this.projectData.getProjecttype('get_pipeline_by_type_id', projectTypeId, localStorage.getItem('uid')!)
        .subscribe((respArray) => {
          this.filteredPipeline = respArray.response.pipelines;
          console.log("ALL pipeline ", this.filteredPipeline)
        });

      this.projectTypeSelected = true;
    } else {
      this.projectTypeSelected = false;
      this.filteredPipeline = []; // Clear the pipeline data when no project type is selected
    }
  }


}
