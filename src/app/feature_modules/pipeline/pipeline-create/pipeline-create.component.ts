import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModelListConfig } from 'src/app/data-models/model';
import { PipelineCreateResp, PipelineListConfig, PipelineRespData, PipelineTypeConfig, PipeModelTypeConfig, ProcessingTypeConfig } from 'src/app/data-models/pipeline-model';
import { ClassUiChangerService } from 'src/app/services/class-ui-changer.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';


@Component({
  selector: 'app-pipeline-create',
  templateUrl: './pipeline-create.component.html',
  styleUrls: ['./pipeline-create.component.css']

})
export class PipelineCreateComponent implements OnInit {

  pipeLineType!: PipelineTypeConfig;
  modelList!: ModelListConfig;
  processingTypeList!: ProcessingTypeConfig;
  pipelineResp!: PipelineCreateResp;
  pipeModeltype!: PipeModelTypeConfig;
  pipelineById!:PipelineListConfig;
  data:[] = [];
  isTracking:boolean= true;
  username!: string;
  value:number = 1;
  pipeId: number = 0;
  isCreate!: boolean;
  buttonvisible:boolean=false;
  constructor(
    private pipelineData: PipelineDataService,
    // private modelDataService: ModelDataService,
    // private classuichange: ClassUiChangerService,
    private getTk: GetTokenService,
    private route: ActivatedRoute,
    private graphService : GraphService,
    public audit: AuditTrailService

    ) { }



  ngOnInit(): void {
    this.pipeId = this.route.snapshot.params['id'];
    this.isCreate  = !this.pipeId;
    if(!this.isCreate){
      this. fetchPipeById(this.pipeId)
    }
   // this.setUrlData();
    this.getPipelineTypes();
    this.processingTypeData();
    this.getPipelineModelType();
    this.username = this.getTk.getUser_name();
    this.audit.addUrlAudit('userAuditLog');
    localStorage.removeItem('pmodeltyp');

  }

  public getPipelineTypes(){
    this.pipelineData.getPipelineTypeData('pipelineTypes')
    .subscribe(
      respArray => {
        this.pipeLineType = respArray;
        console.log(this.pipeLineType);

      }
    )
  }



  processingTypeData(){
    this.pipelineData.getProcessingTypeData('processing', 'ALL')
    .subscribe(
      respArray => {
            this.processingTypeList = respArray;
            console.log(this.processingTypeList.data);
      }
    )
  }

  addPipeline = new FormGroup({
    pipeline_name          : new FormControl('',Validators.required),
    processing_type_id     : new FormControl('',Validators.required),
    pipeline_type_id       : new FormControl('',Validators.required),
    pipeline_model_type_id : new FormControl('',Validators.required),
    skip_frames            : new FormControl(''),
    do_tracking            : new FormControl(''),
    created_by             : new FormControl(''),
    modified_by            : new FormControl('')
  })

  fetchPipeById(id:number){
    console.log(id)
    this.pipelineData.getPipelineData('pipeline', id,localStorage.getItem("uid")!)
   .subscribe(
     respArray => {
       this.pipelineById = respArray;
       this.addPipeline.addControl('pipeline_id', new FormControl(''))
       this.addPipeline.patchValue({
        pipeline_id               :  this.pipelineById.data[0].pipeline_id,
        pipeline_name             :  this.pipelineById.data[0].pipeline_name,
        processing_type_id        :  this.pipelineById.data[0].processing_type_id,
        pipeline_type_id          :  this.pipelineById.data[0].pipeline_type_id,
        pipeline_model_type_id    :  this.pipelineById.data[0].pipeline_model_type_id,
       // model_category_id :  this.modalListById.data[0].model_category_id,
        skip_frames               :  this.pipelineById.data[0].skip_frames,
        do_tracking               :  this.pipelineById.data[0].do_tracking,
        created_by                :  this.pipelineById.data[0].created_by,
        modified_by               :  this.username
      })
      this.value      = this.pipelineById.data[0].skip_frames;
      this.isTracking = Boolean(this.pipelineById.data[0].do_tracking);
     }

   )

 }

  pipelineCreateUpdate(){

    this.graphService.showLoader=true;
    if(this.addPipeline.invalid){
      return;
          }
     else{ 
    
    this.buttonvisible=true;

    this.addPipeline.value.do_tracking="true";
    this.data = this.addPipeline.value;
    const payload= {
      Id     : this.getTk.getUser_id(),
      Type   : 'Pipeline create',
      Effect : 'Pipeline created successfully',
      Status : 1,
    }

    if(this.isCreate){
    console.log(this.data)
    localStorage.setItem('pmodeltyp', this.addPipeline.value.pipeline_model_type_id.toString());

    this.pipelineData.savePipeline('createPipeline',this.data)
    .subscribe(
      respArray => {
        this.pipelineResp = respArray;
        console.log(this.pipelineResp);
        this.graphService.showLoader=false
        if(this.pipelineResp.data.pipeline_id != null){

             localStorage.setItem('pid', this.pipelineResp.data.pipeline_id.toString());
             alert("Pipeline Created:"+this.pipelineResp.message);
             this.audit.addAudit('userAuditLog',payload).subscribe(
              respArray=>{
                console.log(respArray)
              
              }
            )
        }
        else
        {
          payload.Effect="Pipeline creation failed";
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
    else{
      localStorage.setItem('pmodeltyp', this.addPipeline.value.pipeline_model_type_id.toString());
      payload.Type='Pipeline update';
      payload.Effect='Pipeline updated successfully';
      this.pipelineData.updatePipeline('updatePipeline',this.data)
      .subscribe(
        respArray => {
          this.pipelineResp = respArray;

          if(this.pipelineResp.data.pipeline_id != null){

               localStorage.setItem('pid', this.pipelineResp.data.pipeline_id.toString());
               alert(this.pipelineResp.message);
               this.audit.addAudit('userAuditLog',payload).subscribe(
                respArray=>{
                  console.log(respArray)
                }
              )
          }
          else
          {
            payload.Effect="Pipeline updation failed";
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
    console.log(this.data);
  }
  }

  tracking(){
      this.isTracking =! this.isTracking;
      this.addPipeline.patchValue({do_tracking: this.isTracking});
  }

  getPipelineModelType(){
    this.graphService.showLoader=true;

   this.pipelineData.getPipeModelType('pipelineModelType', 'all')
   .subscribe(
     respArray => {
       this.pipeModeltype = respArray;
       console.log(this.pipeModeltype);
      this.graphService.showLoader=false;

     }
   )
  }

  // checkDataAvaibility(){
  //   this.buttonvisible=false;
  //   console.log("cvgvfh",this.addPipeline.value.project_name)
  //   if(this.addPipeline.value.pipeline_name=='' || this.addPipeline.value.processing_type_id=='' 
  //   || this.addPipeline.value.pipeline_type_id=='' || this.addPipeline.value.pipeline_model_type_id=='' 
  //   || this.addPipeline.value.skip_frames==''  || this.addPipeline.value.do_tracking=='')
  //   {
  //     console.log("1")
  //   }
  //   else if(this.addPipeline.value.project_name!='' && this.addPipeline.value.project_type_id!='')
  //   {
  //     console.log("2")

  //   } 
  //   console.log("jkhdfhuidfhdfufhg",this.buttonvisible)
  // }

}
