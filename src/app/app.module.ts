import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { PagesModule } from './pages/pages.module';
import { LoadingComponent } from './components/loading/loading.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { MaterialLoginModule } from './material/material-login.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { APP_ROUTES } from './app.routes';
import { HttpErrorInterceptor } from './interceptors/httpErrorInterceptor';
import { AuthInterceptor } from './interceptors/authInterceptor';
import { MessageErrorInterceptor } from './interceptors/messageErrorInterceptor';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComponentsModule } from './components/components.module';
import { CambioClaveComponent } from './pages/administracion/mantenimientos/usuario/cambio-clave/cambio-clave.component';
import { AgregarProductoComponent } from './pages/operaciones/financiamientos/agregar-producto/agregar-producto.component';
import { SimuladorCuotasComponent } from './pages/operaciones/financiamientos/simulador-cuotas/simulador-cuotas.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AnularFinanciamientoComponent } from './pages/operaciones/financiamientos/anular-financiamiento/anular-financiamiento.component';
import { EnviromentServiceProvider } from './@core/services/enviroment.service.provider';
import { CalendarModule, SharedModule } from 'primeng/primeng';
import { RouterModule } from '@angular/router';
import { NotificationModule } from './components/notifications/notification.module';
import { SetupPermisos } from './services/setupPermisos';

import { VerConsumoComponent } from './pages/operaciones/consulta-credito/ver-consumo.component';
import { MatpaginatorLangService } from './services/feature/Administracion/producOv/product/matpaginator-lang.service';
import { MatChipsModule, MatPaginatorIntl, MatProgressBarModule } from '@angular/material';
import { AgregarProductoManualComponent } from './pages/operaciones/financiamientos/agregar-producto-manual/agregar-producto-manual.component';
import { CargaMasivaComponent } from './pages/operaciones/financiamientos/carga-masiva/carga-masiva.component';
import { DEFAULT_TIMEOUT, TimeoutInterceptor } from './interceptors/timeoutInterceptor';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RecaptchaComponent } from './login/recaptcha/recaptcha.component';
export function SetupApp(setup: SetupPermisos) {
  return () => setup.initliaze();
}

@NgModule({
  declarations: [AppComponent, LoginComponent,RecaptchaComponent],
  imports: [
    NgbModule,
    NoopAnimationsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    PagesModule,
    APP_ROUTES,
    AutoCompleteModule,
    MaterialLoginModule,
    ComponentsModule,
    NgHttpLoaderModule,
    BrowserAnimationsModule,
    CalendarModule,
    SharedModule,
    NotificationModule,
    MatProgressBarModule,
    MatChipsModule,
    NgxCaptchaModule,
    RouterModule.forRoot([])
  ],
  providers: [
    SetupPermisos,
    EnviromentServiceProvider,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MessageErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: DEFAULT_TIMEOUT, useValue: 30000 },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: SetupApp,
      deps: [SetupPermisos],
      multi: true
    },
    { provide: MatPaginatorIntl, useClass: MatpaginatorLangService }
  ],
  bootstrap: [AppComponent],
  // entryComponents: [
  //   LoadingComponent,
  //   CambioClaveComponent,
  //   AgregarProductoManualComponent,
  //   AgregarProductoComponent,
  //   AnularFinanciamientoComponent,
  //   SimuladorCuotasComponent,
  //   VerConsumoComponent,
  //   CargaMasivaComponent
  // ]
})
export class AppModule {}
