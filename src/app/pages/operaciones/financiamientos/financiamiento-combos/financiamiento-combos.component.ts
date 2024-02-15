import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { AgregarProductoComponent } from '../agregar-producto/agregar-producto.component';
import { ComboProducto } from '../../../../models/financiamiento.model';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/services/global.service';
import swal from 'sweetalert2';
import { AgregarProductoManualComponent } from '../agregar-producto-manual/agregar-producto-manual.component';

@Component({
  selector: 'app-financiamiento-combos',
  templateUrl: './financiamiento-combos.component.html',
  styleUrls: ['./financiamiento-combos.component.scss']
})

export class FinanciamientoCombosComponent {
  @Input() forma: FormGroup;
  @Input() aliadoId: number;
  @Input() canalId: number;
  combos: ComboProducto[];
  @Output() agregarCP = new EventEmitter<any>();

  visualizaProducto: boolean;
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    appendArrows: '.slider__arrows'
  };

  constructor(public _financiamientoEdicionService: FinanciamientoEdicionService, public dialog: MatDialog,public _global: GlobalService,) {}

  ngOnInit() {
    if (!this.combos) {
      this.combos = [];
    }
    if(this._global.isAdministradorWeb() || this._global.isAdministradorAliado() || this._global.isGOperacionWeb()){
      this.visualizaProducto=true;
    }else{
      this.visualizaProducto=false
    }
  }

  filterCombos(term: any) {
    
    this.cargarCombos(this.aliadoId, this.canalId, term);
  }

  cargarCombos(idAliado, idCanal, term) {
  
    this._financiamientoEdicionService.obtenerListaComboProducto(idAliado, idCanal, term).subscribe(response => {
      this.combos = this.corregirCombos(response);
    });
  }
  corregirCombos(response: ComboProducto[]): ComboProducto[] {
    let lista: ComboProducto[] = [];
    response.forEach(aliado => {
      aliado.children.forEach(combo => {
        let comboAdd: ComboProducto = combo;
        comboAdd.data.aliado = aliado;
        comboAdd.data.aliado.children = [];
        lista.push(comboAdd);
      });
    });
    return lista;
  }

  agregarCombo(combo: any) {
    combo.data.cantidad = 1;
    combo.data.tipo = 'C';
    let aliado = combo.data.aliado;
    aliado.children = [];
    aliado.children.push(combo);
    this.agregarCP.emit(aliado);
  }

  agregarProducto() {
    if (this.canalId != null) {
      const dialogRef = this.dialog.open(AgregarProductoComponent, {
        width: '950px',
        data: {
          aliadoId: this.aliadoId,
          canalId: this.canalId
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let addAliado: ComboProducto = {};
          let addProducto: ComboProducto = {};
          addAliado.data = {};
          addAliado.data.id = result.aliadoId;
          addAliado.data.nombre = result.aliado;
          addAliado.data.precio = result.aliadoPrecio;
          addAliado.data.sku = result.aliadoSku;
          addAliado.data.cantidad = result.cantidad;
          addAliado.data.sedes = result.sedes;
          addAliado.data.despacho = {};
          addAliado.children = [];
          addProducto.data = {};
          addProducto.children = null;
          addProducto.data.id = result.idProducto;
          addProducto.data.nombre = result.descripcion;
          addProducto.data.precio = result.precio;
          addProducto.data.sku = result.sku;
          addProducto.data.cantidad = result.cantidad;
          addProducto.data.tipo = 'P';
          addAliado.children.push(addProducto);
          this.agregarCP.emit(addAliado);
        }
      });
    } else {
      swal({
        text: 'Primero seleccione su canal de venta.',
        type: 'warning',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: false
      });
    }
  }


  agregarProductoManual() {
    if (this.canalId != null) {
      const dialogRef = this.dialog.open(AgregarProductoManualComponent, {
        width: '600px',
        data: {
          aliadoId: this.aliadoId,
          canalId: this.canalId
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let addAliado: ComboProducto = {};
          let addProducto: ComboProducto = {};
          addAliado.data = {};
          addAliado.data.id = result.aliadoId;
          addAliado.data.nombre = result.aliado;
          addAliado.data.precio = result.aliadoPrecio;
          addAliado.data.sku = result.aliadoSku;
          addAliado.data.cantidad = result.cantidad;
          addAliado.data.sedes = result.sedes;
          addAliado.data.despacho = {};
          addAliado.children = [];
          addProducto.data = {};
          addProducto.children = null;
          addProducto.data.id = result.idProducto;
          addProducto.data.nombre = result.descripcion;
          addProducto.data.precio = result.precio;
          addProducto.data.sku = result.sku;
          addProducto.data.cantidad = result.cantidad;
          addProducto.data.tipo = 'P';
          addAliado.children.push(addProducto);
          this.agregarCP.emit(addAliado);
        }
      });
    } else {
      swal({
        text: 'Primero seleccione su canal de venta.',
        type: 'warning',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: false
      });
    

    
    } 
  }

  slickInit(e) {
  }

  breakpoint(e) {
  }

  afterChange(e) {
  }

  beforeChange(e) {
  }
}
