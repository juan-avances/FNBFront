export class Notification {
  type: NotificationType;
  message: { data: [] };
  //public Mensaje: string;
  //public Url: string;
}
export enum NotificationType {
  Success,
  Error,
  Info,
  Warning
}
