import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ArchivoService } from '../../../backend/archivo.service';
import { FileUpload64 } from '../../../../models/fileUpload64.model';
import swal from 'sweetalert2';
import { UsuarioService } from '../../../backend.service.index';
import { ProductoService } from '../../../backend/producto.service';
import { AliadoComercialListadoService } from '../AliadoComercial/aliadoComercial-listado.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { Observable } from 'rxjs';
import { borderTopLeftRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArchivoCargaService {
  estadoCarga: boolean;
  aliados: any;
  optionAliados: any;
  constructor(
    public _archivoService: ArchivoService,
    public _usuarioService: UsuarioService,
    public _aliadoComercialListadoService: AliadoComercialListadoService,
    public _productoService: ProductoService,
    public _router: Router
  ) {}
  ngOnInit() { 
    this.aliados.push({
      'label': 'TODOS', 'value': '0', 'isModificable': false
    })

    this.optionAliados[0].push(this.aliados)
  }


  initArchivoCarga(): Observable<any> {
    return new Observable(observe => {
      this.getCanal(observe);
    });
  }

  initArchivo(): Observable<any> {
    return new Observable(observe => {
      this.getArchivos(observe);
    });
  }

  getCanal(observer) {
    this._archivoService.getCanalCarga().subscribe(response => {
      if (response.valid) {
       
        observer.next({
          optionCanal: response.data.canales,
          optionTurno: response.data.listaHorarios,
          optionOpcion: response.data.listaOpciones,
          optionAliados: response.data.aliados,

        });
      }
    });
  }


  getArchivos(observer) {
    this._archivoService.getArchivo().subscribe(response => {
      if (response.valid) {
        observer.next({
          optionCanal: response.data.listaCanales,
          optionTurno: response.data.listaHorarios,
          optionOpcion: response.data.listaOpciones,
          optionAliados: response.data.listaAliadoComercial
        });
      }
    });
  }

  refreshFileP(id: any) {
    swal({
      title: 'Carga de Archivos',
      text: '¿Desea confirmar la carga?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._productoService.refreshProducto(id);
        resultadoServicio.subscribe(response => {
          const resultado = response.data.toString().split('|');
          if (resultado[0] === 1) {
            swal(
              'Carga de Productos correctamente!',
              '<div class="alert_content">' + '<i class="far fa-check-circle"></i> ' + resultado[1] + '<br>' + '</div>',
              'success'
            );

            /* this._aliadoComercialService.getEstadoCarga(localStorage.getItem('id').toLocaleLowerCase()).subscribe(resp => {
              if (resp.valid) {
                this.estadoCarga = resp.data.estadoCarga;

                if (this.estadoCarga === 'Sin Cargar') {
                  document.getElementById('refresh').removeAttribute('disabled');
                } else {
                  document.getElementById('refresh').setAttribute('disabled', 'disabled');
                }
              }
            }); */
          } else {
            swal('', '<div">' + '<i class="far fa-times-circle"></i> ' + resultado[1] + '<br>' + '</div>', 'error');
          }
        });
      }
    });
  }

  sendFilePost(base64: FileUpload64) {
    /** Liquidacion*/
    swal({
      title: 'Carga de Archivos',
      text: '¿Desea confirmar la carga?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._usuarioService.loadExcel(base64);
        resultadoServicio.subscribe(response => {
          var msg = '';
          if (response.valid) {

            let jsonR = JSON.parse(response.data.jsonResult);
            msg = '<div class="alert_content">' +
              '<i class="far fa-check-circle"></i> ' +
              response.data.cantidadRegistrosEnArchivo + ' Registro(s) en el archivos' +
              '<br>' +
              '<i class="far fa-check-circle"></i> ' +
              response.data.cantidadRegistrosActualizados + ' Registro(s) Actualizados(s) con éxito.' +
              '<br>' +
              '<i class="far fa-times-circle"></i> ' + 
              response.data.cantidadRegistrosCargados + ' Registro(s) Nuevos(s) con éxito. ' +
              '</div>';
            if(jsonR){
              msg = msg + '<div style="margin-top: 5px;"><table style="margin: auto;"><tr style="padding-bottom: 10px;"><th>Financiamientos que no cumplen restricción:</th></tr>';
              jsonR.forEach(element => {
                msg = msg +'<tr><td><i class="far fa-times-circle"></i> '+element.NroPedidoVenta+'</td></tr>'
              });
              msg = msg + '</table></div>';
            }
              if(response.data.ocupado)
                msg = 'Existe un proceso de carga en curso';
                
              swal(
                response.data.ocupado ? 'Advertencia!' : 'Archivo subido correctamente!',
                msg,
                response.data.ocupado ? 'warning' : 'success'
              );
          }
          else{
        
            msg = response.data.cantidadRegistrosErroneos + 'Registro(s) no cargado(s) por error(es) en el archivo.';
            swal(
              'Error',
              msg,
              'error'
            );
          }
        });
      }
    });
  }

  getJsonResult(jsonString: any){
    var list = JSON.parse(jsonString);
    let r = '';
    list.forEach(element => {
      r = r + element.Categorias;
    });
    return r;
  }

  confirmProduct(id: any, filter: string, event: LazyLoadEvent) {
    swal({
      title: '',
      text: '¿Desea confirmar el cambio de Estado?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._productoService.confirmProducto(id);
        resultadoServicio.subscribe(response => {
          const resultado = response.data.toString().split('|');
          if (resultado[0] === 1) {
            swal(
              'Carga de Productos correctamente!',
              '<div class="alert_content">' + '<i class="far fa-check-circle"></i> ' + resultado[1] + '<br>' + '</div>',
              'success'
            );
            // this._aliadoComercialListadoService.loadLazyFilterWithfilter(event, filter, 0);
          } else {
            swal('', '<div>' + '<i class="far fa-times-circle"></i> ' + resultado[1] + '<br>' + '</div>', 'error');
          }
        });
      }
    });
  }
  
  getRolCanalVenta(idAliadoComercial:number): Observable<any> {
    return this._archivoService.getRolCanalVenta(idAliadoComercial).pipe(
      filter(p => p.valid),
      map(p => p.data)
    );
  }
}
