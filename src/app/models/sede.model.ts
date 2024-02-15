import { Option } from '../@core/models/option.model';
// export class Sede {
//   constructor(
//     public CodSede?: string,
//     public nombres?: string,
//     public direccion?: string,
//   ) {}
// }
export class BranchOffice {
  public id: number = 0;
  public code: string;
  public name: string;
  public address: string;
  public commercialAllyId: number;
  public commercialAllyBusinessName: string;
  public latitud:number;
  public longitud:number;
  public ubigeoId:number;
  public departamentoId:number;
  public provinciaId:number;
  public distritoId:number;

}
