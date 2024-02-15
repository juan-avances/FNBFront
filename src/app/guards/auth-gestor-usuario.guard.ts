import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalService } from '../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGestorUsuarioGuard implements CanActivate {
  constructor(private router: Router, private globalService: GlobalService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {      
      if (this.globalService.isGUsuariorWeb()) return true;
      else {
        swal('Información', 'Usted no tiene los permisos necesarios para acceder a este recurso.', 'error');
        this.router.navigate(['/dashboard']);
        return false;
      }
  }
}
