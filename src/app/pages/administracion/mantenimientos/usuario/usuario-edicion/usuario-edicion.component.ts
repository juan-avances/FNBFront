import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioEdicionService } from 'src/app/services/feature/Administracion/Usuario/usuario-edicion.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { SeguridadService } from 'src/app/services/backend.service.index';

import { Location } from '@angular/common';
@Component({
  selector: 'app-edicion-usuario',
  templateUrl: './usuario-edicion.component.html',
  styles: []
})
export class UsuarioEdicionComponent implements OnInit {
  showPassword: boolean;
  usuarioActual: Usuario;
  forma: FormGroup;
  rolControl: FormControl;
  aliadoComercialId: number;
  disabledAliadoComercial: boolean;
  isEdit: boolean = false;
  constructor(
    public _activatedRoute: ActivatedRoute,
    public _usuarioEdicionServicio: UsuarioEdicionService,
    public _renderer2: Renderer2,
    public _seguridadService: SeguridadService,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._usuarioEdicionServicio.init(this._activatedRoute).subscribe(response => {
      if (!response) {
        this.cancelar();
        return;
      }
      if (response.id != 0)
        this.isEdit = true;
      this.usuarioActual = response;
      this.aliadoComercialId = response.aliadoComercialId;
      
      this.disabledAliadoComercial = response.rolLogueadoId == 1 || response.rolLogueadoId == 8 ? false : true;
      this.forma = this._usuarioEdicionServicio.getForm(this.usuarioActual);
      this.rolControl = this.forma.get('rolId') as FormControl;
      if (Number.isInteger(this.usuarioActual.id) && this.usuarioActual.id == 0) {
        this.forma.get('userName').setValue('');
        this.forma.get('password').setValue('');
      }
    });
  }

  onSubmit() {
    if (this.forma.valid) {
      this._usuarioEdicionServicio.saveChange(this.forma.getRawValue());
    }
  }

  cancelar() {
    //this._usuarioEdicionServicio.cancel();
    this.location.back();

  }

  aliadoChange(event: any) {
    this.cargarSedes(event);
  }

  cargarSedes(event: any) {
    if (event.value != null) {
      this._usuarioEdicionServicio.initSede(event.value).subscribe(res => {
        this.usuarioActual.sedes = res.optionSede;
      });
    } else {
      this.usuarioActual.sedes = null;
    }
  }

  rolChange(event: any) {
    const aliado = this.forma.get('aliadoComercialId');
    const sede = this.forma.get('sedeId');

    if (!aliado.value) {
      this.usuarioActual.sedes = null;
    }

    if (event.value == 1 || event.value == 7) {
      this.forma.controls['aliadoComercialId'].setValue(null);
      this.forma.controls['sedeId'].setValue(null);
      aliado.clearValidators();
      aliado.updateValueAndValidity();
      sede.clearValidators();
      sede.updateValueAndValidity();
    }
    if (event.value == 2) {
      this.forma.controls['sedeId'].setValue(null);
      aliado.setValidators([Validators.required]);
      sede.clearValidators();
      sede.updateValueAndValidity();
    }
    if (event.value > 2) {
      aliado.setValidators([Validators.required]);
      sede.setValidators([Validators.required]);
    }
  }
  changeTipoDocumento(value: string) {
    this._usuarioEdicionServicio.validadNroDocumento(this.forma, value);
  }
  restoredPassword() {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        if (!this.forma.get('userName').value) {
          swal("Error", "Ingrese el nombre usuario", 'error');
          return;
        }

        let lt = localStorage.getItem('lat');
        lt = lt ? lt : "";
        let lng = localStorage.getItem('lng');
        lng = lng ? lng : "";
        this._seguridadService.olvideContrasena(this.forma.get('userName').value, 2, lt, lng).subscribe((response) => {
          if (response.valid)
            swal("Enviado", "Se envio una contraseña temporal al correo electrónico configurado en su usuario en la plataforma FNB. Por favor revisar su bandeja de correo.", 'success');
          else
            swal("Error", response.message, 'error');
        });
      }
    });




  }

}
