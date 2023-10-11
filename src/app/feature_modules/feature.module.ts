import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureOneRoutes } from './feature.routing';
import { ProjectDeleteDialog, ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectModelComponent } from './project/project-model/project-model.component';
import { ProjectDataSourceComponent } from './datasource/data-source/project-data-source.component';
import { DatasourceDetailsComponent } from './datasource/datasource-details/datasource-details.component';
import { ProjectConfigModelComponent } from './project/project-config-model/project-config-model.component';
import { ProjectAlertRulesComponent } from './project/project-alert-rules/project-alert-rules.component';
import { PipelineCreateComponent } from './pipeline/pipeline-create/pipeline-create.component';
import { PipelineListComponent, DeletePipelineDialogComponent } from './pipeline/pipeline-list/pipeline-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModalDetails, ModelListComponent } from './models/model-list/model-list.component';
import { ModelCreateComponent } from './models/model-create/model-create.component';
import { AddModelClassComponent } from './models/add-model-class/add-model-class.component';
import { ModelVerifyComponent } from './models/model-verify/model-verify.component';
import { AlertListComponent } from './alerts/alert-list/alert-list.component';
import { InferencingComponent } from './project/inferencing/inferencing.component';
import { DeployProjectComponent } from './project/deploy-project/deploy-project.component';
import { AccessDeniedComponent } from '../access-denied/access-denied.component';
import { InferenceListComponent } from './inference-list/inference-list.component';
import { AddModelsComponent } from './pipeline/add-models/add-models.component';
import { ProjectDetails, ProjectEdit } from './project/project-list/project-list.component';
import { ZoneCreationComponent } from './zone-creation/zone-creation.component';
import { SelectModelPipelineComponent } from './project/select-model-pipeline/select-model-pipeline.component';
import { SavePipelineComponent } from './pipeline/save-pipeline/save-pipeline.component';
import { RegisterModelComponent } from './models/register-modal/register-model.component';
import { AlertForm } from './project/project-alert-rules/project-alert-rules.component';
import { SharedModule } from '../shared_module/shared-module.module';
import { PipelineDetails } from './pipeline/pipeline-list/pipeline-list.component';
import { ModalEdit } from './models/model-list/model-list.component';
import { PipelineEdit } from './pipeline/pipeline-list/pipeline-list.component';
import { SystemMonitoringComponent } from './system-monitoring/system-monitoring.component';
import { DatasourceEditComponent } from './datasource/datasource-edit/datasource-edit.component';
import { ModelDeleteDialog } from "./models/model-list/model-list.component";
import { DashboardComponent } from './project/dashboard/dashboard.component';
import { SchedulerComponent } from "./project/scheduler/scheduler.component";


 @NgModule({
   declarations: [
    ProjectListComponent,
    ProjectCreateComponent,
    ProjectModelComponent,
    ProjectDataSourceComponent,
    DatasourceDetailsComponent,
    ProjectConfigModelComponent,
    ProjectAlertRulesComponent,
    PipelineCreateComponent,
    PipelineListComponent,
    ModelListComponent,
    ModelCreateComponent,
    AddModelClassComponent,
    ModelVerifyComponent,
    AlertListComponent,
    InferencingComponent,
    DeployProjectComponent,
    AccessDeniedComponent,
    InferenceListComponent,
    AddModelsComponent,
    ProjectDetails,
    ZoneCreationComponent,
    ProjectEdit,
    SelectModelPipelineComponent,
    SavePipelineComponent,
    RegisterModelComponent,
    AlertForm,
    PipelineDetails,
    ModalDetails,
    ModalEdit,
    PipelineEdit,
    SystemMonitoringComponent,
    DatasourceEditComponent, 
    ProjectDeleteDialog, 
    ModelDeleteDialog, 
    DeletePipelineDialogComponent, DashboardComponent, SchedulerComponent,
  ],
   imports: [
    CommonModule,
    RouterModule.forChild(FeatureOneRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
   
  ]
 })
 export class FeatureModule {}
