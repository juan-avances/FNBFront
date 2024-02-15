import { Component, OnInit } from '@angular/core';
import { SeguridadEdicionService } from '../../../../services/feature.service.index';
import { Option } from '../../../../@core/models/option.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from '../../../../services/global.service';
import { OptionToggle } from 'src/app/models/optionToggle.model';
import { FormularioPermiso } from 'src/app/models/formularioPermiso.model';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {
  optionRoles: OptionToggle[];
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
    this._seguridadEdicionService.init().subscribe(res => {
      this.optionAliado = res.aliadosComerciales;
      this.optionRoles = res.roles;
      this.formularios = res.formularios;
      
      if (localStorage.getItem('IdAliado') !== null) {
        
        this.idAliadoComercial = localStorage.getItem('IdAliado').toString();
        this.loadPermisoDefault(parseInt(this.idAliadoComercial, 10));
      }
      this.set_Form();
    });
  }

  onChange() {
    const objectActual = this.forma.value;
    this._seguridadEdicionService
      .obtenerPermisos(
        objectActual.idAliadoComercial
      )
      .subscribe(res => {
        this.formularios = res;
      });
  }

  loadPermisoDefault(idAliadoComercial: number) {
    this._seguridadEdicionService
      .obtenerPermisos(idAliadoComercial)
      .subscribe(res => {
        this.formularios = res;
      });
  }

  togglePermiso(rowData: any, rolActual: Option) {
    if (
      rowData.nivel === 2 &&
      parseInt(this.forma.value.idAliadoComercial, 10) > 0
    ) {
      rowData[rolActual.value] = !rowData[rolActual.value];
    }
  }

  onSubmit() {
    this.forma.value.listaAcciones = this.formularios;
    this._seguridadEdicionService.save(this.forma.value);
  }

  set_Form() {
    this.forma = new FormGroup({
      idAliadoComercial: new FormControl(
        this.idAliadoComercial,
        Validators.required
      )
    });
  }
}
