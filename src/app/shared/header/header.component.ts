import { Component, OnInit,Input, Output, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/backend.service.index';
import { UsuarioEdicionService } from '../../services/feature.service.index';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { SignalRService } from '../../services/backend/signal-r.service';
import { NotificationService } from '../../services/feature/Administracion/Notifications/toastr-notification.service';
import { HttpClient } from '@angular/common/http';
import { EnviromentService } from '../../@core/services/enviroment.service';
import { CambioClaveComponent } from 'src/app/pages/administracion/mantenimientos/usuario/cambio-clave/cambio-clave.component';
import { OfflineService } from 'src/app/services/backend/offline.service';
import { DataService } from 'src/app/services/servicesData';
import { RolService } from 'src/app/services/backend/rol.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit {
  public NombreCompleto: string | null | undefined;
  public RolUsuario : string | null | undefined;
  public showAliadoName: boolean| undefined;
  public AliadoNombre  :string | null | undefined;
  public showSedeName: boolean| undefined;
  public SedeNombre  :string | null | undefined;
  @Input()color: string | null | undefined;
 
  estado :number| undefined;
  
  constructor(
    public dialog: MatDialog,
    public _authenticationService: AuthenticationService,
    public _usuarioEdicionServicio: UsuarioEdicionService,
    public _activatedRoute: ActivatedRoute,
    public _global: GlobalService,
    public signalRService: SignalRService,
    public _notificationservice: NotificationService,
    public http: HttpClient,
    public _enviromentService: EnviromentService,
    public _offlineService: OfflineService,
    public _dataServices: DataService,
    public _rolService: RolService
  ) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CambioClaveComponent, { width: '400px' });
    this._global.ocultar = false;
    dialogRef.afterClosed().subscribe(result => {
			
    });
  }
  ngAfterViewInit(){
     this._offlineService.getConfiguraciones().subscribe(obj=>{
      this.estado = obj.data.estadoSap;      
     this.getCssColor(this.estado);            
    })
    this._dataServices.getMessage().subscribe(ip => { this.color=ip } );
    return false;
  }
  
  onGetdatos() {
    this._usuarioEdicionServicio.getUsuario(this._activatedRoute, 'l').subscribe(res => {
      let nombreCompleto = res.usuario.nombres.toString() + ' ' + res.usuario.apellidos.toString();
      let rol: string;      
      rol = res.usuario.roles.find(q=>q.value == res.usuario.rolId).label.toString();
      this.showAliadoName = res.usuario.aliadoComercialId ? true : false;
      this.showSedeName = res.usuario.sedeId ? true : false;
      if(this.showAliadoName)
        this.AliadoNombre = res.usuario.aliadosComerciales.find(q=>q.value == res.usuario.aliadoComercialId).label.toString();
      if(this.showSedeName)
      this.SedeNombre = res.usuario.sedes.find(q=>q.value == res.usuario.sedeId).label.toString();

      localStorage.setItem('NombreyApellidos', nombreCompleto);
      localStorage.setItem('RolUsuario', rol);
 
      localStorage.setItem('IdRolUsuario', res.usuario.rolId);
      if(res.usuario.aliadoComercialId)
      {
        localStorage.setItem('IdAliado', res.usuario.aliadoComercialId);
      }
      localStorage.setItem('IdSede', res.usuario.sedeId);

      this.NombreCompleto = localStorage.getItem('NombreyApellidos');

      this.RolUsuario = localStorage.getItem('RolUsuario');

      this._rolService.initList(null).subscribe(resr =>{
        var rowSelected = resr.data.find(x=>x.id == res.usuario.rolId);
        if(rowSelected)
          localStorage.setItem('EsAliado', rowSelected.esAliado);

      });
    });   
  }

  cerrarSesion() {
    localStorage.clear();
    this._global.ocultar = false;
    this._authenticationService.cerrarSesion();
    this.signalRService.closeConnection();
  }

  async ngOnInit() {
    this.onGetdatos();
    this.startHttpRequest();

    await this._offlineService.getConfiguraciones().subscribe(obj=>{
      this.estado = obj.data.estadoSap;      
      this.getCssColor(this.estado);      
    })
  }
  private startHttpRequest = () => {

    if (localStorage.getItem('IdRolUsuario') !== null && (localStorage.getItem('IdRolUsuario').toString() == '2' || localStorage.getItem('IdRolUsuario').toString() == '3')
    ) {
      this.http.get(`${this._enviromentService.urlBaseServicios}notificacion/grupo`).subscribe(res => {
        this.signalRService.setNotificationService(this._notificationservice);
        this.signalRService.startConnection(res);
        this.signalRService.showNotifationGroupListener();
        this.signalRService.deleteNotificationListener();
      });
    }
  };

  getCssColor(estado: number)  {
    if (estado === 0) {
      this.color= '#00FF7F';
    } else {
      this.color= '#FF1100';
    }
  }
}
