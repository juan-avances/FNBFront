import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComboProducto } from 'src/app/models/financiamiento.model';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-financiamiento-productos',
  templateUrl: './financiamiento-productos.component.html',
  styleUrls: []
})
export class FinanciamientoProductosComponent implements OnInit {
  @Input() forma: FormGroup;
  @Input() detalle: any[];
  @Input() lineaCredito: number;
  @Input() hayExceso: boolean;
  @Input() totalMonto: number;
  @Output() eliminarCP = new EventEmitter<any>();
  @Output() despachoCP = new EventEmitter<any>();

  constructor(public _financiamientoEdicionService: FinanciamientoEdicionService, public dialog: MatDialog) {}

  ngOnInit() {}

  Eliminar(row: any, nivel: number) {
    row.nivel = nivel;
    this.eliminarCP.emit(row);
  }

  Despacho(row: any) {
    this.despachoCP.emit(row);
  }

  obtenerTotal(): number {
    return Math.min(this.lineaCredito, this.totalMonto);
  }
}
