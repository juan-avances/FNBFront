import { Component, OnInit, Input } from '@angular/core';
import { FinanciamientoDatosGenerales } from 'src/app/models/financiamiento.model';

@Component({
  selector: 'app-financiamiento-datos-generales',
  templateUrl: './financiamiento-datos-generales.component.html',
  styleUrls: []
})
export class FinanciamientoDatosGeneralesComponent implements OnInit {
  @Input() datos: FinanciamientoDatosGenerales;

  lineaCredito: number;
  correoSAP: string ='';
  numeroTelefonoSAP: string ='';

  constructor() {}

  ngOnInit() {
    this.correoSAP = localStorage.getItem('correoSAP').toString();
    this.numeroTelefonoSAP = localStorage.getItem('numeroTelefonoSAP').toString();
    if (!!this.datos) this.lineaCredito = this.datos.lineaCredito;

    if (typeof Storage !== 'undefined') localStorage.setItem('lineaCredito', this.lineaCredito.toString());
  }
}
