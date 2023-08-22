import { Component, Input, OnInit } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { ModelListConfig } from 'src/app/data-models/model';
import { ClassListConfig } from 'src/app/data-models/pipeline-model';
import { ModelDataService } from 'src/app/services/model-data.service';
import { PipelineDataService } from 'src/app/services/pipeline-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertCategoryConfig } from 'src/app/data-models/project-model';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuditTrailService } from 'src/app/services/audit-trail.service';
import { GraphService } from 'src/app/services/graph.service';

@Component({
  selector: 'app-project-alert-rules',
  templateUrl: './project-alert-rules.component.html',
  styleUrls: [
    './project-alert-rules.component.css',
    '../../models/add-model-class/add-model-class.component.css',
  ],
})
export class ProjectAlertRulesComponent implements OnInit {
  classListData!: ClassListConfig;
  modelList!: ModelListConfig;
  model_id!: number;
  selected!: boolean;
  attrDisable: boolean = true;
  attrList!: ClassListConfig;
  matchipControl!: MatChip;
  class_id!: number;
  attrValueId!: number;
  is_considered: boolean = false;
  @Input() isChooseAlert: boolean = false;

  constructor(
    private pipelineData: PipelineDataService,
    private modelDataService: ModelDataService,
    public dialog: MatDialog,
    public audit: AuditTrailService, 
    private graphService: GraphService
  ) {}

  ngOnInit(): void {
    this.fetchModelListData();
    this.audit.addUrlAudit('userAuditLog');

  }

  getClassData(model_id: number) {
    console.log(model_id);
    this.graphService.showLoader = true;
    let tempClassList: any;
    this.pipelineData
      .getClassListByModel('classByModel', model_id)
      .subscribe((respArray) => {
        tempClassList = respArray;
        console.log(this.classListData);
      }, (err) => {
        console.log("Error in classList fetch ", err);
      }, () => {
        console.log("classt list fetch complete complete");
        this.classListData = tempClassList;
        this.graphService.showLoader = false;
      });
  }

  fetchModelListData() {
    this.pipelineData
      .getPipeModelList('modelByPipeline', 18)
      .subscribe((respArray) => {
        this.modelList = respArray;
        console.log(this.modelList.data);
      });
  }

  getClassById(callCheck: boolean) {
    this.pipelineData
      .getClassList('class', this.class_id)
      .subscribe((respArr) => {
        this.attrList = respArr;

        //  console.log(this.matchipControl, callCheck)
        // if(callCheck){
        //  this.ref.detectChanges();
        //   this.isChip = false;
        //   this.chipManager(this.class_id, this.matchipControl, this.isChip);

        // }

        console.log(this.attrList.data);
      });
  }

  chipManager(id: number, select: MatChip, isChip: boolean) {
    this.matchipControl = select;
    this.class_id = id;
    this.attrDisable = false;

    this.matchipControl.toggleSelected();

    const callCheck = false;
    this.getClassById(callCheck);
  }

  attrChipManager(id: number, select: MatChip, isChip: boolean){
    this.matchipControl = select;
    this.attrDisable = false;

    this.matchipControl.toggleSelected();
  }

  attrValueIdGetter(attrid: number) {
    this.attrValueId = attrid;
    console.log('attrval', attrid);
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(AlertForm);
  }
}

@Component({
  selector: 'alert-form',
  templateUrl: 'alert-form.html',
  styleUrls: ['./project-alert-rules.component.css'],
})
export class AlertForm {
  alertCategory!: AlertCategoryConfig;
  countval: number = 1;
  durationval: number = 1;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;

  constructor(private projectData: ProjectDataService) {}

  ngOnInit(): void {
    this.fetchAlertCategory();
  }

  fetchAlertCategory() {
    this.projectData
      .getAlertCategory('alarmsCategory', 'all')
      .subscribe((respArray) => {
        this.alertCategory = respArray;
        console.log(this.alertCategory);
      });
  }

  alertForm = new FormGroup({
    project_id: new FormControl(''),
    alarm_category_id: new FormControl(''),
    zone_id: new FormControl(''),
    count: new FormControl(''),
    duration: new FormControl(''),
    alarm_start_time: new FormControl(''),
    alarm_end_time: new FormControl(''),
    is_cross_over: new FormControl(''),
    frequency: new FormControl(''),
    class_id: new FormControl(''),
    attribute_id: new FormControl(''),
    value_id: new FormControl(''),
    model_id: new FormControl(''),
    is_considered: new FormControl(''),
    created_by: new FormControl(''),
    modified_by: new FormControl(''),
  });
}
