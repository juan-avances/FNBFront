import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
// import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { PanelMenuModule } from 'primeng/panelmenu';

import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [SidebarComponent, FooterComponent, HeaderComponent],
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    // NgMaterialMultilevelMenuModule,
    PanelMenuModule
  ],
  exports: [SidebarComponent, FooterComponent, HeaderComponent],
  providers: []
})
export class SharedModule {}
