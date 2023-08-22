import { Component, OnInit } from '@angular/core';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { GraphService } from 'src/app/services/graph.service';
import { Router } from '@angular/router';
import { ModelListData } from 'src/app/data-models/model';

@Component({
  selector: 'app-save-pipeline',
  templateUrl: './save-pipeline.component.html',
  styleUrls: ['./save-pipeline.component.css','../../project/deploy-project/deploy-project.component.css']
})
export class SavePipelineComponent implements OnInit {
  pipeline_id:any;
  pipelinedata:any=[];
  modelListByPipeline!: ModelListData[];
  constructor(public audit: AuditTrailService,private pipelineData: PipelineDataService,private router: Router,
    private graphService : GraphService) { }

  ngOnInit(): void {
    this.audit.addUrlAudit('userAuditLog');
    this.pipeline_id = localStorage.getItem('pid');
    this.getPipelinedata(this.pipeline_id);
    this.pipelineData.getPipeModelList("modelByPipeline", localStorage.getItem("pid")!)
    .subscribe((res) => {
      console.log("Model ist :: ", res);
      this.modelListByPipeline = res.data;
    })
  }
  
  getPipelinedata(id:any){
    this.pipelineData.getPipelineData('pipeline', id).subscribe(
      respArray=>{
        this.pipelinedata=respArray.data;
        console.log("Pipeline Data",this.pipelinedata);
        if(this.pipelinedata==null)
        console.log(respArray);
      }
    )
  }
  savepipeline(){
    alert("Pipeline Saved");
    this.router.navigateByUrl('/pipeline');

  }
}
