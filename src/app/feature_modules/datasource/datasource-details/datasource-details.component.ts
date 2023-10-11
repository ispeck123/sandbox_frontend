import { Component, OnInit, OnDestroy } from '@angular/core';
import { SourceFileListConfig, SourceUploadResp } from 'src/app/data-models/project-model';
import { GraphService } from 'src/app/services/graph.service';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { Subscription } from 'rxjs';
import { AuditTrailService } from 'src/app/services/audit-trail.service';

@Component({
  selector: 'app-datasource-details',
  templateUrl: './datasource-details.component.html',
  styleUrls: ['./datasource-details.component.css']
})
export class DatasourceDetailsComponent implements OnInit, OnDestroy {
  fileName: string = '';
  formData = new FormData();
  sourceUpload!: SourceUploadResp;
  sourceFileList!: SourceFileListConfig;
  private _apiSubscription!: Subscription;
  constructor(private projectService: ProjectDataService,
    private graphService: GraphService,
    public audit: AuditTrailService

  ) { }

  ngOnInit(): void {
    this.fetchSourceList();
    this.audit.addUrlAudit('userAuditLog');
  }

  onFileSelection(e: Event) {
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    //const formData = new FormData();
    this.fileName = file.name;
    this.formData.append('project_id', '89');
    //this.formData.append('artifacts_type_id', artifact_id.toString());
    this.formData.append('source_id', '6');
    this.formData.append('file', file, file.name);
    this.formData.append('file_type', 'RTSP');
    this.formData.append('created_by', 'Anand');
    console.log(e);
    console.log(this.formData)
    this.uploadSourceFile();
  }
  uploadSourceFile() {
    this.projectService.uploadSourceFile
      ('sourceFileUpload', this.formData)
      .subscribe((respArray) => {
        this.sourceUpload = respArray;
        console.log(this.sourceUpload)
      });
  }

  fetchSourceList() {
    this.graphService.showLoader = true;
    this._apiSubscription = this.projectService.sourceFileList('sourceFileList', 'all')
      .subscribe(
        respArray => {
          this.sourceFileList = respArray;
          console.log(respArray);

          this.graphService.showLoader = false;

        }
      )
  }

  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }
}
