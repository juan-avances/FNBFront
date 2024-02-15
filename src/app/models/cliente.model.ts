import { Option } from '../@core/models/option.model';
import { ClienteDireccion } from './clienteDireccion.model';
export class Cliente {
  constructor(
    public id?: number,
    public nombres?: string,
    public apellidos?: string,
    public correo?: string,
    public lineaCredito?: number,
    public fechaCarga?: string,
    public tipoDocumento?: string,
    public nroDocumento?: string,
    public tipoTelefono?: string,
    public tipoTelefonoOp?: string,
    public nroTelefono?: string,
    public nroTelefonoOp?: string,
    public idUsuario?: number,
    public estado?: number,
    public cuentasContrato?: ClienteDireccion[],
    public tiposDocumento?: Option[],
    public tiposTelefono?: Option[]
  ) {}
}
