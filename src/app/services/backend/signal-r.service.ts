import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { NotificationService } from '../feature/Administracion/Notifications/toastr-notification.service';
import { EnviromentService } from 'src/app/@core/services/enviroment.service';
import { AuthenticationService } from './authentication.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: string;
  public bradcastedData: string;
  public _notificationService: NotificationService;

  constructor(public _authenticationService: AuthenticationService, public _enviromentService: EnviromentService) {}

  private hubConnection: signalR.HubConnection;

  public startConnection = (resGrupo: any) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this._enviromentService.urlNotificacion, {
        transport: signalR.HttpTransportType.ServerSentEvents
      })
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 60000;

    this.hubConnection
      .start()
      .then(() => {
        this.addToGroup(resGrupo);
      })
      .catch(err =>
        swal({
          title: 'Error while starting connection: ' + err,
          type: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000
        })
      );
  };

  public showNotifationGroupListener = () => {
    this.hubConnection.on('showNotifationGroup', data => {
      this.data = data;
      this.showSuccessNotification(data);
    });
  };

  public addToGroup = (res: any) => {
    if (res.data) {
      this.hubConnection.invoke('addToGroup', res.data).catch(err => console.error(err));
    }
  };

  public deleteNotificationListener = () => {
    this.hubConnection.on('deleteNotification', () => {
      this._notificationService.clear();
    });
  };

  public closeConnection = () => {
    this.hubConnection.stop();
    this._notificationService.clear();
  };
  public setNotificationService(service: NotificationService) {
    this._notificationService = service;
  }
  public showSuccessNotification(message: { data: [] }) {
    this._notificationService.info(message, true);
  }
}
