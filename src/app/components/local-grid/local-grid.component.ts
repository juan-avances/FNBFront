import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Option } from '../../@core/models/option.model';
import { AutoCompleteParameter } from '../../@core/models/prime-table.model';
import { EditInlinePrimeTable, InLineColumn, PrimeTableEditable } from '../../@core/models/prime-table.model';
import { Table } from 'primeng/table';
import { IFeatureListServiceEditable } from '../../@core/services/Ifeature-list-editable.service';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
  selector: 'app-local-grid',
  templateUrl: './local-grid.component.html',
  styles: []
})
export class LocalGridComponent implements OnInit {
  @Input()
  isLazyInit: boolean;
  @Input()
  listFeatureService: IFeatureListServiceEditable;
  @Output()
  @Output()
  searchEvent: EventEmitter<AutoCompleteParameter> = new EventEmitter<AutoCompleteParameter>();

  @ViewChild('dt', { static: false })
  dataTable: Table;

  selectedItems: any[];
  loading = false;
  results: Option[];
  visibleColumns: InLineColumn[];
  parametrosGrilla: EditInlinePrimeTable | PrimeTableEditable;

  constructor() {}

  ngOnInit() {
    if (!this.isLazyInit) {
      this.parametrosGrilla = this.listFeatureService.init(this.dataTable);
      this.setVisibleColumns();
    } else {
      this.parametrosGrilla = {};
      this.listFeatureService.initAsync(this.dataTable).subscribe(res => {
        this.parametrosGrilla = res.dataEntidad;
        this.setVisibleColumns();
        this.searchEvent.emit(res);
      });
    }
  }

  loadEntidadLazy(event: LazyLoadEvent) {
    this.listFeatureService.loadLazy(event);
  }

  setVisibleColumns() {
    this.visibleColumns = this.parametrosGrilla.columnas.filter(p => p.visible);
  }

  search(event, column) {
    this.searchEvent.emit({
      event: event,
      column: column,
      gridComponent: this
    });
  }

  save(rowData: any) {
    this.listFeatureService.saveElement(rowData);
  }

  delete(id: number) {
    this.parametrosGrilla.data = this.listFeatureService.delete(id);
  }

  update(data: any) {
    //this.parametrosGrilla = this.listFeatureService.updateStatus
  }

  addEmptyRow() {
    const newRow = {};
    this.parametrosGrilla.columnas.forEach(element => {
      if (element.field === 'id') {
        this.setPropertyValue(
          element,
          this.parametrosGrilla.data == null ? 1 : this.parametrosGrilla.data.lenght + 1,
          newRow
        );
      } else {
        this.setPropertyValue(element, '', newRow);
      }
    });
    if (this.parametrosGrilla.data == null) {
      this.parametrosGrilla.data = [];
    }
    this.parametrosGrilla.data.push(newRow);
  }

  setPropertyValue(column: InLineColumn, value: any, rowData: any) {
    this.set(column.field, value, rowData);
  }

  set(path, value, obj) {
    let schema = obj;
    const pList = path.split('.');
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      const elem = pList[i];
      if (!schema[elem]) {
        schema[elem] = {};
      }
      schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
  }

  setWidthColumn() {
    const totalWidth = 100 - (5 + (this.parametrosGrilla.canCheck ? 5 : 0) + (this.parametrosGrilla.canDelete ? 5 : 0));

    this.parametrosGrilla.columnas.forEach(column => {
      column.width = (totalWidth * column.width) / 100;
    });
  }
}
