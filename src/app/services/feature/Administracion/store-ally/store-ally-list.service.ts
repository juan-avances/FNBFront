import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';

@Injectable({
  providedIn: 'root'
})
export class StoreAllyListService {

  constructor(public _router: Router) { }

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
        }
      ]
    };
  }

  goEditMode(id: number) {
    this._router.navigate(['tienda-aliada-form', id]);
  }
}
