import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { Header, LazyLoadEvent } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';
import { ConsultaCreditoService } from '../../../services/feature.service.index';
import { Option } from '../../../@core/models/option.model';
import { OptionToggle } from 'src/app/models/optionToggle.model';

//--
import { MatDialog } from '@angular/material/dialog';
import { VerConsumoComponent } from '../consulta-credito/ver-consumo.component';
import swal from 'sweetalert2';
import { maxLength, minLength } from '@rxweb/reactive-form-validators';
//--
import { OfflineService } from 'src/app/services/backend/offline.service';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { DataService } from 'src/app/services/servicesData';
@Component({
  selector: 'app-consulta-credito',
  templateUrl: './consulta-credito.component.html',
  styles: []
})
export class ConsultaCreditoComponent implements OnInit {
  
  @ViewChild('dt', { static: false })
  dataTable: Table;
  dnicuenta: string;
  colorGo:string;
  eventT: LazyLoadEvent;
  lineaCredito: string;
  estado:number;
  showBusqueda = false;
  EsRolVendedor = true;
  dataCliente: any;
  ctasContrato: any[];
  permisoConsultarCredito: boolean;
  tipoDocumento: string;
  lenghtValidacion: number;
  optionTiposDocumento: Option[];
  tipoValidacion: string;
  visibctive:boolean=false;
  constructor(
    public _activatedRoute: ActivatedRoute,
    public _global: GlobalService,
    public _consultaCreditoService: ConsultaCreditoService,
    public _headerComponente: HeaderComponent,
    public _dataServices : DataService,
    //--
    public dialog: MatDialog,
    public _offlineService: OfflineService
  ) //--
  {}

  ngOnInit() {
    this.permisoConsultarCredito = this._global.validarPermiso('BUSCRE');
    this._consultaCreditoService.init().subscribe(response => {
      this.optionTiposDocumento = response.tiposDocumento;
    });
    
   
  }
  async ngAfterViewInit() {
    await this._offlineService.getConfiguraciones().subscribe(obj=>{
      this._headerComponente.estado = obj.data.estadoSap;
      this._headerComponente.getCssColor(this._headerComponente.estado);
      
      this._dataServices.setMessage(this._headerComponente.color);
    })   
  }

  goToFinanciamiento(id: number, consulta: number) {
    this._consultaCreditoService.redirectFinanciamiento(id, consulta);
  }

  onSearch(form: NgForm) {
    localStorage.setItem('tipoDocumento',form.value.tipoDocumento)
    localStorage.setItem('dnicuenta',form.value.dnicuenta)
    this._consultaCreditoService.consultaCredito(form.value.dnicuenta, form.value.tipoDocumento).subscribe(response => {
      this.lineaCredito = response.lineaCredito;
      this.dataCliente = response;
      this.ctasContrato = response.cuentasContrato;      
      if(this.ctasContrato.length==0)
      {
        swal({
          title: `Cliente no Encontrado`,
          type: 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
        this.visibctive = false;
      }else{
        this._offlineService.getConfiguraciones().subscribe(obj=>{
          this._headerComponente.estado = obj.data.estadoSap;
          this._headerComponente.getCssColor(this._headerComponente.estado);          
          this._dataServices.setMessage(this._headerComponente.color);
        })
        this.visibctive = true;
      }
      localStorage.setItem('correoSAP',response.correoSAP);
      localStorage.setItem('numeroTelefonoSAP',response.numeroTelefonoSAP)
    });
    this._offlineService.getConfiguraciones().subscribe(obj=>{
      this._headerComponente.estado = obj.data.estadoSap;
      this._headerComponente.getCssColor(this._headerComponente.estado);      
      this._dataServices.setMessage(this._headerComponente.color);
    })
    
  }

  changeTipoDoc(_event: any) {
    this.tipoDocumento = _event.value;
    switch (this.tipoDocumento) {
      case 'PE2':
        this.tipoValidacion = '^[0-9]+$';
        this.lenghtValidacion = 8;
        minLength
        maxLength

      

        break;
      case 'PE3':
      case 'PE5':
        this.tipoValidacion = '^$|^[A-Za-z0-9]+';
        this.lenghtValidacion = 12;
        maxLength
        break;
    }
  }
  //--
  verConsumo(form: NgForm) {
    this.dnicuenta = form.value.dnicuenta;
    this.tipoDocumento = form.value.tipoDocumento;

    const dialogRef = this.dialog.open(VerConsumoComponent, {
      width: '600px',
      data: {
        Documento: this.dnicuenta,
        TipoDocumento: this.tipoDocumento
      }
    });

  }
  //--
}
