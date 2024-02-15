import { Component, OnInit } from '@angular/core';

import { SeguridadEdicionService } from '../../../../services/feature.service.index';
import { Option } from '../../../../@core/models/option.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../services/global.service';
import { OptionToggle } from 'src/app/models/optionToggle.model';
import { FormularioPermiso } from 'src/app/models/formularioPermiso.model';

@Component({
  selector: 'app-canales',
  templateUrl: './canales.component.html',
//styles: ['./canales.component.scss']
  styleUrls: ['./canales.component.scss']
})
export class CanalesComponent implements OnInit {
  optionCanales: OptionToggle[];
  optionAliado: Option[];

  formularios: FormularioPermiso[];

  forma: FormGroup;

  idAliadoComercial: string = null;

  constructor(
    public _seguridadEdicionService: SeguridadEdicionService,
    public _route: Router,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this._seguridadEdicionService.initCanales().subscribe(res => {
      
      this.optionAliado = res.aliadosComerciales;
      this.optionCanales = res.canalVentas;
      this.formularios = res.rolesCanales;
      if (localStorage.getItem('EsAliado') == 'true') {
        this.idAliadoComercial = localStorage.getItem('IdAliado').toString();
        this.loadCanalesDefault(parseInt(this.idAliadoComercial,10));
      }
      this.set_Form();
    });
  }

  onChange() {
    const objectActual = this.forma.value;
    this._seguridadEdicionService.obtenerCanales(objectActual.idAliadoComercial).subscribe(res => {
      this.formularios = res;
    });
  }

  loadCanalesDefault(idAliadoComercial: number) {    
    this._seguridadEdicionService.obtenerCanales(idAliadoComercial).subscribe(res => {
      this.formularios = res;
      
    });
  }

  togglePermiso(rowData: any, canalActual: Option) {
    if (rowData.nivel === 1 && rowData.id !== 1 && parseInt(this.forma.value.idAliadoComercial, 10) > 0) {
      rowData[canalActual.value] = !rowData[canalActual.value];
    }
  }

  onSubmit() {
    this.forma.value.listaAcciones = this.formularios;
    this._seguridadEdicionService.saveCanales(this.forma.value);
  }

  set_Form() {
    this.forma = new FormGroup({
      idAliadoComercial: new FormControl(this.idAliadoComercial, Validators.required)
    });
  }
}
