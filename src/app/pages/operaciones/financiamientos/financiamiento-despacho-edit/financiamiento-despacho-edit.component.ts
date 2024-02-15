import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { GlobalService } from 'src/app/services/global.service';
import { Option } from '../../../../@core/models/option.model';
import { FinanciamientoDatosGenerales, Despacho } from 'src/app/models/financiamiento.model';

import { formatDate } from '@angular/common';

@Component({
  selector: 'app-financiamiento-despacho-edit',
  templateUrl: './financiamiento-despacho-edit.component.html',
  styleUrls: []
})
export class FinanciamientoDespachoEditComponent implements OnInit {
  @Input() forma: FormGroup;
  @Input() departamentos: Option[];
  @Input() tipoDespacho: number;
  @Input() datos: FinanciamientoDatosGenerales;
  @Input() idAliado: number;
  @Input() despacho: Despacho;
  verDelivery: boolean;
  verRetiroTienda: boolean;

  sedes: Option[];
  provincias: Option[];
  distritos: Option[];
  selectedIndex: number;
  calleDespacho: string;
  fechaMinRecojo: Date;
  fechaMaxRecojo: Date;
  departamentoId: number;
  provinciaId: number;
  distritoId: number;

  constructor(public _financiamientoEdicionService: FinanciamientoEdicionService, public _global: GlobalService) {}

  async ngOnInit() {
    this.fechaMinRecojo = new Date(localStorage.getItem('fechaMinRecojo'));
    this.fechaMaxRecojo = new Date(localStorage.getItem('fechaMaxRecojo'));
    this.calleDespacho = '';
    this.verDelivery = this.tipoDespacho == 3;
    this.verRetiroTienda = this.tipoDespacho == 2;

    if (this.despacho != null) {
      if (this.despacho.departamentoId) {
        this.departamentoId = this.despacho.departamentoId;
        await this.buscarUbigeo(this.departamentoId, 2);
      }
      if (this.despacho.provinciaId) {
        this.provinciaId = this.despacho.provinciaId;
        await this.buscarUbigeo(this.provinciaId, 3);
      }
      if (this.despacho.distritoId) {
        this.distritoId = this.despacho.distritoId;
      }
    }

    this._financiamientoEdicionService.obtenerSedesAliado(this.idAliado).subscribe(response => {
      this.sedes = response;
    });
  }

  async buscarUbigeo(valor: number, nivel: number) {
    let response = await this._financiamientoEdicionService.buscarUbigeo(nivel, valor).toPromise();
      if (nivel === 2) {
        this.distritos = [];
        this.provincias = response;
      } else if (nivel === 3) {
        this.distritos = response;
      }
    
  }

  searchUbigeo(event: any, nivel: number) {
    this.buscarUbigeo(event.value, nivel);
  }
}
