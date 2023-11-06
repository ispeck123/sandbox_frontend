import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ModelListConfig, ModelListData } from 'src/app/data-models/model';
import { AttachModelResp, AttachModelRespConfig } from 'src/app/data-models/pipeline-model';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GetTokenService } from 'src/app/services/get-token.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-models',
  templateUrl: './add-models.component.html',
  styleUrls: ['./add-models.component.css']
})
export class AddModelsComponent implements OnInit, OnDestroy {
  @ViewChild('deleteModal') private deleteModal!: ElementRef;

  modelList!: any;
  attachModelResp!: AttachModelRespConfig;
  private _apiSubscription!: Subscription;
  modeltyp: any = [];
  count: number = 0;
  modellist: any = [];
  pipeId: number = 0;
  // Employee = Array<{ id: number; name: string }>;
  modelid: any;
  addmodel: boolean = false;
  buttonvisibles: boolean = false;
  isCreate!: boolean;
  items!: FormArray;
  deletableModelId!: number;
  submitVisible:boolean=false;
  

  deleteModalClickListenerSubscriber!: any;
  modelListByPipeline: ModelListData[] = [];


  constructor(private modelDataService: ModelDataService, private pipeDataService: PipelineDataService,
    public audit: AuditTrailService, private graphService: GraphService, private getToken: GetTokenService, private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef, private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.fetchModelListData();
    this.audit.addUrlAudit('userAuditLog');
    this.modelid = localStorage.getItem('pmodeltyp');
    this.checkModelType(this.modelid);
    this.pipeId = this.route.snapshot.params['id'];
    this.getModelByPipeline();
    // this.modelListByPipeline[0].model_id

    this.isCreate = !this.pipeId;
    if (!this.isCreate) {
      this.fetchPipeById(this.pipeId)
    }
    localStorage.removeItem('pmodeleditid');
  }

  fetchPipeById(id: number) {
    console.log(id)
    this.pipeDataService.getPipelineData('pipeline', id,localStorage.getItem("uid")!)
      .subscribe(
        respArray => {
        }

      )

  }
  checkModelType(id: any) {
    this.pipeDataService.getPipeModelType('pipelineModelType', id).subscribe(
      respArray => {
        this.modeltyp = respArray.data;
        console.log("Model Type:: ", respArray)

        if (this.modeltyp.pipeline_model_type_name == "Composite" || this.modeltyp.pipeline_model_type_name == "Ensemble") {
          this.addmodel = true;
        }

      }
    )
  }

  attachModel = this.formBuilder.group({
    pipeline_id: new FormControl(),
    model_id: new FormArray([]),
    model_ids: new FormControl()
  });

