import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { GlobalService } from 'src/app/services/global.service';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { CategoryService } from 'src/app/services/backend.service.index';
import { LazyLoadEvent } from 'primeng/primeng';
import { OfflineService } from 'src/app/services/backend/offline.service';
import Swal from 'sweetalert2';
import { OfflineFeatureService } from 'src/app/services/feature/Administracion/Offline/offline-feature.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DataService } from 'src/app/services/servicesData';
@Component({
  selector: 'app-offline-index',
  templateUrl: './offline-index.component.html',
  styleUrls: []
})
export class OfflineIndexComponent implements OnInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  offline:boolean;

  sapfechaInicio:Date;
  sapfechaIniciot:string;
  sapfechaFin:Date;
  sapfechaFint:string;

  estadoOffline:string;
  cantidadEnvio:string;
  tiempoEnvio:string;
  fechaInicio:Date;
  fechaFin:Date;
  fechaIniciot:string;
  fechaFint:string;

  formGroup: FormGroup;
  estado: number = 1;
  constructor(
    private formBuilder: FormBuilder,
    public _global: GlobalService,
    public offlineFeatureService: OfflineFeatureService,
    public _categoryService: CategoryService,
    public _offlineService: OfflineService,
    public _headerComponente: HeaderComponent,
    public _dataServices : DataService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.dataEntity = this.init(this.dataTable);
    this.actualizarConfiglista();
  }

  async ngAfterViewInit() {
    await this._offlineService.getConfiguraciones().subscribe(obj=>{
      this._headerComponente.estado = obj.data.estadoSap;
      this._headerComponente.getCssColor(this._headerComponente.estado);
      this._dataServices.setMessage(this._headerComponente.color);
    })   
  }
  
  actualizarConfiglista(){
    /*this._offlineService.getObtenerParametrosOffline(3).subscribe(obj=>{
      if (obj.valid) {
        this.sapfechaInicio= obj.data.fechaInicio.split("T")[0];
        this.sapfechaIniciot= obj.data.fechaInicio.split("T")[1];
        this.sapfechaFin= obj.data.fechaFin.split("T")[0];
        this.sapfechaFint= obj.data.fechaFin.split("T")[1];
      }
    });*/
    this._offlineService.getConfiguraciones().subscribe(obj=>{
      this.estadoOffline = obj.data.estadoOffline;
      this.cantidadEnvio = obj.data.cantidadEnvio;
      this.tiempoEnvio = obj.data.tiempoEnvio;
      this.fechaInicio = obj.data.fechaInicio.split("T")[0];
      this.fechaIniciot = obj.data.fechaInicio.split("T")[1];
      this.fechaFin = obj.data.fechaFin.split("T")[0];
      this.fechaFint = obj.data.fechaFin.split("T")[1];
      this.offline = obj.data.estadoVigencia==0;
      this.sapfechaInicio = obj.data.finicioVigencia.split("T")[0];
      this.sapfechaIniciot = obj.data.finicioVigencia.split("T")[1];
      this.sapfechaFin = obj.data.ffinVigencia.split("T")[0];
      this.sapfechaFint = obj.data.ffinVigencia.split("T")[1];
    });
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      sapfechaInicio: [this.sapfechaInicio],
      sapfechaIniciot:[this.sapfechaIniciot],
      sapfechaFin: [this.sapfechaFin],
      sapfechaFint:[this.sapfechaFint],

      name: [''],
      code: [''],
      estado: [this.estado],
      estadoOffline: [this.estadoOffline],
      cantidadEnvio: [this.cantidadEnvio],
      tiempoEnvio: [this.tiempoEnvio],
      fechaInicio:[this.fechaInicio],
      fechaFin:[this.fechaFin],
      fechaIniciot:[this.fechaIniciot],
      fechaFint:[this.fechaFint]
    });
  }

  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this.offlineFeatureService.getConfigTable());
  }

  search(control: string) {
    if (this.formGroup.valid) {
      switch (control) {
        case 'name': {
          this.dataTable.filter(this.formGroup.controls.name.value, 'name', 'contains');
          break;
        }
        case 'code': {
          this.dataTable.filter(this.formGroup.controls.code.value, 'code', 'equals');
          break;
        }
      }
    }
  }

  loadLazy(event: LazyLoadEvent) {
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    this._offlineService.getListarFinanciamientoOffline(primerNgFilter).subscribe(response => {
      if (response.valid) {
        response.data.entities.forEach(e => {
          let splitfecha = e.fechaventa.split('.')[0].split('T');
          let hora = splitfecha[1];
          let dia = splitfecha[0].split('-')[2];
          let mes = splitfecha[0].split('-')[1];
          let anio = splitfecha[0].split('-')[0];
          e.fechaventa= dia+"/"+mes+"/"+anio+" "+hora;
        });
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  
  filterFechaInicio(event) {
    if (event.value != null) {
      this.fechaInicio = event.value;
    } 
  }

  filterFechaFin(event) {
    if (event.value != null) {
      this.fechaFin = event.value;
    } 
  }

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
  }

  isDateBeforeToday(date) {
    return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

  actualizarConfOffline(){ 
    Swal.showLoading();

    const fecha = new Date();

    if (this.sapfechaInicio == null || this.sapfechaInicio== undefined) {
      Swal("Dato Faltante","Fecha Inicio","warning");
      Swal.hideLoading();
      return;
    }

    if (this.sapfechaFin == null || this.sapfechaFin== undefined) {
      Swal("Dato Faltante","Fecha Fin","warning");
      Swal.hideLoading();
      return;
    }
      
    if (this.sapfechaFin < this.sapfechaInicio ) {
      Swal("Fecha Inválida","La Fecha Inicio debe ser menor o igual a la Fecha Fin.","warning");
      Swal.hideLoading();
      return;
    }
  

    this._offlineService.postRegistrarVigenciaOffline({
      "FechaInicio":this.sapfechaInicio+"T"+this.sapfechaIniciot,
      "FechaFin":this.sapfechaFin+"T"+this.sapfechaFint,
      "EstadoOffline":this.offline?0:1,
    }).subscribe(p3=>{
      Swal("Éxito","Se actualizó la configuración correctamente.","success");
      this.actualizarConfiglista();
      
      Swal.hideLoading();
    })
  }

  actualizarConf(){ 
    Swal.showLoading();

    const fecha = new Date();

    if ((this.cantidadEnvio+"").includes(".") || isNaN(Number.parseInt(this.cantidadEnvio)) || Number.parseInt(this.cantidadEnvio) <1) {
      Swal("Dato Inválido","Cantidad de Envío","warning");
      Swal.hideLoading();
      return;
    }
    if ((this.tiempoEnvio+"").includes(".") || isNaN(Number.parseInt(this.tiempoEnvio)) || Number.parseInt(this.tiempoEnvio) <1) {
      Swal("Dato Inválido","Tiempo de Envío","warning");
      Swal.hideLoading();
      return;
    }

    if (this.fechaInicio == null || this.fechaInicio== undefined) {
      Swal("Dato Faltante","Fecha de inicio","warning");
      Swal.hideLoading();
      return;
    }

    if (this.fechaFin == null || this.fechaFin== undefined) {
      Swal("Dato Faltante","Fecha de fin","warning");
      Swal.hideLoading();
      return;
    }

    if (this.fechaFin < this.fechaInicio ) {
      Swal("Fecha Inválida","La Fecha Inicio debe ser menor o igual a la Fecha Fin.","warning");
      Swal.hideLoading();
      return;
    }


    this._offlineService.postActualizarConfiguracion({
      "EstadoOffline":this.estadoOffline,
      "CantidadEnvio":this.cantidadEnvio,
      "TiempoEnvio":this.tiempoEnvio,
      "FechaInicio":this.fechaInicio+"T"+this.fechaIniciot,
      "FechaFin":this.fechaFin+"T"+this.fechaFint,
    }).subscribe(p=>{
      
      Swal("Éxito","Se actualizó la configuración correctamente.","success");
      this.actualizarConfiglista(); 
      Swal.hideLoading();

    },e=>{      
      
    })
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();
    const filters = {
      estado: { value: this.formGroup.controls.estado.value, matchMode: 'equals' },
      name: { value: this.formGroup.controls.name.value, matchMode: 'contains' },
      code: { value: this.formGroup.controls.code.value, matchMode: 'contains' }
    };
    if (this.formGroup.controls.estado.value === undefined) {
      delete filters['estado'];
    }
    const a = this.loadLazy({
      filters: filters,
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: options.rows,
      sortField: options.sortField,
      sortOrder: options.sortOrder
    });
  }

  obtenerFechaActual(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    return yyyy+'-'+ mm + '-' + dd ;
  }
}
