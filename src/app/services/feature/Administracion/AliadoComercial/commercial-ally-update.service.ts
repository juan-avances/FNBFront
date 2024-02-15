import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { switchMap, map, delay } from 'rxjs/operators';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import { AliadoComercialService } from '../../../backend/aliadoComercial.service';

@Injectable({
  providedIn: 'root'
})
export class CommercialAllyUpdateService {
  constructor(private aliadoComercialService: AliadoComercialService, private router: Router) {}

  save(commercialAlly: any) {
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
          commercialAlly.id > 0
            ? this.aliadoComercialService.update(commercialAlly.id, commercialAlly)
            : this.aliadoComercialService.add(commercialAlly);

        operation.subscribe(response => {
          if (response.valid) {
            this.router.navigate(['/commercial-ally-index']);
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  init(id: string): Observable<AliadoComercial> {
    return this.aliadoComercialService.get(id).pipe(
      map(response => {
        if (response.valid) {
          return response.data;
        }
      })
    );
  }
}
