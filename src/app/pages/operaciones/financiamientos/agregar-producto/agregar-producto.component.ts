import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Option } from '../../../../@core/models/option.model';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { Producto } from 'src/app/models/financiamiento.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styles: []
})

export class AgregarProductoComponent implements OnInit {
  forma: FormGroup;
  filteredOptions: Observable<Producto[]>;
  filteredOptions1: Observable<AliadoComercial[]>;
  aliadoId: number;
  stateActive:boolean=false;
  proveedores: Option[];
  

  constructor(
    public _activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<AgregarProductoComponent>,
    public _financiamientoEdicionService: FinanciamientoEdicionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  products: Producto;

  stock: number;
 
  btnCerrar(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.setForm();
    this.filteredOptions1 = this.forma.get('aliadoId').valueChanges.pipe(
      debounceTime(300),
      switchMap(value =>
        this._financiamientoEdicionService.obtenerListaAliadoProveedor(
          this.data.aliadoId,
          this.data.canalId,
          value
        )
      )
    );
    this.filteredOptions = this.forma.get('producto').valueChanges.pipe(
      debounceTime(300),
      switchMap(value =>
        this._financiamientoEdicionService.obtenerListaProductos(
          this.data.aliadoId,
          this.aliadoId,
          this.data.canalId,
          value
        )
      )
    );


    this._financiamientoEdicionService
      .obtenerListaProveedores(this.data.aliadoId, this.data.canalId)
      .subscribe(response => {
        this.proveedores = response;
      });

      
  }

  data1(event){
    this.aliadoId = parseInt(event.option.value.value);
    if(this.aliadoId > 0){
      this.stateActive = true;
    }else{
      this.stateActive = false;
    }
  }

  displayFn(producto: Producto) {

    
    if (producto) {
      this.stock=producto.stock;
      
      return producto.label; 
    }
  }

  

  displayFn1(proveedor: AliadoComercial) {
    if (proveedor) {
      return proveedor.label;
    }
  }

  setForm() {
    this.forma = new FormGroup({
      aliadoId: new FormControl('', Validators.required),
      producto: new FormControl('', Validators.required),
      //stock: new FormControl(this.displaySt),
      cantidad: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  enviar() {

    if (this.forma.value.cantidad == 0 ) {
      Swal(" ","La cantidad no puede ser 0","warning");
      Swal.hideLoading();
      return;
    }

    if (this.forma.value.producto.stock != 0 && this.forma.value.cantidad > this.forma.value.producto.stock ) {
        Swal(" ","Stock disponible: <strong>"+this.forma.value.producto.stock+"</strong> Unidad(es)","warning");
        Swal.hideLoading();
        return;
    }

    if (this.forma.value.cantidad <= this.forma.value.producto.stock || this.forma.value.producto.stock === 0 ) {

      if (this.forma.invalid) {
        return;
      }
  
      const productoEnviar = this.forma.get('producto').value as Producto;
      productoEnviar.cantidad = this.forma.value.cantidad;
  
      this.dialogRef.close(productoEnviar);
    }
  }

}
