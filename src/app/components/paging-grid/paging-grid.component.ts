import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { Column, PrimeTable } from '../../@core/models/prime-table.model';
import { Router } from '@angular/router';
import { State } from 'src/app/@core/models/option.model';
import { IFeatureListService } from 'src/app/@core/services/Ifeature-list.service';
import { count } from 'console';

@Component({
  selector: 'app-paging-grid',
  templateUrl: './paging-grid.component.html',
  styleUrls: []
})
export class PagingGridComponent implements OnInit {
  @Input()
  isLazyInit: boolean;

  @Input() listFeatureService: IFeatureListService;

  @Output()
  afterAsynInit: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('dt', { static: true })
  dataTable: Table;

  @Input() dataEntity: PrimeTable;
  @Output() paginationLoad: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();
  @Output() updateState: EventEmitter<State> = new EventEmitter<State>();

  @ContentChild(TemplateRef, { static: false })
  templateRef: TemplateRef<any>;

  visibleColumns: Column[];

  constructor(public _router: Router) { }

  ngOnInit() {
      this.setVisibleColumns();
  }

  setVisibleColumns() {
    this.visibleColumns = this.dataEntity.columnas.filter(p => p.visible || p.visible == null);
  }

  lazyLoad(event: LazyLoadEvent) {
    this.paginationLoad.emit(event);
  }

  getDataTableOption(): any {
    return {
      rows: this.dataTable.rows,
      sortField: this.dataTable.sortField,
      sortOrder: this.dataTable.sortOrder
    };
  }

  changeState(id: number, nuevoEstado: boolean) {
    const state: State = { id, state: nuevoEstado };
    this.updateState.emit(state);
  }

  filter(value: any, field: string, match: string,callback=null) {
   
    if(callback){
      callback();
    }
    return this.dataTable.filter(value, field, match);
  }

  getCssColor(estado: number): string  {
    if (estado === 0) {
      return '#FFD700';
    } else {
      return '#00FF7F';
    }
  }

  getCssColorDoc(estadoArchivo: number): string  {
    if (estadoArchivo === 0) {
      return '#ff0000';
    } else  if (estadoArchivo === 1) {
      return '#FFC300';
    }else  if (estadoArchivo === 2) {
      return '#00FF7F';
    }
  }
}

