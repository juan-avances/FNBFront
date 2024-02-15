import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/primeng';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { tsXLXS } from 'ts-xlsx-export';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { FileUpload64 } from 'src/app/models/fileUpload64.model';
import { ArchivoCargaService } from 'src/app/services/feature.service.index';
import { AliadoComercialListadoService } from 'src/app/services/feature/Administracion/AliadoComercial/aliadoComercial-listado.service';
import { ProductoService } from 'src/app/services/backend/producto.service';
import { GlobalService } from 'src/app/services/global.service';

export interface Estados {
  value: string;
  valueName: string;
}

@Component({
  selector: 'app-lista-carga',
  templateUrl: './lista-carga.component.html',
  styles: []
})
export class ListaCargaComponent implements OnInit {
  @ViewChild('dt', { static: false })
  public modeEstadoselect;
  public modeAliadoselect;

  eventR: LazyLoadEvent;
  dataAliado: PrimeTable;
  dataTable: Table;
  archivoActual: string;
  base64: FileUpload64;

  estados: Estados[] = [
    { value: 'Sin Cargar', valueName: 'Sin Cargar' },
    { value: 'Actualizado', valueName: 'Actualizado' },
    { value: 'Confirmado', valueName: 'Confirmado' }
  ];

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _archivoService: ArchivoCargaService,
    public _aliadoComercialListadoService: AliadoComercialListadoService,
    public _productoService: ProductoService,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    // this.dataAliado = this._aliadoComercialListadoService.init(this.dataTable) as PrimeTable;
  }

  loadAliadosLazy(event: LazyLoadEvent) {
    // this.eventR = event;
    // this._aliadoComercialListadoService.loadLazyFilterWithfilter(event, null, 0);
  }

  confirm(id?: any) {
    // this._archivoService.confirmProduct(
    //   id,
    //   'aliado:' +
    //     (this.modeAliadoselect != null ? this.modeAliadoselect.toString() : '') +
    //     '-estado:' +
    //     (this.modeEstadoselect != null ? this.modeEstadoselect.toString() : ''),
    //   this.eventR
    // );
  }

  change(event) {
    // this._aliadoComercialListadoService.loadLazyFilterWithfilter(
    //   this.eventR,
    //   'aliado:' + (this.modeAliadoselect != null ? this.modeAliadoselect.toString() : '') + '-estado:' + event.value,
    //   1
    // );
  }

  onInput(value) {
    // if (this.modeEstadoselect != null) if (this.modeEstadoselect.toString() == '[object Object]') this.modeEstadoselect = null;
    // this._aliadoComercialListadoService.loadLazyFilterWithfilter(
    //   this.eventR,
    //   'aliado:' + value + '-estado:' + (this.modeEstadoselect != null ? this.modeEstadoselect.toString() : ''),
    //   1
    // );
  }

  download(id?: any) {
    const resultadoServicio = this._productoService.exportProducto(id);
    resultadoServicio.subscribe(response => {
      if (response.data.length > 0) {
        var jsonData = [];

        for (var i = 0; i < response.data.length; i++) {
          jsonData[i] = {
            Categoria: response.data[i].categoria,
            Tipo: response.data[i].tipo,
            SKU: response.data[i].sku,
            Descripcion: response.data[i].descripcion,
            Precio: response.data[i].precio,
            'Precio Aliado': response.data[i].precioAliado
          };
        }

        tsXLXS()
          .exportAsExcelFile(jsonData)
          .saveAsExcelFile('Productos');
      }
    });
  }

  onArchivoSeleccionado($event, id: any) {
    if ($event.target.files.length === 1) {
      this.archivoActual = $event.target.files[0].name;

      this.base64 = {};
      this.base64.id = id;

      var vm_r = this;
      var reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);

      reader.onload = function() {
        var fileBase64 = reader.result;
        fileBase64 = fileBase64.toString().split(',')[1];
        vm_r.base64.Base64 = fileBase64;

        vm_r.sendDisabledProducto(vm_r.base64);

        return vm_r;
      };
    }
  }

  sendDisabledProducto(base64: FileUpload64) {
    swal({
      title: '',
      text: '¿Desea confirmar la carga?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7ccef3',
      cancelButtonColor: '#616365',
      confirmButtonText: '<i class="fas fa-save"></i> Guardar',
      cancelButtonText: '<i class="fas fa-ban"></i> Cancelar'
    }).then(result => {
      if (result.value) {
        const resultadoServicio = this._productoService.disabledProduct(base64);
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            swal(
              'Archivo subido correctamente!',
              '<div class="alert_content">' +
                '<i class="far fa-check-circle"></i> ' +
                response.data.toString() +
                '</div>',
              'success'
            );
          }
        });
      }
    });
  }
}
