import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { LandingPageService } from 'src/app/services/backend/landingPage.service';
import swal from 'sweetalert2';

export interface Estados {
  id: number;
  nombre: string;

  activo: boolean
}

@Component({
  selector: 'app-landing-page-call-center',
  templateUrl: './landing-page-call-center.html',
  styles: []
})
export class LandingPageCallCenterComponent implements OnInit {
  selectedValue: number;

  states: Estados[] = [
  ];
  configuracion:any;
  idConfiguracion:number;
  formGroup: FormGroup;
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  selectedStates = this.states;
  Base64Logo:  string | ArrayBuffer
  auxImage: boolean = false
  fileToUpload: File = null;
  SourceImageName:string
  auxCategoria: boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private landingPageService: LandingPageService
  ) {

  }



  ngOnInit() {

    this.getCategoria()
    this.getConfiguracion()
    this.formGroup = this.formBuilder.group({

      id: [0],
      nombre: ['', [Validators.required]],
      activo: [true]
    })
    this.formGroup.disable()


    this.formGroup1 = this.formBuilder.group({

      correos: [''],

    })

    this.formGroup2 = this.formBuilder.group({

      base64Logo: [''],

    })
    // this.dataAliado = this._aliadoComercialListadoService.init(this.dataTable) as PrimeTable;
  }

  getCategoria() {
    this.landingPageService.getCategoriaCall().subscribe((e) => {
      this.states = e.data
    });
  }
  getConfiguracion(){
   
    this.landingPageService.getConfigCall().subscribe((e) => {
      this.idConfiguracion = e.data.id
      this.formGroup1.patchValue({
        correos: e.data.correos
      })
      this.formGroup2.patchValue({
        base64Logo:e.data.base64Logo
      })
    });
  }

  editarCategoria() {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        let data = {
          id: this.formGroup.value.id,
          nombre: this.formGroup.value.nombre,

          activo: this.formGroup.value.activo
        }
        const resultadoServicio = this.landingPageService.updateCategoriaCall(data);

        resultadoServicio.subscribe(response => {
          if (response.valid) {
            this.getCategoria()
            this.formGroup.patchValue({
              "nombre": "",

              "activo": true,
            })

            this.formGroup.disable()

        
            this.formGroup.reset()
            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });
  }

  guardarCategoria() {
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        let data = {

          nombre: this.formGroup.value.nombre,

          activo: this.formGroup.value.activo
        }
        const resultadoServicio = this.landingPageService.registraCategoriaCall(data);

        resultadoServicio.subscribe(response => {
          if (response.valid) {

            this.getCategoria()
            this.formGroup.patchValue({
              "id": 0,
              "nombre": "",

              "activo": true,
            })

            this.formGroup.disable()

            swal('La operación se realizó satisfactoriamente', '', 'success');
          }
        });
      }
    });

  }

  sortByCategory(e: Estados) {
    this.formGroup.patchValue({
      "nombre": e.nombre,
      "activo": e.activo,
      "id": e.id
    })
    this.formGroup.enable()
    this.auxCategoria = true







  }

  Limpiar() {
    this.formGroup.patchValue({
      "id": 0,
 
      "nombre": "",

      "activo": true,
    })
    this.formGroup.enable()
    this.auxCategoria = false
  }

  Cancelar() {
    this.formGroup.patchValue({
      "nombre": "",

      "activo": true,

    })
    this.formGroup.disable()
    this.auxCategoria = false
  }
  /**** */

  handleFileInput(files: any) {
  
    
 

    var mimeType =  files.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL( files.target.files[0]);
    reader.onload = _event => {
      this.SourceImageName=files.target.files[0].name
      // this.formGroup.controls.sourceImageName.patchValue(files[0].name);
      this.Base64Logo =reader.result
  /*
  
    public int? Id { get; set; }
        public String SourceImageName { get; set; }
        public String UniqueImageName { get; set; } = null;
        public string Base64Logo { get; set; }
        public String Correos { get; set; } = null;

        public DateTime? FechaModifica { get; set; }
  
  */
    };



  }


  actualizarImagen(){
    
  swal({
    text: '¿Estás seguro de realizar esta operación?',
    type: 'question',
    confirmButtonClass: 'btn-azul',
    confirmButtonText: 'Aceptar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.value) {

   
  let data={
    ImagenBackGround:this.Base64Logo,
    SourceImageName :this.SourceImageName,
    Id:this.idConfiguracion,
    Base64Logo: this.Base64Logo
  }



      const resultadoServicio = this.landingPageService.updateConfigCall(data);

      resultadoServicio.subscribe(response => {
        if (response.valid) {
      

          this.formGroup2.patchValue({
            base64Logo:this.Base64Logo
          })

      
          
          swal('La operación se realizó satisfactoriamente', '', 'success');
        }
      });
    }
  });
  }
  actualizarCorreo() {
    let data = {
      Correos: this.formGroup1.value.correos,
      Id:this.idConfiguracion
    }
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        const resultadoServicio = this.landingPageService.updateConfigCall(data).subscribe((e)=>{

          if(e.valid){
            this.formGroup1.patchValue({
              correos: this.formGroup1.value.correos
            })
  
      
   
            this.formGroup.reset()
            swal('La operación se realizó satisfactoriamente', '', 'success');

          }
        });


      }})

  }


}
