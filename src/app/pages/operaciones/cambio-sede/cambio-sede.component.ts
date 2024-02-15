import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SedeService } from 'src/app/services/backend.service.index';
import { UsuarioService } from 'src/app/services/backend/usuario.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-sede',
  templateUrl: './cambio-sede.component.html',
  styleUrls: ['./cambio-sede.component.scss']
})
export class CambioSedeComponent implements OnInit {

  usuario: any;
  sedes: any;
  public idSedeOld: number;
  setIdSedeOld: string;
  idSedeNew: number;
  constructor(
    public dialogRef: MatDialogRef<CambioSedeComponent>,
    public _usuarioService: UsuarioService,
    public _sedeService: SedeService,
    @Inject(MAT_DIALOG_DATA) private input: any,
  ) { 

    this.load();
  }
  ngAfterViewInit(){
   
   
  }
  ngOnInit() {

  }

  load()
  {
    this._usuarioService.get(this.input.idUsuario).subscribe(response => {      
      if(!response.valid)
      {
        this.dialogRef.close(false);
        return;
      }
      this.usuario = response.data;
      this.sedes = response.data.sedes;
      this.idSedeOld = response.data.sedeId;
      this.setIdSedeOld = this.idSedeOld.toString();
      //this.idSedeOld = response.data.sedeId;
      
    });
  }

  save(){

    if(this.idSedeOld == this.idSedeNew){
      swal('Elija otra sede que no sea la actual', '', 'error');
      return;
    }

    swal({
      text: '¿Estás seguro de realizar esta operación? ',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this._usuarioService.changeBranch(this.usuario.id, this.idSedeNew).subscribe(response => {
          
          swal('Se actualizo correctamente', '', 'success');
          this.dialogRef.close(true);
        });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
