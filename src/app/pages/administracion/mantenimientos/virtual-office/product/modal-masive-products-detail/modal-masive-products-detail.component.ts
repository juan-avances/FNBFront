import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorMassiveProduct } from 'src/app/models/virtualOficce/errorMassiveProduct.model';

@Component({
  selector: 'app-modal-masive-products-detail',
  templateUrl: './modal-masive-products-detail.component.html'
})
export class ModalMasiveProductsDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)private input: any) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  displayedColumns: string[] = ['number', 'errorDescrip', 'errorBD','errorCode', 'description'];

  errorList :ErrorMassiveProduct[] =[];
  ErrorDataSource =new MatTableDataSource<ErrorMassiveProduct>()
  ngOnInit() {    
   this.errorList = this.input.errors;
   this.ErrorDataSource = new MatTableDataSource(this.errorList);
   this.ErrorDataSource.paginator = this.paginator; 
   this.ErrorDataSource.sort = this.sort;
  }

}
