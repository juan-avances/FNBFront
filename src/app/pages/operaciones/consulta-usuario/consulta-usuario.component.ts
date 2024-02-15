import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Column, PrimeTable } from 'src/app/@core/models/prime-table.model';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { Option, State } from 'src/app/@core/models/option.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioEdicionService, UsuarioListadoService } from 'src/app/services/feature.service.index';
import { UsuarioService } from 'src/app/services/backend.service.index';
import { GlobalService } from 'src/app/services/global.service';
import { HELPER } from 'src/app/constants/helper';
import { LazyLoadEvent } from 'primeng/primeng';
import { ConsultaUsuarioService } from 'src/app/services/feature/Administracion/consulta-usuario/consulta-usuario.service';
import { MatDialog } from '@angular/material';
import { CambioSedeComponent } from '../cambio-sede/cambio-sede.component';

@Component({
  selector: 'app-consulta-usuario',
  templateUrl: './consulta-usuario.component.html',
  styleUrls: ['./consulta-usuario.component.scss']
})
export class ConsultaUsuarioComponent implements OnInit, AfterViewInit {
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
  estado: number = 1;
  constructor(
    public _activatedRoute: ActivatedRoute,
    // public _usuarioListadoService: UsuarioListadoService,
    public _usuarioEdicionService: UsuarioEdicionService,
    public _usuarioServicio: UsuarioService,
    public _consultaUsuarioServicio: ConsultaUsuarioService,
    public _global: GlobalService,
    public _rutaActiva: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
  ) { }
  
  ngAfterViewInit(){
    this._consultaUsuarioServicio.refreshAfterUploadFile = this;
    this._consultaUsuarioServicio.callbackInitAsync().subscribe(response => {
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

    });
    this.dataEntity = this.init(this.dataTable);
  }

  ngOnInit() {
    this.setearDatos()
    this.dataEntity = this.init(this.dataTable);
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
      delete filters['estado'];
    }
    this._consultaUsuarioServicio.paramLoadLazy = event;
    primerNgFilter.filters=filters;
    this._usuarioServicio.loadLazyFilter(primerNgFilter, '').subscribe(response => {
      if (response.valid) {
        
        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;
      }
    });
  }

  /**Inicializar filtro */
  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._consultaUsuarioServicio.getConfigTable());
  }

  /**Filtro de busqueda */
  ngReloadParams = () => {
    this._consultaUsuarioServicio.paramFilterSerialize = JSON.stringify(this.usuarioGroup.value);
    const HELP_PARAM = HELPER.b64EncodeUnicode(
      this._consultaUsuarioServicio.paramFilterSerialize
    );
    history.replaceState(history.state, "", "consulta-usuario?obj=" + HELP_PARAM);
  }

  
}
