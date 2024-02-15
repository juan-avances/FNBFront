import { Component, OnInit } from '@angular/core';
import { Notification, NotificationType } from '../../models/toastr-notification.model';
import { NotificationService } from '../../services/feature/Administracion/Notifications/toastr-notification.service';

@Component({
  selector: 'app-toastr-notification',
  templateUrl: './toastr-notification.component.html',
  styleUrls: ['./toastr-notification.component.css']
})
export class NotificationComponent {
  notifications: Notification[] = [];
  mensaje: string;
  url: string;

  constructor(public _notificationService: NotificationService) {
    this.mensaje = '';
    this.url = '';
  }

  ngOnInit() {
    this._notificationService.getAlert().subscribe((alert: Notification) => {
      this.notifications = [];

      if (!alert) {
        this.notifications = [];
        return;
      }

      this.notifications = alert.message.data;

      /*setTimeout(() => {
                this.notifications = this.notifications.filter(x => x !== alert);  
            }, 10000); */
    });
  }

  removeNotification(notification: Notification) {
    this.notifications = this.notifications.filter(x => x !== notification);
  }

  /**Set css class for Alert -- Called from alert component**/
  cssClass(notification: Notification) {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case NotificationType.Success:
        return 'toast-success';
      case NotificationType.Error:
        return 'toast-error';
      case NotificationType.Info:
        return 'toast-info';
      case NotificationType.Warning:
        return 'toast-warning';
    }
  }
}
