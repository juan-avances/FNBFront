import { Option } from '../@core/models/option.model';
export class Usuario {
  id: number;
  nombres: string;
  userName: string;
  password: string;
  oldPassword: string;
  apellidos: string;
  tipoDocumento: string;
  nroDocumento: string;
  correo: string;
  rolId: number;
  aliadoComercialId: number;
  sedeId: number;
  roles: Option[];
  aliadosComerciales: Option[];
  sedes: Option[];
  tiposDocumento: Option[];
  codigoAsesor: string = null;
  rolLogueadoId: number;
}
