export class FileUpload64 {
  constructor(
    public Base64?: string,
    public id?: string,
    public monto?: number,
    public fechaVencimiento?: string,
    public nombreArchivo?: string,
    public idHorario?: number,
    public idCanalVenta?: number,
    public tipoCargaArchivo?: number,
    public idAliadoComercial?: number,
    public randon?: number
  ) {}
}
