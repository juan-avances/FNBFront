import { ProductFeauture } from "./productFeature.model";
import { ProductFee } from "./productFee.model";
import { ProductImage } from "./productImage.model";
import { ProductServiceDto } from "./productService.model";

export class Product{
    /**
     * 
     *
     */
    constructor(

        public productID?:number,
        public code?: string,
        public name?: string,
        public stock?: number,
        public monthFee?: number,
        public annualInstallments?: number,
        public regularPrice?: number,
        public discountOfv?: number,
        public nnew?: boolean,
        public offer?: boolean,
        public sapCode?: string,
        public categoryId?: number,
        public subCategoryId?: number,
        public brandId?: number,
        public sectionId?: number,
        public state?: boolean,
        public enabled?: string,
        public registerUser?: string,
        public productsFeatureList?:ProductFeauture[],
        public productFeeList?:ProductFee[],
        public productImages?:ProductImage[],
        public productsServiceList?:ProductServiceDto[],
        public order?:number,
        public commercialAllyFnbId?: number,
        public commercialAllyFnbName?: string,    
        public categoryFnbId?:number,
        public categoryFnbName?:string,
        public productFnbId?:number,
        public PrecioOferta?:number
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