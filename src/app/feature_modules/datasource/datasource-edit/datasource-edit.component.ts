import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { GraphService } from 'src/app/services/graph.service';
import {Subscription} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datasource-edit',
  templateUrl: './datasource-edit.component.html',
  styleUrls: ['./datasource-edit.component.css']
})
export class DatasourceEditComponent implements OnInit,OnDestroy {
  private _apiSubscription! : Subscription;
  sourceFileList: any=[];
  sourceLocation: any=[];
  processingTypeList: any=[];
  projectlist: any=[];
  areaList: any=[];
  source_id:any;
  username:any;
  sourcedata:any=[];
  datas:[] = [];

  constructor(public audit: AuditTrailService, private getToken: GetTokenService,private route: ActivatedRoute,
    public pipeline: PipelineDataService,private projectService : ProjectDataService, private router: Router,
    private graphService : GraphService) { }
    editDatasource   = new FormGroup({
      source_name            : new FormControl('',),
      area_id                : new FormControl('',) ,
      fps                    : new FormControl('',),
      process_type           : new FormControl('',),
      project_id            : new FormControl(''),
      source_stored_location_id : new FormControl('',),
      created_by             : new FormControl('',),
      modified_by            : new FormControl('',),
      description            : new FormControl('',)
  
    })
  ngOnInit(): void {
    this.source_id = this.route.snapshot.params['id'];
    console.log(this.source_id);

    this.audit.addUrlAudit('userAuditLog');
    this.fetchSourceData();
    this.processingTypeData();
    this.fetchArealist();
    this.fetchSouceLocationList();
    this.fetchProjectList();
    this.username = this.getToken.getUser_name();
  }
  fetchSourceData(){
    this.graphService.showLoader=true;
    this._apiSubscription =this.projectService.sourceFileList('sourceFileList',this.source_id)
    .subscribe(
      respArray => {
        this.sourceFileList = respArray;
        console.log(respArray);
         this.editDatasource.addControl('source_id', new FormControl(''));
      this.editDatasource.patchValue({
        source_id        : this.sourceFileList.data[0].source_id,
        source_name      : this.sourceFileList.data[0].source_name,
        area_id          : this.sourceFileList.data[0].area_id,
        project_id          : this.sourceFileList.data[0].project_id,
        process_type     : this.sourceFileList.data[0].process_type,
        fps              : this.sourceFileList.data[0].fps,
        source_stored_location_id     : this.sourceFileList.data[0].source_stored_location_id,
        description      : this.sourceFileList.data[0].description,
        modified_by      :  this.username,
        created_by       :  this.sourceFileList.data[0].created_by,
      })
        this.graphService.showLoader=false;

      }
    )
  }
  
  fetchProjectList(){
    this.graphService.showLoader=true;
     this.projectService.getProjectList('projects', 'all',localStorage.getItem("uid")!)
     .subscribe(
      respArray => {
        this.projectlist = respArray;
        console.log(this.projectlist)
        this.graphService.showLoader=false;
      }
     )
  }
  onSubmit(){
    console.log(this.editDatasource.value)
    const payload= {
      Id     : this.getToken.getUser_id(),
      Type   : 'Edit Project Datasource',
      Effect : 'Project Datasource Updated Successfully',
      Status : 1,
    }

    this.datas = this.editDatasource.value;
    this.pipeline.updateSource('updateSource',this.datas).subscribe(
      respArray => {
        this.sourcedata = respArray;
        console.log(this.sourcedata)

        if(this.sourcedata.message=='success' || this.sourcedata.message=='Success')
        {
          this.audit.addAudit('userAuditLog',payload).subscribe(
            respArray=>{
              console.log(respArray)
            }
          )
          alert("Datasource updated successfully!");
          this.router.navigateByUrl('/project-datasource');
        }
        else
        {
          payload.Effect="Project Datasource creation Failed";
          payload.Status=0;
          this.audit.addAudit('userAuditLog',payload).subscribe(
            respArray=>{
              console.log(respArray)
            }
          )
        }

      }
    )
  }
  fetchSouceLocationList(){
    this.graphService.showLoader=true;
     this.projectService.getSourceLocation('sourceLocationType', 'all')
     .subscribe(
      respArray => {
        this.sourceLocation = respArray;
        console.log(this.sourceLocation)
        this.graphService.showLoader=false;
      }
     )
  }

  fetchArealist(){
    this.pipeline.getAreaList('area','all')
    .subscribe(
      respArray => {
        this.areaList = respArray;
        console.log(respArray);
      }
    )
  }

  processingTypeData(){
  this.pipeline.getProcessingTypeData('processing', 'ALL')
  .subscribe(
    respArray => {
          this.processingTypeList = respArray;
          console.log(this.processingTypeList.data);
    }
  )
  }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}
