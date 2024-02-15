import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SedeService } from 'src/app/services/backend.service.index';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';

@Injectable({
  providedIn: 'root'
})
export class BranchOfficeFeatureService {
  constructor(public branchOfficeService: SedeService, public router: Router) {
    // super(
    //   new FeatureListConfig('branchoffice', '/branch-office-form'),
    //   branchOfficeService,
    //   router
    // );
  }

  getConfigTable(): PrimeTable {
    return {
      customOperations: [
        {
          title: 'Editar',
          icon: 'edit',
          type: 'Material',
          visibilidity: p => true,
          click: p => this.goEditMode(p.id)
        }
      ],
      options: {
        showAdd: false,
        showSearch: false,
        showDelete: false,
        showChangeState: true,
        showIndex: true,
        showEdit: true,
        accionesWidth: 7
      },
      columnas: [
        {
          field: 'id',
          header: 'Nº',
          search: false,
          visible: false
        },
        {
          field: 'name',
          header: 'Nombre',
          order: false,
          search: true
        },
        {
          field: 'address',
          header: 'Dirección',
          order: false,
          search: true
        },
        {
          field: 'commercialAllyId',
          header: 'Id Aliado Comercial',
          order: false,
          search: true,
          visible: false
        },
        {
          field: 'commercialAllyBusinessName',
          header: 'Comercial',
          order: false,
          search: true,
          visible: true
        }
      ]
    };
  }

  goEditMode(id: number) {
    this.router.navigate(['branch-office-form', id]);
  }
}
