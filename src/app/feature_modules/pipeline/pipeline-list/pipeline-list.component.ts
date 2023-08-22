import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipelineListConfig } from 'src/app/data-models/pipeline-model';
import { GraphService } from 'src/app/services/graph.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { Subscription } from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pipeline-list',
  templateUrl: './pipeline-list.component.html',
  styleUrls: ['./pipeline-list.component.css']
})
export class PipelineListComponent implements OnInit, OnDestroy {
  listdata: any = [];
  private _apiSubscription!: Subscription;
  constructor(private pipelineData: PipelineDataService,
    public dialog: MatDialog,
    private graphService: GraphService,
    public audit: AuditTrailService
  ) { }

  pipelineList!: PipelineListConfig;
  pipelineById!: PipelineListConfig;
  ngOnInit(): void {
    this.getPipelineList();
    this.audit.addUrlAudit('userAuditLog');
  }

  public getPipelineList() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.pipelineData.getPipelineData('pipeline', 'all')
      .subscribe(
        respArray => {
          this.pipelineList = respArray;
          this.listdata = this.pipelineList.data;
          this.graphService.showLoader = false;

          console.log("pipeline list",this.pipelineList);

        }
      )
  }

  createAvaterName(userName: string) {
    const name = userName.trim().split(' ');
    let avater: string;
    if (name.length > 1) {
      avater = name[0].substring(0, 1) + '' + name[1].substring(0, 1);
    } else {
      avater = userName.substring(0, 2);
    }
    return avater;
  }

  fetchPipeById(id: number, checkVal: string) {

    this.pipelineData.getPipelineData('pipeline', id)
      .subscribe(
        respArray => {
          this.pipelineById = respArray;
          if (!(checkVal != 'details'))
            this.dialogData(this.pipelineById, checkVal)
          else
            this.dialogData(id, checkVal)

        }


      )

  }
  colorVariation(index: number) {
    return index % 10;
  }

  dialogData(data: PipelineListConfig | number, val: string) {

    console.log('val', val)
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = "100%";
    dialogConfig.maxWidth = "500px";
    // dialogConfig.height = "80%";
    if (val == 'details') {
      dialogConfig.data = {
        pipeData: data
      };
      return this.openDetailsDialog(dialogConfig);
    }
    else {
      dialogConfig.data = {
        pipeId: data
      };
      return this.openEditDialog(dialogConfig);
    }

  }

  openDetailsDialog(dialogConfig: any) {
    this.dialog.open(PipelineDetails, dialogConfig);
  }

  openEditDialog(dialogConfig: any) {
    this.dialog.open(PipelineEdit, dialogConfig);
  }

  deletePopup(pipelineId: number) {
    const dialogRef = this.dialog.open(DeletePipelineDialogComponent, {
      width: "450px", 
      data: pipelineId
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === "success") {
        this.ngOnInit();
      }
    })
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}

// Pipeline Details Popup
@Component({
  selector: 'pipeline-details',
  templateUrl: 'pipeline-details.html',
  styleUrls: ['../../project/deploy-project/deploy-project.component.css', './pipeline-list.component.css']
})
export class PipelineDetails {

  pipeList!: any;
  modelList!: any;
  constructor(private dialogRef: MatDialogRef<PipelineDetails>, private pipelineService: PipelineDataService,
    @Inject(MAT_DIALOG_DATA) public data: PipelineListConfig) {
    if (data != undefined) {
      this.pipeList = data;
      console.log("Details Popup:: ", data, this.pipeList.pipeData.data[0].pipeline_id);
      this.pipelineService.getPipeModelList("modelByPipeline", this.pipeList.pipeData.data[0].pipeline_id).subscribe((res) => {
        console.log("Model List:: ", res);
        this.modelList = res.data;
      })
      console.log('sssss', data);
    }
  }
}


// Pipeline edit
@Component({
  selector: 'pipeline-edit',
  templateUrl: 'pipeline-edit.html',
  styleUrls: ['../../project/project-list/project-list.component.css']
})
export class PipelineEdit {
  url: string = ''
  constructor(private dialogRef: MatDialogRef<PipelineEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.modalId = ;
    console.log('mmmmm', data.pipeId)
    this.url = `${'/pipeline-edit'}/${data.pipeId}`
    console.log(this.url)
  }
  close() {
    this.dialogRef.close();
  }
}

// Delete Dialog Component ^start
@Component({
  selector: "delete-pipeline-dialog", 
  templateUrl: "./delete-pipeline-dialog.component.html"
})
export class DeletePipelineDialogComponent {
  constructor (private dialogRef: MatDialogRef<DeletePipelineDialogComponent>, private http: HttpClient, 
    @Inject(MAT_DIALOG_DATA) private data: any, private pipelineService: PipelineDataService) {}

  deletePipeline () {
    this.pipelineService.deletePipeline(this.data).subscribe((res) => {
      console.log(res, " pipeline delete ;;");
    }, err => {
      console.log("error in pipeline delete", err);
    }, () => {
      this.dialogRef.close("success");
    })
  }  

  closePopup () {
    this.dialogRef.close();
  }
}
// Delete Dialog Component end$