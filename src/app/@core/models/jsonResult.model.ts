export class JsonResult<TData> {
  public valid: boolean;
  public message: string;
  public detail: string;
  public data: TData;
  public warning: boolean;
}
