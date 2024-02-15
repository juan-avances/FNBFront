export class ProductServiceDto {

    constructor(
        
        public productID?:number,
        public serviceID?:number,
        public product?:string,
        public code?:string,
        public name?:string,
        public monthFee?:number,
        public regularPrice?:number,
        public discountOfv?:number,
        public sapCode?:string,
        public categoryName?:string,
        public subCategoryName?:string,
        public brandName?:string,
        public precioOferta?:string
    ) {

    }
}