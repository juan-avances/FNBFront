import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { LoadingComponent } from './loading/loading.component';
import { LocalGridComponent } from './local-grid/local-grid.component';
import { PropertyValuePipe } from '../pipes/property-value.pipe';
import { OverlayPanelModule } from 'primeng/primeng';
 

@NgModule({
  declarations: [LocalGridComponent, LoadingComponent, PropertyValuePipe],
  imports: [CommonModule, FormsModule, TableModule, AutoCompleteModule, OverlayPanelModule],
  exports: [LocalGridComponent, LoadingComponent],
  providers: [],
  entryComponents: []
})
export class ComponentsModule {}
