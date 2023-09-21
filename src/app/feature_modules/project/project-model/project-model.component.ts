import { Component, OnInit,OnDestroy } from '@angular/core';
import { AlgoListConfig, FrameworkData, FrameworkListConfig, ModelListConfig, ModelListData } from 'src/app/data-models/model';
import { ModelDataService } from 'src/app/services/model-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-project-model',
  templateUrl: './project-model.component.html',
  styleUrls: ['./project-model.component.css']
})
export class ProjectModelComponent implements OnInit,OnDestroy {

  constructor(private modelDataService: ModelDataService,public audit: AuditTrailService) { }

  modelList!: ModelListConfig;
  framework!: FrameworkListConfig;
  algoData !:AlgoListConfig;
  individualModel!: ModelListConfig;
  private _apiSubscription! : Subscription;

  ngOnInit(): void {
    this.fetchModelListData();
    this.audit.addUrlAudit('userAuditLog');

  }

  fetchModelListData(){
    this._apiSubscription=this.modelDataService.getModelListData('model', 'ALL',localStorage.getItem('uid')!)
    .subscribe(
      respArray => {
            this.modelList = respArray;
            console.log(this.modelList.data);
      }
    )
  }

  modelSelect(algo_id:number | undefined, framework_id:number, model_id:number, event: any){
    if(event.isUserInput){
     this.fetchFrameworkByID(framework_id);
     this.fetchAlgoByID(algo_id);
     this.fetchModelByID(model_id);
     console.log(model_id)
    }

  }

  fetchFrameworkByID(framework_id:number){
    this.modelDataService.getFrameworkByID('framework', framework_id)
    .subscribe(
      respArray => {
            this.framework = respArray;
            console.log(this.framework.data);

      }
    )
  }

  fetchAlgoByID(algo_id:number | undefined){
    this.modelDataService.getAlgoByID('algorithm', algo_id)
    .subscribe(
      respArray => {
            this.algoData = respArray;
            console.log(this.framework.data);

      }
    )
  }

  fetchModelByID(model_id:number){
    this.modelDataService.getModelListData('model', model_id,localStorage.getItem('uid')!)
    .subscribe(
      respArray => {
            this.individualModel = respArray;
            console.log(this.individualModel.data);

      }
    )
  }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}


