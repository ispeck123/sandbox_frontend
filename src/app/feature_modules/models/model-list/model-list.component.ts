import { Component, Inject, OnInit,OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ModelListConfig } from 'src/app/data-models/model';
import { ModelDataService } from 'src/app/services/model-data.service';
import { GraphService} from 'src/app/services/graph.service';
import {Subscription} from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit, OnDestroy  {

  constructor(private modelDataService: ModelDataService, private graphService: GraphService, public dialog: MatDialog,public audit: AuditTrailService) { }
  modalList!: ModelListConfig;
  modalListById!: ModelListConfig;
  modelId!:number;
  listdata:any=[];
  private _apiSubscription! : Subscription;
  ngOnInit(): void {
    this.fetchModelListData();
    this.audit.addUrlAudit('userAuditLog');

  }

  fetchModelListData(){
    this.graphService.showLoader = true;
    console.log("data-----------------",this.graphService.showLoader);
    this._apiSubscription=this.modelDataService.getModelListData('model', 'all')
    .subscribe(
      respArray => {
            this.graphService.showLoader = false;
            console.log("data-----------------",this.graphService.showLoader);

            this.modalList = respArray;
            this.listdata= this.modalList.data;
            console.log('model data',this.modalList.data);
      }
    )
  }

  fetchModalById(id:number, checkVal:string){

     this.modelDataService.getModelListData('model', id)
    .subscribe(
      respArray => {

        this.modalListById = respArray;
        if(!(checkVal != 'details'))
          this.dialogData(this.modalListById, checkVal)
        else
          this.dialogData(id, checkVal)
      }

    )

  }
  colorVariation( index: number ) {
    return index % 10;
  }

  createAvaterName( userName:string ) {
    const name = userName.trim().split( ' ' );
    let avater: string;
    if ( name.length > 1 ) {
      avater = name[ 0 ].substring( 0, 1 ) + '' + name[ 1 ].substring( 0, 1 );
    } else {
      avater = userName.substring( 0, 2 );
    }
    return avater;
  }
  public setModelId(id:number){
    this.modelId = id;

}

registerModal(id: number) {
  this.graphService.showLoader = true;
  this.modelDataService.registerModel('modelRegister', id)
    .subscribe((respArray: any) => {
      this.graphService.showLoader = false;
      
      console.log(respArray.data.msg);
      if (respArray.data.msg == 'Failed') {
        alert(respArray.data.response.model_register.reason[0]);
      } else {
        // Registration was successful, so refresh the page
        window.location.reload();
      }
    });
}

  // registerModal(id:number){
  //   this.graphService.showLoader=true;
  //   this.modelDataService.registerModel('modelRegister', id)
  //   .subscribe((respArray:any) => {
  //     this.graphService.showLoader=false;
  //     console.log(respArray.data.msg)
  //     if(respArray.data.msg == 'Failed'){
  //      alert(respArray.data.response.model_register.reason[0])
  //     }
  //   })
   
  // }



  dialogData(data:ModelListConfig | number, val:string){

    console.log('val', val )
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "100%";
    dialogConfig.maxWidth = "500px";
    dialogConfig.height = "80%";
    // const dialogConfig = new MatDialogConfig();
    if(val == 'details'){
      dialogConfig.data = {
        modalData : data
     };
     return this.openDetailsDialog(dialogConfig) ;
    }
    else {
      dialogConfig.data = {
        modalId : data
     };
     return this.openEditDialog(dialogConfig) ;
    }

  }
  
  setEditModelUrlForClass (urlForClass: string) {
    localStorage.setItem("urlForClass", urlForClass);
  }

  openDetailsDialog(dialogConfig:any) {
    this.dialog.open(ModalDetails, dialogConfig);
   }

   openEditDialog(dialogConfig:any) {
    this.dialog.open(ModalEdit, dialogConfig);
   }

   deleteDialog (modelId:number) {
    const dialogRef = this.dialog.open(ModelDeleteDialog, {
      width: "400px", 
      data: modelId
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'success') {
        this.ngOnInit();
      }
    })
   }

   ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}

@Component({
  selector: 'modal-details',
  templateUrl: 'modal-details.html',
  styleUrls: ['../../project/deploy-project/deploy-project.component.css', './model-list.component.css']
})
export class ModalDetails {
  modalList!: any;
  constructor(private dialogRef: MatDialogRef<ModalDetails>,
    @Inject(MAT_DIALOG_DATA) public data:ModelListConfig){
      if(data != undefined){
        this.modalList = data;
        console.log('sssss', data)
      }

    }
}

@Component({
  selector: 'modal-edit',
  templateUrl: 'modal-edit.html',
  styleUrls: ['../../project/project-list/project-list.component.css']
})
export class ModalEdit {
  modalId!:any;
  url:string=''
  constructor(private dialogRef: MatDialogRef<ModalEdit>,
    @Inject(MAT_DIALOG_DATA) public data:any){
       this.modalId = data.modalId;
       console.log('mmmmm',this.modalId)
       this.url = `${'/modal-edit'}/${this.modalId}`
       console.log(this.url)
    }
    close(){
      this.dialogRef.close();
    }
}

// Model Delete Dialog ###### ^tart
@Component({
  selector: "model-delete-dialog-box",
  templateUrl: "./model-delete-dialog.component.html" 
})
export class ModelDeleteDialog {
  constructor (private http:HttpClient, private dialogRef:MatDialogRef<ModelDeleteDialog>, 
    private modelService: ModelDataService, @Inject(MAT_DIALOG_DATA) private data: any) {}

  deleteModel () {
    console.log(this.data, " will be deleted::")
    this.modelService.deleteModel(this.data).subscribe(res => {
      console.log("model delete:: ", res);
    }, (err) => {
      console.log(err ,"some error occurred while deletig model-id", this.data);
    }, () => {
      this.dialogRef.close("success");
    })
  }

  closePopup () {
    this.dialogRef.close();
  }
}


// Model Delete Dialog ###### $nd
