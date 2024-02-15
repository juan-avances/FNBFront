import { Option } from '../@core/models/option.model';
export class Base {
  id: number;
  bases: string;
  idFechaVencimiento: string;
  fechaCarga: string;
  aliadoComercialId: number;
  sku: string;
  eliminado: boolean;
}
