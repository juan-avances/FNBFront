import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TiendaAliada } from 'src/app/models/tienda-aliada.model';
import { StoreAllyService } from 'src/app/services/backend/store-ally.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class StoreAllyUpdateService {

  constructor(private storeAllyService: StoreAllyService,
              private router: Router) {}

  save(storeAlly: any) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        const operation =
          storeAlly.id > 0
            ? this.storeAllyService.update(storeAlly.id, storeAlly)
            : this.storeAllyService.add(storeAlly);

        operation.subscribe(response => {
          if (response.valid) {
            this.router.navigate(['/tienda-aliada']);
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  init(id: string): Observable<TiendaAliada> {
    return this.storeAllyService.get(id).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }
}
