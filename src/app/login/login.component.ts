import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, SeguridadService } from '../services/backend.service.index';
import { GlobalService } from '../services/global.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  forma: FormGroup;
  formaContrasena: FormGroup;
  public showPassword: boolean = false;
  private showForgetPassword: boolean = false;
  private nivelSeguridad: number = 0;
  private nivelColor: string = '';
  private isValidPassword: boolean = false;
  private showNewPassword: boolean = false;
  private showRepeatPassword: boolean = false;
  local: boolean = false;
  lat: string = null;
  lng: string = null;
  constructor(
    public _authenticationService: AuthenticationService,
    public _seguridadService: SeguridadService,
    public router: Router,
    public globalService: GlobalService,
    private location: Location
  ) {

    this.getLocation();
  }

  ngOnInit() {
    /*const currentUrl = window.location.hostname;

    if (currentUrl.includes('localhost')) {
      this.local = true;
    }*/
    this.setForm();
    this.setFormContrasena();
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }


  public toggleRepeatPasswordVisibility(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }


  setForm() {
    const usuarioGuardado = this._authenticationService.getStoredUser();
    this.forma = new FormGroup({
      usuario: new FormControl(usuarioGuardado, Validators.required),
      password: new FormControl('', Validators.required)
      // captcha: new FormControl('*'),
      // valor: new FormControl(''),
    });
  }

  setFormContrasena() {

    this.formaContrasena = new FormGroup({
      usuario: new FormControl(this.forma.get('usuario').value, Validators.required),
      temporalPassword: new FormControl(this.forma.get('password').value, [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      repeatPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  get f() { return this.formaContrasena.controls; }

  guardarContrasena() {
    this.formaContrasena.patchValue({
      usuario: this.forma.get('usuario').value,
      temporalPassword: this.forma.get('password').value
    });

    if (this.formaContrasena.invalid) {
      return;
    }
    if (!this.forma.get('usuario').value) {
      swal("Error", "Ingrese el nombre usuario", 'error');
      return;
    }
    if (this.formaContrasena.get('newPassword').value != this.formaContrasena.get('repeatPassword').value) {
      swal("Error", "Contraseña ingresada no son iguales", 'error');
      return;
    }

    this._seguridadService.restaurarContrasena({
      ...this.formaContrasena.value,
      latitud: this.lat == null ? '' : this.lat.toString(),
      longitud: this.lng == null ? '' : this.lng.toString()
    }).subscribe((response) => {
      if (!response.valid) {
        swal("Error", response.message, 'error');
        return;
      }
      swal("Enviado", "Se restablecio la contraseña satisfactoriamente", 'success');
      this.showForgetPassword = false;
      this.forma.patchValue({
        password: ''
      });
    });
  }

  ingresar() {
    /*let result = this._authenticationService.requestValidateCaptcha$;

    if ((result == undefined || (!result)) && !this.local ) {
      swal("Aviso", "Por favor validar catpcha.", 'warning');
      return;
    }*/
    if (this.forma.invalid) {
      return;
    }

    const model = this.forma.value;
    model.Latitud = this.lat ? this.lat.toString() : "";
    model.Longitud = this.lng ? this.lng.toString() : "";
    this._authenticationService.login(model).subscribe((response) => {

      if (response.valid) {
        if (response.data.interno) {
          swal('Error', 'Usuario no permitido', 'error');
          return;
        }
        if (response.data.isTemporalPassword) {
          this.showForgetPassword = !this.showForgetPassword;
          this.nivelSeguridad = 0;

        }
        else {
          this.globalService.permisosUsuario();
          this.router.navigate(['/dashboard']);
        }
      } else {
        if (response.message == 'Contraseña incorrecta') {
          this.generateCode();
          document.getElementById('Sequre').hidden = false;
          this.forma.get('captcha').setValue('');
        } else {
          document.getElementById('Sequre').hidden = true;
          this.forma.get('captcha').setValue('*');
        }
      }
    });
  }

  olvidoContrasenia() {
    if (!this.forma.get('usuario').value) {
      swal("Error", "Ingrese el nombre usuario", 'error');
      return;
    }

    this._seguridadService.olvideContrasena(this.forma.get('usuario').value, 1, this.lat == null ? '' : this.lat.toString(), this.lng == null ? '' : this.lng.toString()).subscribe((response) => {
      if (response.valid) {
        swal("Enviado", "Se envio una contraseña temporal al correo electrónico configurado en su usuario en la plataforma FNB. Por favor revisar su bandeja de correo.", 'success');
        this.nivelSeguridad = 0;
      }
      else
        swal("Error", response.message, 'error');
    });
  }
  cancelarRestauracion() {
    this.formaContrasena.patchValue({
      newPassword: '',
      repeatPassword: ''
    });
    this.forma.patchValue({
      password: ''
    });
    this.showForgetPassword = !this.showForgetPassword;
  }

  ValidarPassword(clave: string) {
    this.nivelSeguridad = 0;

    if (clave.match(/^(?=.*[a-z])/) && clave.match(/^(?=.*[A-Z])/)) {
      this.nivelSeguridad = this.nivelSeguridad + 33;
      this.nivelColor = 'warn';

    }


    if (clave.match(/^(?=.*[0-9])/)) {
      this.nivelSeguridad = this.nivelSeguridad + 33;
      this.nivelColor = 'accent';
    }


    if (clave.match(/^(?=.*[!@#\$%\^&\*])/)) {
      this.nivelSeguridad = this.nivelSeguridad + 34;
      this.nivelColor = 'primary';

    }


    if (this.nivelSeguridad == 100)
      this.isValidPassword = true;
    else
      this.isValidPassword = false;
  }



  onInput(value) {
    if (value != null && value != this.forma.get('valor').value) {
      this.forma.get('captcha').setErrors([{ confirmedDoesNotMatch: true }]);
    } else {
      this.forma.get('captcha').setErrors(null);
    }
  }

  validerBlank(value) {
    if (value.isNullOrUndefined) return false;
    return true;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          localStorage.setItem('lat', this.lat)
          localStorage.setItem('lng', this.lng)

        }
      },
        (error: any) => console.log(error));
    } else {

    }
  }
  generateCode() {
    var strCaracteresPermitidos =
      'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z';
    var strArrayCaracteres = new Array(34);
    var lon = 4;
    strArrayCaracteres = strCaracteresPermitidos.split(',');
    var length = lon,
      i = 0,
      j,
      tmpstr = '';
    do {
      var randscript = -1;
      while (randscript < 1 || randscript > strArrayCaracteres.length || isNaN(randscript)) {
        randscript = parseInt((Math.random() * strArrayCaracteres.length).toString());
      }
      j = randscript;
      tmpstr = tmpstr + strArrayCaracteres[j];
      i = i + 1;
    } while (i < length);

    this.forma.get('valor').setValue(tmpstr);
    this.forma.get('captcha').setValue('');

    var ctxCanvas: any = document.getElementById('canvasOculto');
    ctxCanvas = ctxCanvas.getContext('2d');
    ctxCanvas.canvas.width = ctxCanvas.measureText(tmpstr).width;
    ctxCanvas.fillText(tmpstr, 0, 10);
  }
}