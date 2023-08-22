import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { UserSidebarComponent } from '../user_management_module/user-sidebar/user-sidebar/user-sidebar.component';
import { MaterialModule } from '../services/material/material.module';
import { RouterModule } from '@angular/router';
import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    UserSidebarComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    AngJsoneditorModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    UserSidebarComponent,
    MaterialModule,
    AngJsoneditorModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule { }
