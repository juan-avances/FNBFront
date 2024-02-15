import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { Option, State } from 'src/app/@core/models/option.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable, Column } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { UsuarioService } from 'src/app/services/backend.service.index';
import { UsuarioListadoService, UsuarioEdicionService } from 'src/app/services/feature.service.index';
import { FormControl, FormGroup } from '@angular/forms';
import { HELPER } from 'src/app/constants/helper';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-listado-usuario',
  templateUrl: './usuario-listado.component.html',
  styles: []
})
export class UsuarioListadoComponent implements OnInit, AfterViewInit {
  @ViewChild('dt', { static: false })
  dataTable: PagingGridComponent;

  dataEntity: PrimeTable;
  visibleColumns: Column[];

  rolId: number;
  aliadoComercialId: number;
  sedeId: number;
  tipoDocumento: string;
  usuarioGroup = new FormGroup({
    idUsuario: new FormControl(""),
    idAliado: new FormControl(""),
    idEstado: new FormControl(""),
    idSede: new FormControl(""),
    idRol: new FormControl(""),
    tipoDocumento: new FormControl(""),
    dni: new FormControl(""),
    nombres: new FormControl(""),
    apellidos: new FormControl(""), 
    correo: new FormControl(""),
  });

  getItemForm: any;

  aliados: Option[];
  roles: Option[];
  sedes: Option[];
  tipoDocumentos: Option[];
  estado: number = 0;
  constructor(
    public _activatedRoute: ActivatedRoute,
    public _usuarioListadoService: UsuarioListadoService,
    public _usuarioEdicionService: UsuarioEdicionService,
    public _usuarioServicio: UsuarioService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute,
    private _router: Router
  ) {
  }

  ngAfterViewInit() {



    this._usuarioListadoService.callbackInitAsync().subscribe(response => {
      this.aliados = response.aliados;
      this.roles = response.roles;
      this.sedes = response.sedes;
      this.tipoDocumentos = response.tiposDocumentos;
      
      

      if (response.aliadoComercialId) {
        this.aliadoComercialId = response.aliadoComercialId.toString();

        this.dataTable.filter(response.aliadoComercialId, 'aliadoComercialId', 'equals', this.ngReloadParams)

      }

      if (response.sedeId) {
        this.sedeId = response.sedeId.toString();

        this.dataTable.filter(response.sedeId, 'sedeId', 'equals', this.ngReloadParams);
      }

      if (response.rolId) {
        this.rolId = response.rolId.toString();

        this.dataTable.filter(response.rolId, 'rolId', 'equals', this.ngReloadParams);
      }

      // this.dataTable.filter(this.estado.toString(), 'estado', 'equals');

    });
    this.dataEntity = this.init(this.dataTable);




  }

  setearDatos() {
    const paramGetObj = this._router.routerState.snapshot.root.queryParams["obj"];

    if (paramGetObj) {
      this.getItemForm = JSON.parse(HELPER.b64DecodeUnicode(paramGetObj));
    }

    if (this.getItemForm) {
      for (let key in this.getItemForm) {
        this.usuarioGroup.get(key).setValue(this.getItemForm[key]);

      }
    }


  }


  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;

