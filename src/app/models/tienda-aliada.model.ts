import { TiendaAliadaCategoria } from "./tienda-aliada-categoria.model";

export class TiendaAliada {
    public id: number;
    public nombre: string;
    public nombreLogo: string;
    public base64Logo: string;
    public estado: number;
    public estadoEnPortal: boolean;
    public label: string;
    public value:string;
    public tiendaAliadaCategoriaList: TiendaAliadaCategoria[] = [];
}
