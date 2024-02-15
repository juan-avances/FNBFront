import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { BranchAllyService } from 'src/app/services/backend/branch-ally.service';

@Injectable({
  providedIn: 'root'
})
export class BranchAllyListService {
  constructor(public branchOfficeService: BranchAllyService, public router: Router) {
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
          field: 'nombre',
          header: 'Nombre',
          order: false,
          search: true
        },
        {
          field: 'tiendaAliadaNombre',
          header: 'Tienda Aliada',
          order: false,
          search: true,
          visible: true
        },
        {
          field: 'distrito',
          header: 'Distrito',
          order: false,
          search: true,
          visible: true
        }
      ]
    };
  }

  goEditMode(id: number) {
    this.router.navigate(['sede-aliada-form', id]);
  }
}
