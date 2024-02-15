export class AliadoComercial {
  public id: number;
  /**código de aliado */
  public responsableVenta: string;
  public proveedor: string;
  public documentNumber: string;
  public documentType: string;
  /**Nombre comercial */
  public businessName: string;
  /**Razón social */
  public legalName: string;
  /**Es Proveedor? */
  public isProvider: string;
  /**Es Responsable de ventas? */
  public isSalesManager: string;
  /**Asesor */
  public assessor: string;
  public sourceImageName: string;
  public uniqueImageName: string;
  /**Logo en base64 */
  public base64Logo: string;
  public label: string;
  public value:string;
}
