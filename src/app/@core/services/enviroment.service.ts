import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnviromentService {
  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url
  //  public urlBaseServicios = 'http://localhost:50374/test/';
  //  public urlNotificSacion = 'http://localhost:50374/test/';

  public siteKey='';
  public googleKey="";
  public urlBaseServicios = 'http://localhost:62384/api/';
  public urlNotificacion = 'http://localhost:62384/notificacion';
  // Whether or not to enable debug mode
  public enableDebug = true;
  public timeOutNotifications = 5000;

  constructor() {}
}
