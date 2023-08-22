import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from '../_guards/route.guard';
import { AssignPermissionComponent } from './assign-permission/assign-permission.component';
import { AuditGraphComponent } from './audit-graph/audit-graph.component';
import { ModuleComponent } from './module/module.component';
import { RolePermMapComponent } from './role-perm-map/role-perm-map.component';
import { UserDetailsComponent } from './user-details/user-details/user-details.component';
import { UserMainLayoutComponent } from './user-main-layout/user-main-layout/user-main-layout.component';
import { UserPermissionListComponent } from './user-permission-list/user-permission-list.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { UserRoleListComponent } from './user-role-list/user-role-list.component';
import { UsersAuditComponent } from './users-audit/users-audit.component';
import { LoginFailureChartComponent } from './login-failure-chart/login-failure-chart.component';
import { EventChartComponent } from './event-chart/event-chart.component';
import { EventFailureChartComponent } from './event-failure-chart/event-failure-chart.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-management/user-details',
    pathMatch: 'full'
  },
  {
    path: '',
    component: UserMainLayoutComponent,
    //canActivate:[RouteGuard],
    canActivateChild:[RouteGuard],
    children: [
      {
        path:'user-management/user-details',
        component: UserDetailsComponent,
        data: { allowedPermission: ['user-management']}
      },
     
      {
        path:'user-management/user-role-list',
        component: UserRoleListComponent,
        data: { allowedPermission: ['user-management']}
      },
      {
        path:'user-management/user-permission-list',
        component: UserPermissionListComponent,
        data: { allowedPermission: ['user-management']}
      },
      {
        path:'user-management/user-role-assignment',
        component: UserRoleAssignmentComponent,
        data: { allowedPermission: ['user-management']}
      },
      {
        path:'user-management/assign-permission',
        component: AssignPermissionComponent,
        data: { allowedPermission: ['user-management']}
      },
      {
        path:'user-management/module',
        component: ModuleComponent,
        data: { allowedPermission: ['user-management']}
      },
      {
        path:'user-management/role-perm-map',
        component: RolePermMapComponent,
        data: { allowedPermission: ['user-management']}
      }
    ]

  },
  {
    path:'users-audit',
    component: UsersAuditComponent,
    data: { allowedPermission: ['user-management']}
  },
  {
    path:'user-audit-trail',
    component: AuditGraphComponent,
    data: { allowedPermission: ['user-management']}
  },
  {
    path:'login-failure-chart',
    component: LoginFailureChartComponent,
    data: { allowedPermission: ['user-management']}
  },
  {
    path:'event-chart',
    component: EventChartComponent,
    data: { allowedPermission: ['user-management']}
  },
  {
    path:'event-failure-chart',
    component: EventFailureChartComponent,
    data: { allowedPermission: ['user-management']}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
