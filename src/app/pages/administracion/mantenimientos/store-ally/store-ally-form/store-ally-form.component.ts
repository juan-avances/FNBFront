import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import { Category } from 'src/app/models/category.model';
import { TiendaAliadaCategoria } from 'src/app/models/tienda-aliada-categoria.model';
import { TiendaAliada } from 'src/app/models/tienda-aliada.model';
import { CategoryService } from 'src/app/services/backend/category.service';
import { StoreAllyUpdateService } from 'src/app/services/feature/Administracion/store-ally/store-ally-update.service';

@Component({
  selector: 'app-store-ally-form',
  templateUrl: './store-ally-form.component.html',
  styleUrls: []
})
export class StoreAllyFormComponent implements OnInit {
  formGroup: FormGroup;
  changedImage = false;
  categoryList: Category[];
  tiendaAliadaCategoriaList: TiendaAliadaCategoria[];
  tiendaAliada: TiendaAliada;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storeAllyUpdateService: StoreAllyUpdateService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {    
    this.createForm();
    this.loadCategory();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      this.storeAllyUpdateService.init(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(
        response => {               
          this.formGroup.controls.id.patchValue(response.id);
          this.formGroup.controls.nombre.patchValue(response.nombre);
          this.formGroup.controls.estadoEnPortal.patchValue(response.estadoEnPortal);
          this.formGroup.controls.base64Logo.patchValue(response.base64Logo);
          this.formGroup.controls.nombreLogo.patchValue(response.nombreLogo);         
          this.formGroup.controls.tiendaAliadaCategoriaList.patchValue(response.tiendaAliadaCategoriaList.map(item=>item.categoriaId));        
        },
        error => {
          this.router.navigate(['/tienda-aliada']);
        }
      );
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      estadoEnPortal: [false],
      nombreLogo: [''],
      base64Logo: [''],
      imagePath: [''],
      tiendaAliadaCategoriaList: [this.categoryList]
    });
  }

  previewImage(event: any) {
    let files = event.target.files;
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.changedImage = true;
      this.formGroup.controls.nombreLogo.patchValue(files[0].name);
      this.formGroup.controls.base64Logo.patchValue(reader.result);
    };
  }

  save() {
    if (this.formGroup.valid) {
      if(!this.changedImage) {
        this.formGroup.controls.base64Logo.patchValue(null);
      }
      this.tiendaAliada = new TiendaAliada;
      this.tiendaAliada = this.formGroup.getRawValue();
      this.llenaCategoriasSeleccionadas();
      this.tiendaAliada.tiendaAliadaCategoriaList = this.tiendaAliadaCategoriaList;     
      this.storeAllyUpdateService.save(this.tiendaAliada);
    }
  }

  llenaCategoriasSeleccionadas(){
    this.tiendaAliadaCategoriaList=[];
    if(this.tiendaAliada.tiendaAliadaCategoriaList != null) {
      for(let categoriaId of this.tiendaAliada.tiendaAliadaCategoriaList){
        let tiendaAliadaCategoria= new TiendaAliadaCategoria;      
        tiendaAliadaCategoria.categoriaId = Number(categoriaId);      
         this.tiendaAliadaCategoriaList.push(tiendaAliadaCategoria);
       } 
    }
  }

  onChange(event: any) {
    if (!(/^[0-9]*$/.test(event.key))) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    if (!(/^[0-9]*$/.test(pastedText))) {
      event.preventDefault();
    }
  }

  cancel() {
    this.router.navigate(['/tienda-aliada']);
  }

  loadCategory() {
    this.categoryService.getAllCategoriaForPortal().subscribe(
      (response) => {        
        if (response.valid) {           
          this.categoryList = response.data;       
        }
      }
    )
  }  
}
