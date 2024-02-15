import { ProductFeauture } from "./productFeature.model";
import { ProductFee } from "./productFee.model";
import { ProductImage } from "./productImage.model";
import { ProductServiceDto } from "./productService.model";

export class ProductManual{
    /**
     *
     */
    constructor(


        public nombreProducto?: string,
        public sku?: number,
        public precio?: number,
        public cantidad?: number,
        public idCategoria?: boolean,
        public code?: string,
        public aliadoComercial?: string,
        public idCanal?: string,
        public idAliadoComercial?: string,
        public FechaVentaIni?: string,
        public FechaVentaFin?: string,
       
       

 

     
    ) {


    }


}
export class ParametersDto {
    public nombre: string;
    public code: string; 
    public idSubCategoria:number;
    public idMarca:number; 
    public page: number;
    public size: number;
     public status: number; 
  }