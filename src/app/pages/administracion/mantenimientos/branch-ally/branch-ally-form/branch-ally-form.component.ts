import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ExpressionValidation } from 'src/app/@core/helpers/expression.validation';
import { TiendaAliada } from 'src/app/models/tienda-aliada.model';
import { Ubigeo } from 'src/app/models/ubigeo.model';
import { BranchAllyService } from 'src/app/services/backend/branch-ally.service';
import { UbigeoService } from 'src/app/services/backend/ubigeo.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-branch-ally-form',
  templateUrl: './branch-ally-form.component.html',
  styleUrls: []
})
export class BranchAllyFormComponent implements OnInit {
  formGroup: FormGroup;
  storeAllyList: TiendaAliada[];
  storeAllyListFiltered: Observable<TiendaAliada[]>;
  UbigeoList:Ubigeo[];
  provincias: Ubigeo[];
  distritos: Ubigeo[];
  departamentos: Ubigeo[];
  dataUbigeo:Ubigeo[];  
  departamentoId: number;
  provinciaId: number;
  distritoId: number;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private branchAllyService: BranchAllyService,
    private ubigeoService: UbigeoService
  ) {}

  async ngOnInit() {    
    this.createForm();
    await this.loadUbigeo();
    if (this.activatedRoute.snapshot.paramMap.get('id') !== null) {
      
      this.branchAllyService.get(this.activatedRoute.snapshot.paramMap.get('id')).subscribe(response => {    
        this.formGroup.controls.id.patchValue(response.data.id);
        this.formGroup.controls.codigo.patchValue(response.data.codigo);
        this.formGroup.controls.nombre.patchValue(response.data.nombre);
        this.formGroup.controls.direccion.patchValue(response.data.direccion);
        this.formGroup.controls.latitud.patchValue(response.data.latitud);
        this.formGroup.controls.longitud.patchValue(response.data.longitud);
        this.formGroup.controls.tiendaAliadaId.patchValue(response.data.tiendaAliadaId); 
        if(response.data.departamentoId>0){
          this.formGroup.controls.departamentoId.patchValue(response.data.departamentoId); 
          this.loadProvincias(response.data.departamentoId);
          this.formGroup.controls.provinciaId.patchValue(response.data.provinciaId); 
          this.loadDistritos(response.data.departamentoId,response.data.provinciaId);      
          this.formGroup.controls.distritoId.patchValue(response.data.ubigeoId);
          this.formGroup.controls.ubigeoId.patchValue(response.data.ubigeoId); 
        }    
        this.getAllTiendaAliada(response.data.tiendaAliadaId);
        
      });
    } else {
      this.getAllTiendaAliada(0);
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      id: [0],
      codigo: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(10),
          Validators.pattern(ExpressionValidation.Number)
        ]
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.LetterNumberSign)
        ]
      ],
      direccion: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.pattern(ExpressionValidation.AddressStreet)
        ]
      ],
      tiendaAliadaId: [''],
      tiendaAliada: [[], [Validators.required]],
      latitud:['',[Validators.min(-90),Validators.max(90)]],
      longitud:['',[Validators.min(-90),Validators.max(90)]],
      ubigeoId:[],
      departamentoId:[],
      provinciaId:[],
      distritoId:[]
    });
  }

  getAllTiendaAliada(tiendaAliadaId: number) {
    this.branchAllyService.getAllTiendaAliada().subscribe(response => {
      this.storeAllyList = response.data;
      this.storeAllyListFiltered = this.formGroup.controls.tiendaAliada.valueChanges.pipe(
        debounceTime(300),
        map(value => this.filterTiendaAliada(value))
      );
      if (tiendaAliadaId != 0) {
        this.formGroup.controls.tiendaAliada.patchValue(this.storeAllyList.find(p => p.id == tiendaAliadaId));
        this.formGroup.controls.tiendaAliadaId.patchValue(tiendaAliadaId);
      }
      this.formGroup.controls.tiendaAliada.setValidators(this.forbiddenNamesValidator(this.storeAllyList));
    });
  }

  displayFn(tiendaAliada?: TiendaAliada): string {
    return tiendaAliada ? tiendaAliada.nombre : undefined;
  }  

  setTiendaAliadaId() {
    this.formGroup.controls.tiendaAliadaId.patchValue(this.formGroup.controls.tiendaAliada.value.id);
    this.formGroup.updateValueAndValidity();
  }

  private filterTiendaAliada(value: any): TiendaAliada[] {
    if (typeof value !== 'string') return;
    const filterValue = value.toLowerCase();
    return this.storeAllyList.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  cancel() {
    this.router.navigate(['/sede-aliada']);
  }

  /**
   * Si el control fue modificado manualmente (no se escogió una opción del autocomplete), se validará que la opción ingresada exista en la lista
   * @param storeAllyList lista de aliados comerciales válidos
   */
  forbiddenNamesValidator(storeAllyList: TiendaAliada[]): ValidatorFn {
    return (formControl: FormControl): { [key: string]: any } | null => {
      if (
        typeof formControl.value === 'string' &&
        storeAllyList.find(p => p.nombre.toLocaleLowerCase() == formControl.value.toLocaleLowerCase()) ===
          undefined
      )
        return { 'forbidden-name': true };
      else return null;
    };
  }

  save() {
    if (typeof this.formGroup.controls.tiendaAliada.value == 'string') {
      this.formGroup.controls.tiendaAliadaId.patchValue(
        this.storeAllyList.find(
          p => p.nombre.toLocaleLowerCase() == this.formGroup.controls.tiendaAliada.value.toLocaleLowerCase()
        ).id
      );
    }


    if (this.formGroup.valid) {
      swal({
        text: '¿Estás seguro de realizar esta operación?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.value) {         
          const operation =
            this.formGroup.getRawValue().id > 0
              ? this.branchAllyService.update(this.formGroup.getRawValue().id, this.formGroup.getRawValue())
              : this.branchAllyService.add(this.formGroup.getRawValue());
          operation.subscribe(response => {
            if (response.valid) {
              this.router.navigate(['/sede-aliada']);
              swal('La operación se realizó satisfactoriamente', '', 'success');
            }
          });
        }
      });
    }
  }

  
  ChangeDistrito($event: any) { 
    this.formGroup.controls.distritoId.patchValue($event.value);
    this.formGroup.controls.ubigeoId.patchValue($event.value);
  }

  ChangeDepartamento($event: any) { 
    this.limpiarSeleccionados();
    this.formGroup.controls.departamentoId.patchValue($event.value); 
    this.loadProvincias($event.value);  
  }

  ChangeProvincia($event: any) { 
    this.formGroup.controls.provinciaId.patchValue($event.value);  
    this.formGroup.controls.distritoId.patchValue([]); 
    this.formGroup.controls.ubigeoId.patchValue([]); 
    this.loadDistritos(this.formGroup.getRawValue().departamentoId,$event.value);
  } 

  async loadUbigeo() {
    let response= await this.ubigeoService.getAllUbigeo().toPromise();      
    if (response.valid){
        this.UbigeoList = response.data.filter((x: { state: any; })=>x.state);
        this.loadDepartamentos();
    }  
  }

  loadDepartamentos(){
    if(this.UbigeoList.length>0){
      this.departamentos = Array.from(new Set(this.UbigeoList.map(x=>x.departamentoId))).
        map(departamentoId =>{
          return {
            departamentoId:departamentoId,
            departamento:this.UbigeoList.filter(x=>x.departamentoId==departamentoId)[0].departamento
          }
      });
      this.departamentos.sort((a, b) => (a.departamento < b.departamento ? -1 : 1));
    }
  }

  loadProvincias(idDepartamento: any){
    this.provincias = Array.from(new Set(this.UbigeoList.filter(x=>x.departamentoId==parseInt(idDepartamento)).map(x=>x.provinciaId))).
      map(provinciaId =>{
        return {
          provinciaId:provinciaId,
          provincia:this.UbigeoList.filter(x=>x.departamentoId==parseInt(idDepartamento) && x.provinciaId==provinciaId)[0].provincia
        }
      });
      this.provincias.sort((a, b) => (a.provincia < b.provincia ? -1 : 1));
  }

  loadDistritos(idDepartamento: any,idProvincia: any){    
    this.distritos = this.UbigeoList.filter(x=>x.departamentoId==parseInt(idDepartamento) && x.provinciaId==parseInt(idProvincia));
    this.distritos.sort((a, b) => (a.distrito < b.distrito ? -1 : 1));
  }

  limpiarSeleccionados(){
    this.formGroup.controls.distritoId.patchValue([]);
    this.formGroup.controls.provinciaId.patchValue([]); 
    this.formGroup.controls.ubigeoId.patchValue([]); 
  }

  get deparmentValidate(){
    return this.formGroup.controls['departamentoId'].errors && this.formGroup.controls['departamentoId'].touched
  }

  get provinciaValidate(){
    return this.formGroup.controls['provinciaId'].errors && this.formGroup.controls['provinciaId'].touched
  }

  get distritoValidate(){
    return this.formGroup.controls['distritoId'].errors && this.formGroup.controls['distritoId'].touched
  }
}
