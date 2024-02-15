import { Injectable } from '@angular/core';
import { PrimeTable } from '../../../../@core/models/prime-table.model';
import { Router } from '@angular/router';
import { FeatureListService } from '../../../../@core/services/feature-list.service';
import { FeatureListConfig } from '../../../../@core/models/feature-list.model';
import { LazyLoadEvent } from 'primeng/primeng';
import { Category } from '../../../../models/category.model';

import { CategoryService } from '../../../backend/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryFeatureService {
  constructor(public categoryService: CategoryService, public router: Router) {
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
          field: 'code',
          header: 'Código',
          order: false,
          search: true
        }
      ]
    };
  }

  goEditMode(id: number) {
    this.router.navigate(['category-form', id]);
  }
}
