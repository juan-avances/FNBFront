import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import swal from 'sweetalert2';
import { AppConstant } from '../constants/app.constant';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(public _router: Router, public _injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        event => { },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            swal({
              title: 'Debe iniciar sesión para ver este contenido.',
              type: 'error',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 4000
            });

            this._router.navigate(['/login']);
          } else {
            console.log("error: ", error)
            swal({
              title: 'Ocurrió un error durante el proceso, intente nuevamente.',
              type: 'error',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 4000
            });

            if (error.url === AppConstant.BaseUrl) {
              this._router.navigate(['/financiamientos']);              
              return;
            }
          }
        }
      )
    );
  }
}
