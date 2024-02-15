import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { ProductSubcategoryService } from 'src/app/services/backend/productOv/product-subcategory.service';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryFeatureService {
  constructor(public proiductBrandService: ProductSubcategoryService, public router: Router) {
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
         field: 'description',
         header: 'Descripcion',
         order: false,
         search: true
       }        
     ]
   };
 }

 goEditMode(id: number) {
   this.router.navigate(['subCategory-edicion', id]);
 }
}
