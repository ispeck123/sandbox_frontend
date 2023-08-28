import { Component, OnInit,OnDestroy } from '@angular/core';
import { PipelineListConfig } from 'src/app/data-models/pipeline-model';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import {Subscription} from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { Router } from '@angular/router';
// import { pipeline } from 'stream';


@Component({
  selector: 'app-select-model-pipeline',
  templateUrl: './select-model-pipeline.component.html',
  styleUrls: ['./select-model-pipeline.component.css']
})
export class SelectModelPipelineComponent implements OnInit,OnDestroy {
  pipeline_id: any;

  constructor( private pipelineData: PipelineDataService,public audit: AuditTrailService,private router: Router,
    private projectData: ProjectDataService) { }
  pipelineList!: any;
  private _apiSubscription! : Subscription;
    dropvalidate:boolean = false;
    modelsessionid:any;

  ngOnInit(): void {
   
    if(localStorage.getItem('pr_id')){

      console.log(localStorage.getItem('pr_id'))
      this.getProjectPipeline(localStorage.getItem('pr_id')) 
    }
     this.getPipelineList();
    this.audit.addUrlAudit('userAuditLog');
  }

  getProjectPipeline(id:any){
    this.projectData.getProjectList('projects', id)
    .subscribe(respArray => {
      console.log(respArray.data[0].pipeline_id)   
      this.pipeline_id = respArray.data[0].pipeline_id;
    })

  }
  public getPipelineList() {
    this._apiSubscription=this.pipelineData
      .getPipelineData('pipeline', 'all')
      .subscribe((respArray) => {
        this.pipelineList = respArray.data;
        console.log("PIPELINE LIST",this.pipelineList);
      });
  }

  routeNext(id:any){

  if(this.pipeline_id==null || this.pipeline_id=='undefined')
  {
    this.dropvalidate=true;
  return;
  }
  else{
    this.dropvalidate=false;
    localStorage.setItem('model_id',id);
    this.router.navigateByUrl('/config-model')
  }
   
  }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
  // getpipeline(){
  //   localStorage.setItem('pipeline_id_session',this.pipeline_id)
  //   var pipe=localStorage.getItem('pipeline_id_session')
  //   alert(pipe)

  // }
  getmodelid(id:any){
    alert(id)
    if(id)
    {
      this.dropvalidate=false;
    }
    localStorage.setItem("model_id",id);
    this.modelsessionid= localStorage.getItem("model_id")
    alert(this.modelsessionid)
   
  }
}
