import { Option } from '../@core/models/option.model';
export class Estadistica {
  constructor(
    public id: number = 0,
    public fecha: Date,
    public hora: Date,
    public dni: string,
    public usuario: string,
    public canal: string,
    public aliado: string,
    public sede: string,
    public estado: number = 1
  ) {}
}

export interface EstadisticasListInit {
  canalesVenta: Option[];
  sede: Option[];
  aliadosComerciales: Option[];
  rangoHoras: Option[];
  totalConsulta: number;
  porcentajeConsulta: number;
  totalConsultaVenta: number;
  porcentajeConsultaVentas: number;
  totalConsultaSinVentas: number;
  porcentajeConsultaSinVentas: number;
}
export interface EstadisticasTotales {
  totalConsultas: number;
  consultasConVentas: number;
  consultasSinVentas: number;
}
