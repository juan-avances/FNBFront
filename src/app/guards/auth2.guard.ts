import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivate {
  constructor(private router: Router, private globalService: GlobalService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.globalService.isAdministradorAliado() || this.globalService.isAdministradorWeb()) return true;
    else {
      swal.fire('Información', 'Usted no tiene los permisos necesarios para acceder a este recurso.', 'error');
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
