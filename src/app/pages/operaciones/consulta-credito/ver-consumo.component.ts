import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';

@Component({
  selector: 'app-ver-consumo',
  templateUrl: './ver-consumo.component.html',
  styles: []
})
export class VerConsumoComponent implements OnInit {
  dnicuenta: string;
  tipoDocumento: string;

  lineaDetalle: any;

  lineaCredito: any;
  utilizado: any;
  disponible: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  //->
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<ConsumoData>;
  consumoColumns = ['fecha', 'hora', 'estado'];
  //->
  constructor(
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    public dialogRef: MatDialogRef<VerConsumoComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dnicuenta = '';
    this.tipoDocumento = '';
  }
  ngOnInit() {
    //Configurar paginador
    this.paginator._intl.itemsPerPageLabel = 'Items por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.previousPageLabel = 'Anterior página';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) {
        return `0 hasta ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      return `${startIndex + 1} - ${endIndex} hasta ${length}`;
    };

    this._financiamientoEdicionService
      .obtenerHistorialCredito(this.data.Documento, this.data.TipoDocumento)
      .subscribe(response => {
        if (response.valid) {
          this.lineaCredito = response.data.lineaCredito;
          this.utilizado = response.data.utilizado;
          this.disponible = response.data.disponible;

          if (!!response.data.datos) {
            this.lineaDetalle = response.data.datos;
            this.dataSource = new MatTableDataSource(this.lineaDetalle);
            this.dataSource.paginator = this.paginator;
          }
        }
      });
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  btnCerrar(): void {
    this.dialogRef.close();
  }
}

export interface ConsumoData {
  fecha: string;
  hora: string;
  estado: string;
}
