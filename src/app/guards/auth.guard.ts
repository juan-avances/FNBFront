import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';
import swal from 'sweetalert2';
import { SeguridadService } from '../services/backend.service.index';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private globalService: GlobalService, public _seguridadServicio: SeguridadService,) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    var url = next.url[0].path;

    return new Promise<boolean>((resolve, reject)=>{
      this._seguridadServicio.AccesoMenu(url).subscribe(response => {
        var exist = response.data;
        
        if(exist) return resolve(true);
        else {
        swal('Información', 'Usted no tiene los permisos necesarios para acceder a este recurso.', 'error');
        this.router.navigate(['/dashboard']);
        return resolve(false);
      }
      });
    });
    //if (this.globalService.isAdministradorWeb() || this.globalService.isGMantenimientoWeb())
   
    
  }

  obtenerAcceso(url: any): Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject)=>{
      this._seguridadServicio.AccesoMenu(url).subscribe(response => {
        resolve(response.data)
      });
    })
    
  }
}