  fetchModelListData() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.modelDataService.getRigisterModelList('registered/model/view/', 'all',localStorage.getItem('uid')!)
      .subscribe(
        respArray => {
          this.modelList = respArray.response;
          console.log('MODEL_LIST', this.modelList);
          this.graphService.showLoader = false;

        }
      )
  }


  addModelToList() {
    this.count = 0;
    console.log(this.attachModel.value.model_ids)
    if (this.attachModel.value.model_ids == null) {
      alert("Please select model");
      console.log("in attatch MOdel to list:: ", this.attachModel.value);
    } else {
      console.log("in attatch MOdel to list:: ", this.attachModel.value);

      // @ Checking if model already been attatched
      let selectedModel = this.attachModel.get('model_ids');
      console.clear();
      console.log("selected model id:: ", selectedModel?.value, this.modelListByPipeline);
      if (this.modelListByPipeline) {
        for (let i = 0; i < this.modelListByPipeline.length; i++) {
          const model = this.modelListByPipeline[i];
          console.log("mdoel.model_id === selectedModel.value", model.model_id, selectedModel?.value);
          if (model.model_id === selectedModel?.value) {
            alert("Model already exist!");
            this.count = 1;
            break;
          } else {
            this.count = 0;
          }
        }
      }

      // @ Checking if model already been selected
      for (let i = 0; i < this.attachModel.value.model_id.length; i++) {
        // console.log(this.attachModel.value.model_id[i]);
        if (this.attachModel.value.model_ids == this.attachModel.value.model_id[i]) {
          this.count = 1;
          alert("Already added");
          console.log("going to break out of loop")
        }
      }

      if (this.count == 0) {
        this.items = this.attachModel.get('model_id') as FormArray;
        console.log(this.items);
        this.showSelectedList(this.attachModel.value.model_ids);
        this.items.push(this.createItem(this.attachModel.value.model_ids));
        console.log(this.attachModel.value);
        console.log(this.attachModel);
        alert(this.attachModel.value.model_id + " Data added");
      }

    }
    this.attachModel.value.model_ids = "";

  }

  createItem(e: any): FormControl {
    return this.formBuilder.control(e)
  }

  showSelectedList(id: any) {
    alert("Hit")
    this.modelDataService.getRigisterModelList('registered/model/view/', 'all',localStorage.getItem('uid')!).subscribe(
      respArray => {
        let value = respArray.response;
        this.modellist.push(value[0].model_name);
        console.log(this.modellist);
      }
    )
  }

  addModel() {
    // this.buttonvisibles = true;
    const payload = {
      Id: this.getToken.getUser_id(),
      Type: 'Pipeline model create',
      Effect: 'Pipeline model created successfully',
      Status: 1,
    }

    let data: [] = [];
    console.log("pipeline id", localStorage.getItem('pid'))
    if (!this.addmodel) {
      console.clear();
      this.attachModel.patchValue({ pipeline_id: (parseInt(localStorage.getItem('pid')!)) });
      this.attachModel.value.model_id.push(this.attachModel.value.model_ids);
      data = this.attachModel.value;
      console.log("single model type:: attatch: ", data);
    } else {
      this.attachModel.patchValue({ pipeline_id: (parseInt(localStorage.getItem('pid')!)) });
      delete this.attachModel.value.model_ids;
      data = this.attachModel.value;
      console.log("Newly: Attatched Models:: ", data)
    }
    if (this.modelListByPipeline) {
      let datatoBeSent = JSON.parse(JSON.stringify({ 'pipeline_id': this.attachModel.value.pipeline_id.toString(), 'model_id': this.attachModel.value.model_id}));

      console.log("Typeof :: ", typeof datatoBeSent.pipeline_id);
      console.log("update Add Model API is being called here...");
      console.log("Data to be sent:: ", datatoBeSent);
      this.pipeDataService.updatePipelineModel(datatoBeSent).subscribe((res) => {
        console.log("attached more models:: ", res);
      }, err => {
        console.log("while attaching more model error occurred", err);
      }, () => {
        console.log("Request Complete");
        alert("Model Updated");
            this.router.navigateByUrl('/pipeline');
      })
    } else {
      console.log("hmm, first time, Attach Model API is being called here");
      this.pipeDataService.saveAttachedModel('pipelineAttachModel', data)
        .subscribe(respArray => {
          console.log("is multiple model:: ", this.addmodel, respArray)
          this.attachModelResp = respArray;
          this.getModelByPipeline(); // rerendering of of attatched models
          this.modellist = []; // for disappering newly attatched model from UI 
  
          if (this.attachModelResp.message == "success" || this.attachModelResp.message == "Success") {
            alert("Model Attached");
            this.router.navigateByUrl('/pipeline');
            // this.audit.addAudit('userAuditLog', payload).subscribe(
            //   respArray => {
            //     console.log(respArray)
            //   }
            // )
          }
          else {
            alert("Failed to attach model");
            payload.Effect = "Pipeline model attachment failed";
            payload.Status = 0;
            this.audit.addAudit('userAuditLog', payload).subscribe(
              respArray => {
                console.log(respArray)
              }
            )
          }
        });
    }
  }

  removeModel(i: any) {
    console.log(i)
    this.items.removeAt(i);
    // delete this.modellist[i];
    this.modellist.splice(i, 1);
    console.log(this.items);
  }
  editmodel(id: any) {
    console.log(id)
    let url = `${'/modal-edit'}/${id}`
    localStorage.setItem('pmodeleditid', id);
    this.router.navigateByUrl(url);
 }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }

  // getModelByPipeline() {
  //   alert('ssssssssssss')
  //   console.log("Pipeline Id:: ", localStorage.getItem('pid'));
  //   this.pipeDataService.getPipeModelList("registered/model/view", localStorage.getItem('pid')!)
  //     .subscribe((res: ModelListConfig) => {
  //       this.modelListByPipeline = res.data;
  //       console.log("model by pipeline", this.modelListByPipeline);
      
  //     })
  // }
  getModelByPipeline() {
    console.log("Pipeline Id:: ", localStorage.getItem('pid'));
    this.pipeDataService.getPipeModelList("modelByPipeline", localStorage.getItem('pid')!)
      .subscribe((res: ModelListConfig) => {
        this.modelListByPipeline = res.data;
        console.log("model by pipeline", res);
      })
  }

  openDeleteDialog(modelId: number, modelName: string) {
    let dialogBox = this.deleteModal.nativeElement;
    dialogBox.classList.add("show");
    dialogBox.setAttribute("data-modelId", modelId);
    this.deletableModelId = modelId;
    // dialogBox.querySelector(".modal-body").textContent = `| ${modelId} |  ${modelName}`;
    this.deleteModalClickListenerSubscriber = dialogBox.querySelector(".deleteBtn").addEventListener("click", this.deleteButtonHandler);
  }

  deleteButtonHandler = (e: MouseEvent) => {
    console.log("delete model from pipeline", this.deletableModelId);
    let dialogBox = this.deleteModal.nativeElement;
    dialogBox.classList.remove("show");
    setTimeout(() => {
      this.deleteModelFromPipeline(this.deletableModelId);
    }, 100);
  
  }

  closeDeleteDialog() {
    let dialogBox = this.deleteModal.nativeElement;
    dialogBox.classList.remove("show");
    dialogBox.querySelector(".deleteBtn").removeEventListener("click", this.deleteButtonHandler);
  }

  deleteModelFromPipeline(modelId: number) {
    console.log(modelId);
    this.pipeDataService.deleteModelFromPipeline("deleteModelFromPipeline", modelId, localStorage.getItem("pid")!)
      .subscribe((res: any) => {
        if (res.message === "success") {
          this.audit.addAudit("userAuditLog", {
            Id: this.getToken.getUser_id(),
            Type: "Pipeline Model Edit",
            Effect: "Model Deleted from pipeline successfully",
            Status: 0,
          }).subscribe(res => {
            console.log("AUDIT::SERVER:Success:  ", res);
          });

          this.ngOnInit();

        } else {
          this.audit.addAudit("userAuditLog", {
            Id: this.getToken.getUser_id(),
            Type: "Pipeline Model Edit",
            Effect: "Model Deletion from pipeline Failed",
            Status: 1,
          }).subscribe((res) => {
            console.log("AUDIT::SERVER:Error: ", res);
          })
        }
        console.log("model deleted from pipeline", res);
      }, (err) => {
        console.log("error in delete model from pipline", err);
   
      });
      window.location.reload();
  }
  modelSelection(id:any)
  {
    if(id)
    {
      this.submitVisible=true;
    }
    else{
      this.submitVisible=false;
    }
  }
}
