import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FinanciamientoArchivoService } from 'src/app/services/backend.service.index';
import { FinanciamientoMantenedorArchivoService } from 'src/app/services/feature.service.index';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-financiamiento-archivo-desagregado',
  templateUrl: './financiamiento-archivo-desagregado.component.html',
  styleUrls: ['./financiamiento-archivo-desagregado.component.scss']
})
export class FinanciamientoArchivoDesagregadoComponent implements OnInit {
  documentosVenta: any;
  todosDocumentosVentaAgregados: boolean;
  documentosEntrega: any;
  todosDocumentosEntregaAgregados: boolean;
  documentosAnulacion: any;
  todosDocumentosAnulacionAgregados: boolean;
  financiamientoId : number;
  constructor(
    public modalReference: MatDialogRef<FinanciamientoArchivoDesagregadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _financiamientoMantenedorArchivoServicio: FinanciamientoMantenedorArchivoService,
    public _financiamientoArchivoService: FinanciamientoArchivoService,
    public _global: GlobalService
  ) { }

  ngOnInit() {    
    this.documentosVenta = this.data.documentos.filter(doc => doc.idTipo === 1);
    this.todosDocumentosVentaAgregados = this.documentosVenta
        .filter(doc => !doc.nombre.includes("Otros Documentos"))
        .every(doc => doc.documentoAgregado);
    

    this.documentosEntrega = this.data.documentos.filter(doc => doc.idTipo === 2);
    this.todosDocumentosEntregaAgregados = this.documentosEntrega
        .filter(doc => !doc.nombre.includes("Otros Documentos"))
        .every(doc => doc.documentoAgregado);
    

    this.documentosAnulacion = this.data.documentos.filter(doc => doc.idTipo === 3);
    this.todosDocumentosAnulacionAgregados = this.documentosAnulacion
        .filter(doc => !doc.nombre.includes("Otros Documentos"))
        .every(doc => doc.documentoAgregado);          

    this.financiamientoId = this.data.financiamientoId;
  }
  
  closeDialog() {
    this.modalReference.close();
  }
}
