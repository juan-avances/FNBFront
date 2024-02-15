import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable()
export class MessageErrorInterceptor implements HttpInterceptor {
  constructor(public _router: Router) {}

  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse && event.ok) {
            if (!event.body.valid) {
              if (event.body.message != null && event.body.message != undefined) {
                if (event.body.message.includes('Cliente No Disponible')) {
                  swal({
                    title: event.body.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000
                  });
                } else {
                  
                  swal({
                    html: '<div  style=" display: table;margin: 0 auto;"><p style="font-size: 18px;">'+event.body.message+'</p></div>',
                    type: 'warning',
                    showConfirmButton: false,
                    showCloseButton: true,
                    allowOutsideClick:false
                  });
                }
              }
            }
          }
        },
        // Operation failed; error is an HttpErrorResponse
        (error: HttpErrorResponse) => {}
      )
    );
  }
}
