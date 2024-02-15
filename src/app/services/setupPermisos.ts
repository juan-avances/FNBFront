import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import swal from 'sweetalert2';

@Injectable()
export class SetupPermisos {
  constructor(public globalService: GlobalService) {}

  public initliaze(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.globalService.getPermisos().subscribe(
        response => {
          if (response.valid) {
            this.globalService.permisos = response.data;
          } else {
            swal({
              title: response.message,
              type: 'error',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 5000
            });
          }

          resolve(true);
        },
        err => {}
      );
    });
  }
}
