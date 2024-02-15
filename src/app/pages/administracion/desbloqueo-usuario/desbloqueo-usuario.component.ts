import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { State } from 'src/app/@core/models/option.model';
import { UsuarioService } from 'src/app/services/backend/usuario.service';
import { UsuarioEdicionService } from 'src/app/services/feature/Administracion/Usuario/usuario-edicion.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-desbloqueo-usuario',
  templateUrl: './desbloqueo-usuario.component.html',
  styleUrls: ['./desbloqueo-usuario.component.scss']
})
export class DesbloqueoUsuarioComponent implements OnInit {


  constructor(
    public _activatedRoute: ActivatedRoute,
    public _usuarioEdicionServicio: UsuarioEdicionService,
    public _usuarioServicio: UsuarioService,
    ) { }

  userName: string;
  userModel: any;
  isBloqueado: boolean = false;
  ngOnInit() {
  }
  loadData() {
    this._usuarioEdicionServicio.getByUserName(this.userName).subscribe(response => {
      if(!response)
      {
        this.userName = '';
        this.userModel = null;
        this.isBloqueado = false;
        return;
      }

      this.userModel = response;
      this.isBloqueado = this.userModel.estado == 1 ? false : true;
      if(!this.isBloqueado)
      {
        swal('Usuario no se encuentra bloqueado', '', 'success');
        this.userName = '';
        this.userModel = null;
        this.isBloqueado = false;
      }
    });
  }
  updateState() {
    this._usuarioServicio.updateState(this.userModel.id, null).subscribe(response => {
      if (response.valid) {
        this.userName = '';
        this.userModel = null;
        this.isBloqueado = false;
        swal('La operación se realizó satisfactoriamente', '', 'success');
      }
    });
  }
  Buscar(){

    if(this.userName)
      this.loadData();
    else
      swal('Ingrese un nombre de usuario', '', 'error');
  }

  Liberar(){
this.updateState();
  }
}
