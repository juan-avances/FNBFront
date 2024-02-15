import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClienteService, UbigeoService } from 'src/app/services/backend.service.index';
import { ClienteEdicionService } from 'src/app/services/feature/Administracion/Cliente/cliente-edicion.service';
import { runInThisContext } from 'vm';
import swal from 'sweetalert2';
import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { RequireNoEmpty } from 'src/app/validators/requireNoEmpty';

@Component({
  selector: 'app-validacion-reniec',
  templateUrl: './validacion-reniec.component.html',
  styleUrls: ['./validacion-reniec.component.scss']
})
export class ValidacionReniecComponent implements OnInit {
  clientId: number;
  fechaActual: Date;
  fechaMin: Date ;
  forma: FormGroup;
  departamentos:any;
  clienteFallecido:boolean = false;
  flagDisableIntentos:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ValidacionReniecComponent>,
    public _clienteEdicionServicio: ClienteEdicionService,
    public _clienteServicio: ClienteService,
    public _ubigeoServicio: UbigeoService,
    @Inject(MAT_DIALOG_DATA) private input: any,
  ) { }

  ngOnInit() {
    this.clientId = this.input.clientId;
    this.newForm();
    this.fechaActual = new Date(Date.now());
    this.fechaMin = new Date(Date.now());
    this.fechaMin = new Date(this.fechaMin.setFullYear(this.fechaMin.getFullYear() - 150), this.fechaMin.getMonth(), this.fechaMin.getDay());

    this._ubigeoServicio.getUbigeoPeru(1, null, null).subscribe(value =>{
      this.departamentos = value.data;
    });
  }

  newForm() {
    this.forma = new FormGroup({
      dni: new FormControl(this.input.dni,[Validators.required, Validators.maxLength(8)]),
      validationDigit: new FormControl('',[Validators.required, Validators.maxLength(1)]),
      birthDate: new FormControl('',[Validators.required]),
      birthPlace: new FormControl('',[Validators.required]),
      motherName: new FormControl('',[Validators.required]),
      fatherName: new FormControl('',[Validators.required])
    });
  }
  // onChangeLeaveMother()
  // {
  //   var str = this.forma.get('motherName').value;
  //   if(str.trim().length == 0)
  //   {
  //     this.forma.controls['motherName'].setValue('');
  //     this.forma.controls['motherName'].setErrors({'incorrect': true});
  //   }
  // }

  // onChangeLeaveFather()
  // {
  //   var str = this.forma.get('fatherName').value;
  //   if(str.trim().length == 0)
  //   {
  //     this.forma.controls['fatherName'].setValue('');
  //     this.forma.controls['fatherName'].setErrors({'incorrect': true});
  //   }
  // }

  onChangeMother(event)
  {
    
    if(event.target.value.trim().length > 0)
    {
      this.forma.get('fatherName').clearValidators();
      let cadena = this.forma.get('motherName').value;
      this.forma.controls['motherName'].setValue(cadena.trimLeft());
    }
    else
    {
      this.forma.controls['motherName'].setValue('');
      //this.forma.controls['fatherName'].setErrors({'incorrect': true});
      this.forma.get('fatherName').setValidators([Validators.required, RequireNoEmpty]);
    }
    this.forma.get('fatherName').updateValueAndValidity();
    
  }

  onChangeFather(event)
  {
    
    if(event.target.value.trim().length > 0)
    {
      this.forma.get('motherName').clearValidators();
      let cadena = this.forma.get('fatherName').value;
      this.forma.controls['fatherName'].setValue(cadena.trimLeft());
    }
    else
    {
      this.forma.controls['fatherName'].setValue('');
      this.forma.get('motherName').setValidators([Validators.required, RequireNoEmpty]);
    }
    this.forma.get('fatherName').updateValueAndValidity();
    this.forma.get('motherName').updateValueAndValidity();
      }

  submit(){

    // if(!this.forma.controls['motherName'].value && this.forma.controls['fatherName'].value)
    // {
    //   this.forma.controls['motherName'].setErrors({'incorrect': true});
    //   this.forma.controls['email'].setErrors({'incorrect': true});
    // }

    var request = this.forma.getRawValue();
    this._clienteServicio.validacionReniec(request).subscribe(value =>{
      if(value.valid)
      {
        this.clienteFallecido = value.data.fallecido; 
        swal('Validación correcta!','','success');
        if(!this.clienteFallecido){
          this.dialogRef.close(value);
        }
      }else {
        if(value.data !== null){
          var validaciones = value.data.validaciones;
          if(validaciones.digitoValidador == 'Invalido'){
            this.forma.get('validationDigit').setValue('');
            this.forma.get('validationDigit').updateValueAndValidity()
          }
          if(validaciones.fechaNacimiento == 'Invalido'){
            this.forma.get('birthDate').setValue('');
            this.forma.get('birthDate').updateValueAndValidity()
          }
          if(validaciones.lugarNacimiento == 'Invalido'){
            this.forma.get('birthPlace').setValue('');
            this.forma.get('birthPlace').updateValueAndValidity()
          }
          if(validaciones.nombreMadre == 'Invalido'){
            this.forma.get('motherName').setValidators([Validators.required, RequireNoEmpty]);
            this.forma.get('motherName').setValue('');
            this.forma.get('motherName').updateValueAndValidity()
          }
          if(validaciones.nombrePadre == 'Invalido'){
            this.forma.get('fatherName').setValidators([Validators.required, RequireNoEmpty]);
            this.forma.get('fatherName').setValue('');
            this.forma.get('fatherName').updateValueAndValidity()
          }
        }
        
        if((value.data !== null && value.data.intentos <= 0) || (value.data == null && value.message == 'A superado el número de intentos')){
          this.flagDisableIntentos = true;
        }
      }
    });
    
  }

  cancel(): void {
    this.dialogRef.close({excedioIntentos : this.flagDisableIntentos});
  }


}
