import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DataSheet } from 'src/app/models/virtualOficce/dataSheet.model';
import { ErrorMassiveProduct } from 'src/app/models/virtualOficce/errorMassiveProduct.model';
import { ProductService } from 'src/app/services/backend/productOv/product.service';

@Component({
  selector: 'app-product-upload-masive',
  templateUrl: './product-upload-masive.component.html'
})
export class ProductUploadMasiveComponent implements OnInit {
  constructor(private _productService:ProductService, 
    private ref: MatDialogRef<ProductUploadMasiveComponent>) { 
  }


  ngOnInit() {
  }
  errorList:ErrorMassiveProduct[]=[];
  dataSheet = new DataSheet;
  
  setFile($event) {


    const file = $event.target.files[0];
    this.dataSheet.fileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      let result = reader.result.toString().split(',');
      this.dataSheet.fileBase64 = result[1];
    };


  };

  UploadFile(){
    
    this._productService.uploadMasiiveFile(this.dataSheet).toPromise().then(
      (response)=> {         
        if(response.data.length==0){          
          this.ref.close(response);
          }else{
          this.errorList = response.data;
          this.ref.close({
            data:{valid:false, errors:this.errorList}
          })
        }
 
      }
    )
  }

}
