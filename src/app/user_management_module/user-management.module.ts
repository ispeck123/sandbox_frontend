import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
// import { UserSidebarComponent } from './user-sidebar/user-sidebar/user-sidebar.component';
import { UserMainLayoutComponent } from './user-main-layout/user-main-layout/user-main-layout.component';
import { SharedModule } from '../shared_module/shared-module.module';
import { UserDetailsComponent } from './user-details/user-details/user-details.component';
import { UserRoleListComponent } from './user-role-list/user-role-list.component';
import { UserPermissionListComponent } from './user-permission-list/user-permission-list.component';
import { UserRoleAssignmentComponent } from './user-role-assignment/user-role-assignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignPermissionComponent } from './assign-permission/assign-permission.component';
import { UsersAuditComponent, DownloadsComponent } from './users-audit/users-audit.component';
import { ModuleComponent } from './module/module.component';
import { RolePermissionMappingComponent } from './role-permission-mapping/role-permission-mapping.component';
import { AuditGraphComponent } from './audit-graph/audit-graph.component';
import { RolePermMapComponent } from './role-perm-map/role-perm-map.component';
import { LoginFailureChartComponent } from './login-failure-chart/login-failure-chart.component';
import { EventChartComponent } from './event-chart/event-chart.component';
import { EventFailureChartComponent } from './event-failure-chart/event-failure-chart.component';
import { SanitizePermissionListPipe } from './role-perm-map/remove-bracket.pipe';
import { MatPaginatorModule } from "@angular/material/paginator";

@NgModule({
  declarations: [
    // UserSidebarComponent,
    UserMainLayoutComponent,
    UserDetailsComponent,
    UserRoleListComponent,
    UserPermissionListComponent,
    UserRoleAssignmentComponent,
    AssignPermissionComponent,
    UsersAuditComponent,
    ModuleComponent,
    RolePermissionMappingComponent,
    AuditGraphComponent,
    RolePermMapComponent,
    LoginFailureChartComponent,
    EventChartComponent,
    EventFailureChartComponent,
    DownloadsComponent, 
    SanitizePermissionListPipe
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule, 
    MatPaginatorModule
  ]
})
export class UserManagementModule { }
