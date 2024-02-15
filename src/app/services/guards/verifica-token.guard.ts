import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { AuthenticationService } from '../backend.service.index';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {
  constructor(public _authenticationService: AuthenticationService, public router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    const token = this._authenticationService.getAuthorizationToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  expirado(fechaExp: number) {
    const ahora = new Date().getTime() / 1000;

    if (fechaExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
