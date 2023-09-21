import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModelListConfig } from 'src/app/data-models/model';
import { GetTokenService } from 'src/app/services/get-token.service';
import { GraphService } from 'src/app/services/graph.service';
import { ModelDataService } from 'src/app/services/model-data.service';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-model',
  templateUrl: './register-model.component.html',
  styleUrls: ['./register-model.component.css', '../../project/deploy-project/deploy-project.component.css']
})

export class RegisterModelComponent implements OnInit, OnDestroy {
  modalListById!: ModelListConfig;
  modelId!: number;
  mData!: any[];

  constructor(private modelDataService: ModelDataService,
    private tkService: GetTokenService,
    private graphService: GraphService,
    public audit: AuditTrailService,
    private router: Router,
  ) { }
  
  private _apiSubscription!: Subscription;

  ngOnInit(): void {
    this.modelId = this.tkService.getModelId();
    this.fetchModalById(this.modelId);
    this.audit.addUrlAudit('userAuditLog');
  }

  registerModal(id: number) {
    this.graphService.showLoader=true;
    const payload = {
      Id: this.tkService.getUser_id(),
      Type: 'Register model',
      Effect: 'Model registered successfully',
      Status: 1,
    }

    this.modelDataService.registerModel('modelRegister', id)
      .subscribe((respArray: any) => {
        this.graphService.showLoader=false;
        console.log(respArray.data.msg)
        if (respArray.data.msg == 'Failed') {
          alert(respArray.data.response.model_register.reason[0])
        }
        if (respArray.message == 'Success' || respArray.message == 'success') {
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log(respArray)
            }
          )
        }
        else {
          payload.Effect = "Model registration failed";
          payload.Status = 0;
          this.audit.addAudit('userAuditLog', payload).subscribe(
            respArray => {
              console.log(respArray)
            }
          )
        }
        //this.projectDepData = respArray;
        //alert(this.projectDepData.status)
        console.log("data", localStorage.getItem('pmodeleditid'))
     

        if (localStorage.getItem('pmodeleditid')) {
          console.log(localStorage.getItem('pmodeleditid'))
          this.router.navigateByUrl('/add-model');
        }
        else {
          this.router.navigateByUrl('/model-list');
        }
      })
  }


  registerLater() {
    console.log("data", localStorage.getItem('pmodeleditid'))

    if (localStorage.getItem('pmodeleditid')) {
      console.log(localStorage.getItem('pmodeleditid'))
      this.router.navigateByUrl('/add-model');
    }
    else {
      this.router.navigateByUrl('/model-list');
    }
  }

  fetchModalById(id: number) {
    this.graphService.showLoader = true;
    this._apiSubscription = this.modelDataService.getModelListData('model', id,localStorage.getItem('uid')!)
    .subscribe(respArray => {
      console.log("model fetcign started")
      this.modalListById = respArray;
      this.mData = this.modalListById.data;
      // console.log(this.modalListById.data);
    }, (err) => {
      console.log("error in fetching model list");
    }, () => {
      this.graphService.showLoader = false;
      console.log("Modal fetchign complete")
    })
  }

  public setModelId(id: number) {
    this.modelId = id;

  }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }


}
