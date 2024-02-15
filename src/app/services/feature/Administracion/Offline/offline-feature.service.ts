import { Injectable } from '@angular/core';
import { PrimeTable } from '../../../../@core/models/prime-table.model';
import { Router } from '@angular/router';
import { FeatureListService } from '../../../../@core/services/feature-list.service';
import { FeatureListConfig } from '../../../../@core/models/feature-list.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { Category } from '../../../../models/category.model';
import { OfflineService } from 'src/app/services/backend/offline.service';
import swal from 'sweetalert2';
import { FinanciamientoArchivoService } from 'src/app/services/backend.service.index';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineFeatureService {
  grillaLoad: Subject<any> = new Subject();
  constructor(public _route: Router,public categoryService: OfflineService, public router: Router) {
    
    // super(
    //   new FeatureListConfig('category', '/category-form'),
    //   categoryService,
    //   router
    // );
  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Eliminar',
          icon: 'delete',
          type: 'Material',
          visibilidity : (p) => true,
          click: (p) => this.deleteOffline(p.idfinanciamiento),
        },
      ],
      options: {
        showAdd: false,
        showSearch: true,
        showDelete: false,
        showChangeState: false,
        showIndex: false,
        showEdit: false,
        accionesWidth:0
      },
      columnas: [
        {
          field: 'idfinanciamiento',
          header: 'ID',
          order: false,
          search: true,
        },
        {
          field: 'cuentacontrato',
          header: 'CC',
          order: false,
          search: true,
        },
        {
          field: 'dni',
          header: 'DNI',
          order: false,
          search: true
        },
        {
          field: `fechaventa`,
          header: 'Fecha Venta',
          order: false,
          search: true
        },
        {
          field: 'montocuota',
          header: 'Monto Cuota',
          order: false,
          search: true
        },
        {
          field: 'nombre',
          header: 'Nombre',
          order: false,
          search: true
        },
        {
          field: 'nroboleta',
          header: 'N° Boleta',
          order: false,
          search: true
        },
        {
          field: 'total',
          header: 'Total',
          order: false,
          search: true
        },
        {
          field: 'estado',
          header: 'Estado',
          order: false,
          search: true
        },
        {
          field: 'logMensaje',
          header: 'Observación',
          width:20,
          order: false,
          search: true
        }
      ]
    };
  }

  deleteOffline(idfinanciamiento: number) {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {

        this.categoryService.deleteOffline({
          "idfinanciamiento": idfinanciamiento,
        }).subscribe((response) => {
          if (response.valid) {
            swal('La operación se realizó satisfactoriamente', '', 'success');
            this.grillaLoad.next();
            this.reloadCurrentRoute();
          }
        });
 
      }
    });
  }

  
reloadCurrentRoute() {
  const currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
  });
}

}
