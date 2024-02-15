import { Injectable, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Usuario } from '../../../../models/usuario.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService, AliadoComercialService, UbigeoService } from '../../../backend.service.index';
import { ExpressionValidation } from '../../../../@core/helpers/expression.validation';
import swal from 'sweetalert2';
import { Option } from '../../../../@core/models/option.model';
import { Sidebar } from 'primeng/primeng';
import { ProductoService } from '../../../backend/producto.service';
import { switchMap, map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEdicionService {
  usuarioId: any;
  usuarioActual: Usuario;
  optionSede: Option[];
  optionUbigeo: Option[];
  optionAliado: Option[];
  optionRoles: Option[];
  optionAccesosList: Option[];
  optionCategoria: Option[];
  optionProducto: Option[];
  listPermiso: Sidebar[];
  firmaUpload: ElementRef;
  inputPassword: ElementRef;
  archivoActual: File;
  mostrarPassword: boolean;
  renderer2: Renderer2;
  rolUsuario: string;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  public maxlengthNroDocumento: number;
  constructor(
    public _route: Router,
    public _usuarioService: UsuarioService,
    public _aliadoComercialService: AliadoComercialService,
    public _productoService: ProductoService,
    public _rendererFactory: RendererFactory2,
    public _ubigeoService: UbigeoService
  ) {
    this.renderer2 = _rendererFactory.createRenderer(null, null);
  }

  init(_activatedRoute: ActivatedRoute): Observable<Usuario> {
    return _activatedRoute.params.pipe(
      switchMap(params => {
        
        const usuarioId = params['id'];
        return this._usuarioService.get(usuarioId).pipe(
          map(response => {
            if (response.valid) {
              return response.data;
            }
          })
        );
      })
    );
  }

  getByUserName(username: string)
  {
    return this._usuarioService.getByUserName(username).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }

  getUsuario(activatedRoute: ActivatedRoute, lista: string): Observable<any> {
    return new Observable(observe => {
      this.processParamRequest(activatedRoute, observe, lista);
    });
  }

  initPermiso(id: any): Observable<any> {
    return new Observable(observe => {
      this.getPermiso(id, observe);
    });
  }

  getPermiso(id: any, observer) {
    this._usuarioService.getPermisos(id).subscribe(response => {
      if (response.valid) {
        this.listPermiso = response.data;
        observer.next({
          listPermiso: this.listPermiso
        });
      }
    });
  }

  initPerfil(): Observable<any> {
    return new Observable(observe => {
      this.getPerfil(observe);
    });
  }

  getPerfil(observer) {
    this._usuarioService.getPerfiles().subscribe(response => {
      if (response.valid) {
        observer.next({
          optionRoles: response.data.rol,
          optionAliado: response.data.aliadoComercial,
          // optionCanalVenta: response.data.canalVenta,
          sendRoles: response.data.rol,
          optionAccesosList: response.data.accionFormulario,
          permisosOtorgados: {}
        });
      }
    });
  }

  permisosRoles(
    //idCanal: number,
    idAliado: number
  ): Observable<any> {
    return new Observable(observe => {
      this.getPermisosRol(
        observe, //idCanal,
        idAliado
      );
    });
  }

  getPermisosRol(
    observer, //idCanal: number,
    idAliado: number
  ) {
    this._usuarioService
      .getAccionesPermisos(
        //idCanal,
        idAliado
      )
      .subscribe(response => {
        if (response.valid) {
          observer.next({
            listaAcciones: response.data.listaAcciones
          });
        }
      });
  }

  processParamRequest(activatedRoute: ActivatedRoute, observer, lista) {
    activatedRoute.params.subscribe(params => {
      this.usuarioId = params['id'];

      if (lista == 'l') {
        this._usuarioService.get(localStorage.getItem('userKey')).subscribe(response => {
          if (response.valid) {
            this.usuarioActual = response.data;
            //this.forma = this.getForm(this.usuarioActual);
            observer.next({
              usuario: this.usuarioActual //,
              //form: this.forma,
              // canales: response.data.canalesVenta
            });
          }
        });
      } else {
        if (this.usuarioId == undefined) this.usuarioId = localStorage.getItem('id') + 'N';
        else this.usuarioId = this.usuarioId + 'G' + localStorage.getItem('id') + 'N';
        this._usuarioService.get(this.usuarioId).subscribe(response => {
          if (response.valid) {
            this.usuarioActual = response.data;
            observer.next({
              usuario: this.usuarioActual
            });
          }
        });
      }
    });
  }

  initSede(alidcoComercialid: string): Observable<any> {
    return new Observable(observe => {
      this.getSede(alidcoComercialid, observe);
    });
  }

  initUbigeo(nivel, id): Observable<any> {
    return new Observable(observe => {
      this.getUbigeo(nivel, id, observe);
    });
  }

  getUbigeo(nivel, id, observer) {
    this._ubigeoService.getUbigeo(nivel, id).subscribe(response => {
      if (response.valid) {
        this.optionUbigeo = response.data;
        observer.next({
          optionUbigeo: this.optionUbigeo
        });
      }
    });
  }

  limitDate(alidcoComercialid: string): Observable<any> {
    return new Observable(observe => {
      this.ilimitDate(alidcoComercialid, observe);
    });
  }

  ilimitDate(aliadoComercialId: string, observer) {
    this._aliadoComercialService.limitDate(aliadoComercialId).subscribe(response => {
      if (response.valid) {
        observer.next({
          optionSede: response.data
        });
      }
    });
  }

  getCodigoAsesor(alidcoComercialid: string): Observable<any> {
    return new Observable(observe => {
      this.get_CodigoAsesor(alidcoComercialid, observe);
    });
  }

  initCategoria(): Observable<any> {
    return new Observable(observe => {
      this.getCategoria(observe);
    });
  }

  initAliado(): Observable<any> {
    return new Observable(observe => {
      this.getAliado(observe);
    });
  }

  initProducto(usuarioid: string): Observable<any> {
    return new Observable(observe => {
      this.getProducto(usuarioid, observe);
    });
  }

  getSede(aliadoComercialId: string, observer) {
    this._aliadoComercialService.getSedes(aliadoComercialId).subscribe(response => {
      if (response.valid) {
        this.optionSede = response.data;
        observer.next({
          optionSede: this.optionSede
        });
      }
    });
  }

  get_CodigoAsesor(aliadoComercialId: string, observer) {
    this._aliadoComercialService.getCodigoAsesorr(aliadoComercialId).subscribe(response => {
      if (response.valid) {
        observer.next({
          codigoAsesor: response.data.codigoAsesor
        });
      }
    });
  }

  getCategoria(observer) {
    this._aliadoComercialService.getCategoria().subscribe(response => {
      if (response.valid) {
        this.optionCategoria = response.data;
        observer.next({
          optionCategoria: this.optionCategoria
        });
      }
    });
  }

  getAliado(observer) {
    this._aliadoComercialService.getAliado().subscribe(response => {
      if (response.valid) {
        this.optionAliado = response.data;
        observer.next({
          optionAliado: this.optionAliado
        });
      }
    });
  }

  getProducto(usuarioid: string, observer) {
    this._productoService.getProducto(usuarioid).subscribe(response => {
      if (response.valid) {
        this.optionProducto = response.data;
        observer.next({
          optionProducto: this.optionProducto
        });
      }
    });
  }
  getForm(userref: Usuario) {
    return new FormGroup({
      id: new FormControl(userref.id),
      userName: new FormControl(userref.userName, [
        Validators.required,
        Validators.pattern(ExpressionValidation.LetterNumber)
      ]),
      password: new FormControl(userref.password, [Validators.minLength(8)]),
      nombres: new FormControl(userref.nombres, [
        Validators.required,
        Validators.pattern(ExpressionValidation.LetterSpace)
      ]),
      apellidos: new FormControl(userref.apellidos, [
        Validators.required,
        Validators.pattern(ExpressionValidation.LetterSpace)
      ]),
      tipoDocumento: new FormControl(userref.tipoDocumento ? userref.tipoDocumento.toString() : null),
      nroDocumento: new FormControl(userref.nroDocumento),
      correo: new FormControl(userref.correo, [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]),
      rolId: new FormControl(userref.rolId.toString(), [Validators.required, Validators.min(1)]),
      aliadoComercialId: new FormControl(userref.aliadoComercialId ? userref.aliadoComercialId.toString() : null),
      sedeId: new FormControl(userref.sedeId ? userref.sedeId.toString() : null),
      codigoAsesor: new FormControl(userref.codigoAsesor)
    });
  }

  validadNroDocumento(forma: FormGroup, tipoDocumento: string) {
    forma.get('nroDocumento').setValue('');
    forma.get('nroDocumento').setValidators(null);
    forma.get('nroDocumento').clearValidators();
    if (tipoDocumento === 'PE2') {
      forma
        .get('nroDocumento')
        .setValidators([Validators.required, Validators.maxLength(8), Validators.pattern(ExpressionValidation.Dni)]);
      this.maxlengthNroDocumento = 8;
    } else if (tipoDocumento === 'PE3') {
      forma.get('nroDocumento').setValidators([Validators.required, Validators.minLength(9), Validators.maxLength(9)]);
      this.maxlengthNroDocumento = 9;
    } else {
      forma.get('nroDocumento').setValidators([Validators.required, Validators.minLength(7), Validators.maxLength(9)]);
      this.maxlengthNroDocumento = 9;
    }
    forma.get('nroDocumento').updateValueAndValidity();
  }

  updatePassword(refusuario: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._usuarioService.updatePassword(localStorage.getItem('userKey'), refusuario);

        resultadoServicio.subscribe(response => {
          if (response.valid) {
            //this.cancel();
            swal('Cantraseña Actualizada!', 'La operación se realizó satisfactoriamente', 'success');
          }
        });
      }
    });
  }

  saveChange(refusuario: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio =
          refusuario.id > 0
            ? this._usuarioService.update(refusuario.id, refusuario)
            : this._usuarioService.add(refusuario);

        resultadoServicio.subscribe(response => {
          if (response.valid) {
            this.cancel();
            const mensaje = refusuario.id > 0 ? 
            "La operación se realizó satisfactoriamente." : 'Se creó usuario, contraseña temporal se envió a correo registrado.';
            swal(mensaje, '', 'success');
          }
        });
      }
    });
  }

  savePerfiles(_perfiles: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._usuarioService.setPerfiles(_perfiles);
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            this.cancel();
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  cancel() {
    this._route.navigate(['/listado-usuario']);
  }

  getRolUsuario(): string {
    return (this.rolUsuario = localStorage.getItem('RolUsuario'));
  }
}
