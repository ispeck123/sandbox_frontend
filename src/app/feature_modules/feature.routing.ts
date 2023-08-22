import { RouteGuard } from "../_guards/route.guard";
import { Routes } from '@angular/router';
import { MainlayoutComponent } from '../layout/mainlayout/mainlayout.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectCreateComponent } from './project/project-create/project-create.component';
import { ProjectModelComponent } from './project/project-model/project-model.component';
import { ProjectDataSourceComponent } from './datasource/data-source/project-data-source.component';
import { DatasourceDetailsComponent } from './datasource/datasource-details/datasource-details.component';
import { ProjectConfigModelComponent } from './project/project-config-model/project-config-model.component';
import { ProjectAlertRulesComponent } from './project/project-alert-rules/project-alert-rules.component';
import { PipelineCreateComponent } from "./pipeline/pipeline-create/pipeline-create.component";
import { PipelineListComponent } from "./pipeline/pipeline-list/pipeline-list.component";
import { ZoneCreationComponent } from "./zone-creation/zone-creation.component";
import { ModelCreateComponent } from "./models/model-create/model-create.component";
import { AddModelClassComponent } from "./models/add-model-class/add-model-class.component";
import { ModelListComponent } from "./models/model-list/model-list.component";
import { ModelVerifyComponent } from "./models/model-verify/model-verify.component";
import { AlertListComponent } from "./alerts/alert-list/alert-list.component";
import { InferencingComponent } from "./project/inferencing/inferencing.component";
import { DeployProjectComponent } from "./project/deploy-project/deploy-project.component";
import { AccessDeniedComponent } from "../access-denied/access-denied.component";
import { InferenceListComponent } from "./inference-list/inference-list.component";
import { LandingPageComponent } from "../layout/landing-page-layout/landing-page/landing-page.component";
import { AddModelsComponent } from "./pipeline/add-models/add-models.component";
import { SelectModelPipelineComponent } from "./project/select-model-pipeline/select-model-pipeline.component";
import { SavePipelineComponent } from "./pipeline/save-pipeline/save-pipeline.component";
import { RegisterModelComponent } from "./models/register-modal/register-model.component";
import { SystemMonitoringComponent } from "./system-monitoring/system-monitoring.component";
import { DatasourceEditComponent } from "./datasource/datasource-edit/datasource-edit.component";

export const FeatureOneRoutes: Routes = [
  {
    path: '',
    component: MainlayoutComponent,
    canActivate: [RouteGuard],
    canActivateChild: [RouteGuard],
    children: [
      {
        path: 'project-list', component: ProjectListComponent, data: { allowedRoles: [''] }
      },
      {
        path: 'project-create', component: ProjectCreateComponent, data: { allowedPermission: ['Project Create'] }
      },
      {
        path: 'project-edit/:id', component: ProjectCreateComponent, data: { allowedPermission: ['Project Create'] }
      },
      {
        path: 'project-model', component: ProjectModelComponent, data: { allowedPermission: ['Project Model'] }
      },
      {
        path: 'project-datasource', component: ProjectDataSourceComponent, data: { allowedPermission: ['Datasource List'] }
      },
      {
        path: 'datasource-details', component: DatasourceDetailsComponent, data: { allowedPermission: ['Datasource Details'] }
      },
      {
        path: 'datasource-edit/:id', component: DatasourceEditComponent, data: { allowedPermission: ['Datasource Edit'] }
      },
      {
        path: 'config-model', component: ProjectConfigModelComponent, data: { allowedPermission: ['Model Configuration'] }
      },
      {
        path: 'alert-rules', component: ProjectAlertRulesComponent, data: { allowedPermission: ['Create And Choose Alert Rules'] }
      },
      {
        path: 'pipeline', component: PipelineListComponent, data: { allowedPermission: ['Pipeline List'] }
      },
      {
        path: 'pipeline-create', component: PipelineCreateComponent, data: { allowedPermission: ['Create Pipeline'] }
      },
      {
        path: 'pipeline-edit/:id', component: PipelineCreateComponent, data: { allowedPermission: ['Create Pipeline'] }
      },
      {
        path: 'zone-creation', component: ZoneCreationComponent, data: { allowedPermission: ['Create Zone'] }
      },
      {
        path: 'model-create', component: ModelCreateComponent, data: { allowedPermission: ['Create Model'] }
      },
      {
        path: 'modal-edit/:id', component: ModelCreateComponent, data: { allowedPermission: ['Create Model'] }
      },
      {
        path: 'model-class', component: AddModelClassComponent, data: { allowedPermission: ['Create And Choose Class'] }
      },
      {
        path: 'model-list', component: ModelListComponent, data: { allowedPermission: ['Model List'] }
      },
      {
        path: 'model-verify', component: ModelVerifyComponent, data: { allowedPermission: ['Model verify'] }
      },
      {
        path: 'alert-list', component: AlertListComponent, data: {}
      },
      {
        path: 'project-inference', component: InferencingComponent, data: { allowedPermission: ['Project Inference'] }
      },
      {
        path: 'deploy-project', component: DeployProjectComponent, data: { allowedPermission: ['Deploy Project'] }
      },
      {
        path: 'inference-list', component: InferenceListComponent
      },
      {
        path: 'add-model', component: AddModelsComponent
      },
      {
        path: 'select-model-pipeline', component: SelectModelPipelineComponent
      },
      {
        path: 'save-pipeline', component: SavePipelineComponent
      },
      {
        path: 'register-modal', component: RegisterModelComponent
      }


    ],


  },
  {
    path: 'home',
    component: LandingPageComponent,
    canActivate: [RouteGuard]
  },
  {
    path: 'system-monitoring',
    component: SystemMonitoringComponent,
    canActivate: [RouteGuard]
  }
];