    return (this.dataEntity = this._usuarioListadoService.getConfigTable());
  }


  ngOnInit() {
    this.setearDatos()
    this.dataEntity = this.init(this.dataTable);

  }


  private ngParamsFitlers() {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return {

      aliadoComercialId: { value: this.usuarioGroup.get('idAliado').value, matchMode: 'equals' },
      rolId: { value: this.usuarioGroup.get('idRol').value, matchMode: 'equals' },
      sedeId: { value: this.usuarioGroup.get('idSede').value, matchMode: 'equals' },
      usuario: { value: this.usuarioGroup.get('idUsuario').value, matchMode: 'contains' },
      tipoDocumento: { value: this.usuarioGroup.get('tipoDocumento').value, matchMode: 'equals' },
      dni: { value: this.usuarioGroup.get('dni').value, matchMode: 'contains' },
      nombres: { value: this.usuarioGroup.get('nombres').value, matchMode: 'contains' },
      apellidos: { value: this.usuarioGroup.get('apellidos').value, matchMode: 'contains' },
      correo: { value: this.usuarioGroup.get('correo').value, matchMode: 'contains' },
      estado: { value: this.usuarioGroup.get('idEstado').value, matchMode: 'equals' },
    };
  }

  loadLazy(event: LazyLoadEvent) {


    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    const filters = this.ngParamsFitlers();
    

    if (this.usuarioGroup.get('idAliado').value === undefined || this.usuarioGroup.get('idAliado').value.length === 0) {
      delete filters['aliadoComercialId'];
    }
    if (this.usuarioGroup.get('idRol').value === undefined || this.usuarioGroup.get('idRol').value.length === 0) {
      delete filters['rolId'];
    }
    if (this.usuarioGroup.get('idSede').value === undefined || this.usuarioGroup.get('idSede').value.length === 0) {
      delete filters['sedeId'];
    }
    if (this.usuarioGroup.get('idUsuario').value === null || this.usuarioGroup.get('idUsuario').value.trim() === '') {
      delete filters['usuario'];
    }
    if (this.usuarioGroup.get('tipoDocumento').value === null || this.usuarioGroup.get('tipoDocumento').value.trim() === '') {
      delete filters['tipoDocumento'];
    }
    if (this.usuarioGroup.get('nombres').value === null || this.usuarioGroup.get('nombres').value.trim() === '') {
      delete filters['nombres'];
    }
    if (this.usuarioGroup.get('apellidos').value === null || this.usuarioGroup.get('apellidos').value.trim() === '') {
      delete filters['apellidos'];
    }
    if (this.usuarioGroup.get('correo').value === null || this.usuarioGroup.get('correo').value.trim() === '') {
      delete filters['correo'];
    }
    if (this.usuarioGroup.get('idEstado').value === undefined || this.usuarioGroup.get('idEstado').value == '-1' || this.usuarioGroup.get('idEstado').value === '') {
    
    if (this.usuarioGroup.get('idEstado').value === undefined || this.usuarioGroup.get('idEstado').value.length === 0 || this.usuarioGroup.get('idEstado').value == '' || this.usuarioGroup.get('idEstado').value == '-1') {
      delete filters['estado'];
    }
    
    primerNgFilter.filters=filters;
    this._usuarioServicio.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  }


  exportar() {
    var user = this.usuarioGroup.get("idUsuario").value;
    var aliado = this.usuarioGroup.get("idAliado").value;
    var estado = this.usuarioGroup.get("idEstado").value;
    var sede = this.usuarioGroup.get("idSede").value;
    var rol = this.usuarioGroup.get("idRol").value;
    var archivoNom = 'Usuarios.xlsx'


    var objeto = {
      userName: user,
      idAliado: aliado == "" ? 0 : aliado,
      idSede: sede == "" ? 0 : sede,
      idEstado: estado == undefined ? 2 : estado,
      idRol: rol == "" ? 0 : rol,
      archivo: archivoNom

    }
    this._usuarioServicio.exportarUsuario(objeto).subscribe(blobFile => {
      const url = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = 'Usuarios.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
    /* let obj = this.formGroup.getRawValue();*/
    /*this._usuarioListadoService.exportarUsuario(obj);*/
  }

  updateState(stateModel: State) {
    this._usuarioServicio.updateState(stateModel.id, stateModel.state).subscribe(response => {
      if (response.valid) {
        this.refreshGrid(this.dataTable);
      }
    });
  }

  refreshGrid(dataTable: PagingGridComponent) {
    const options = dataTable.getDataTableOption();

    this.loadLazy({
      filters: {},
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: options.rows,
      sortField: options.sortField,
      sortOrder: options.sortOrder
    });
  }

  change(event, dataTable: any) {
    if (event.value != null) {
      this._usuarioEdicionService.initSede(event.value).subscribe(res => {
        this.sedes = res.optionSede;
      });
    } else {
      this.sedes = null;
    }
    dataTable.filter(event.value, 'aliadoComercialId', 'equals', this.ngReloadParams);

  }

  changeState(event, dataTable: any) {
    var valState = event.value;
    if (valState != null) {
  
      if (valState != -1) {
        
        this._usuarioEdicionService.initSede(valState).subscribe(res => {
          this.sedes = res.optionSede;
        });
      } else {
        valState = null;
        this.sedes = null;
      }
    } else {
      valState = null;
      this.sedes = null;
    }
    this.ngReloadParams();
    //dataTable.filter(valState, 'estado', 'equals', this.ngReloadParams);
  }


  ngReloadParams = () => {

    this._usuarioListadoService.paramFilterSerialize = JSON.stringify(this.usuarioGroup.value);
    const HELP_PARAM = HELPER.b64EncodeUnicode(
      this._usuarioListadoService.paramFilterSerialize
    );
    history.replaceState(history.state, "", "listado-usuario?obj=" + HELP_PARAM);
  }


}
