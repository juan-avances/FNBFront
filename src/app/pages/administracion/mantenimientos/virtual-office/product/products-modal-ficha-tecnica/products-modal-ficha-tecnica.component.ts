import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataSheet } from 'src/app/models/virtualOficce/dataSheet.model';
import { ProductService } from 'src/app/services/backend/productOv/product.service';

@Component({
  selector: 'app-products-modal-ficha-tecnica',
  templateUrl: './products-modal-ficha-tecnica.component.html'

})
export class ProductsModalFichaTecnicaComponent implements OnInit {

  dataSheetURLValue: boolean;
  dataSheetIDDownload: number;
  constructor(private _productService: ProductService,
    private ref: MatDialogRef<ProductsModalFichaTecnicaComponent>,
    @Inject(MAT_DIALOG_DATA) private input: any) { }

  ngOnInit() {

    this.dataSheetURLValue = (this.input.Product.datasheetUrl!=null)?true:false;
    this.requestFileDownload.productID = this.input.Product.productId;
    this.dataSheet.productID = this.input.Product.productId;
  }

  dataSheet = new DataSheet;
  requestFileDownload = new DataSheet;

  downloadFile() {

    if (this.dataSheetURLValue)
  
      this._productService.DataSheetDownLoad(this.requestFileDownload).subscribe(
        (response) => {
          
           
          //window.open(window.URL.createObjectURL(data))
  
              // otherwise only Chrome works like it should
              var newBlob = new Blob([response], { type: "application/pdf" });
              // IE doesn't allow using a blob object directly as link href
              // instead it is necessary to use msSaveOrOpenBlob
              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
              }
              // For other browsers: 
              // Create a link pointing to the ObjectURL containing the blob.
              const data = window.URL.createObjectURL(newBlob);
              var link = document.createElement('a');
              link.href = data;
              link.download ="FichaTecnica.pdf";
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
              setTimeout(function () {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
              }, 100);

              
          this.ref.close({ data: { valid: false } });
          window.open(window.URL.createObjectURL(response))
        });
  }


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

  uploadDataSheetFile() {

    
    this._productService.uploadFile(this.dataSheet).subscribe(
      (response) => {
        
        if (response.valid)
        this.ref.close({ data: { valid: true } });
      }
    )
  }

}
