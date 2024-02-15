import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { EditInlinePrimeTable } from 'src/app/@core/models/prime-table.model';
import { ActivatedRoute } from '@angular/router';
import { CorreoMantenimientoService } from 'src/app/services/feature.service.index';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-correos',
  templateUrl: './correos-mantenimiento.component.html',
  styles: []
})
export class CorreosMantenimientoComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: Table;
  correoId: number;
  correos: string[];
  correoTableEdit: EditInlinePrimeTable;

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _correoMantenimientoServicio: CorreoMantenimientoService,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    this._correoMantenimientoServicio.initAsync(this.dataTable).subscribe(response => {});
  }
}
