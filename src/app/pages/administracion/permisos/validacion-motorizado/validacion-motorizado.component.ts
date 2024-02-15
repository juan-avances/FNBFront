import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OptionToggle } from 'src/app/models/optionToggle.model';
import { CategoryService } from 'src/app/services/backend.service.index';
import { GlobalService } from 'src/app/services/global.service';
import { Option } from '../../../../@core/models/option.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-validacion-motorizado',
  templateUrl: './validacion-motorizado.component.html',
  styleUrls: ['./validacion-motorizado.component.scss']
})
export class ValidacionMotorizadoComponent implements OnInit {
  optionModalidad: Option[];
  optionCanal: Option[];
  

  forma: FormGroup;

  idCanal: number = null

  formularios: any;
  
  constructor(public _categoryService: CategoryService,
    public _route: Router,
    public _global: GlobalService) { }

  ngOnInit() {
    this.set_Form();
    this.loadData();
  }

  loadData(): void {
    this._categoryService.getCategoriaCanalIni().subscribe(res => {
      this.optionCanal = res.data.canalVentas;
      this.optionModalidad = res.data.modalidadesEntregas;
    });
  }
  set_Form() {
    this.forma = new FormGroup({
      idCanal: new FormControl(null, Validators.required)
    });
  }

  togglePermiso(rowData: any, modalidadActual: any) {
    //debugger;
    let d  = rowData.find(x => x.idModalidad === modalidadActual.idModalidad);
    rowData.find(x => x.idModalidad === modalidadActual.idModalidad).valor = !modalidadActual.valor;
  }
  
  onChange(){
    const objectActual = this.forma.value;
    
    this._categoryService.getObtenerModalidad(objectActual.idCanal).subscribe(res => {
      
      this.optionModalidad = res.data;
    });

    this._categoryService.getPermisosCategoria(objectActual.idCanal).subscribe(res => {
      
      this.formularios = res.data;
      
    });
  }

  onSubmit() {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        this.forma.value.listaAcciones = this.formularios;
        const resultadoServicio =  this._categoryService.saveCanales(this.forma.value);
        resultadoServicio.subscribe(response => {
          if (response.valid) {
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
    
  }

}
