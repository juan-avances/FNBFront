import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FinanciamientoMantenedorArchivoService } from 'src/app/services/feature.service.index';
import { PagingGridComponent } from 'src/app/components/paging-grid/paging-grid.component';
import { PrimeTable } from 'src/app/@core/models/prime-table.model';
import { LazyLoadEvent } from 'primeng/api';
import swal from 'sweetalert2';
import { MatSelectChange } from '@angular/material';
import { FinanciamientoArchivoService } from 'src/app/services/backend.service.index';
import { GlobalService } from 'src/app/services/global.service';
import { FileListModel } from 'src/app/@core/models/file-list.model';
import { FileUploadModel } from 'src/app/@core/models/file-upload.model';
import { PreviewImagenComponent } from './preview-imagen/preview-imagen.component';
@Component({
  selector: 'app-financiamiento-archivo',
  templateUrl: './financiamiento-archivo.component.html',
  styleUrls: ['./financiamiento-archivo.component.scss'],


})
export class FinanciamientoArchivoComponent implements OnInit {
  forma: FormGroup;
  dataTable: PagingGridComponent;
  dataEntity: PrimeTable;
  fileListModel: FileListModel;
  rowGroupMetadata: any;
  tipoArchivo = [];
  filesv2 = [];
  filesv3: Array<FileUploadModel> = [];

  modificar: boolean;

  filter = {};
  nombres = [];
  filez = [];

  allowedExtensions: string;
  selectedData: { value: any; text: string; };

  isSustento: number = 0;
  isEntrega: number = 0;

  constructor(
    public modalReference: MatDialogRef<FinanciamientoArchivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _financiamientoMantenedorArchivoServicio: FinanciamientoMantenedorArchivoService,
    public _financiamientoArchivoService: FinanciamientoArchivoService,
    public _global: GlobalService,
    public dialog: MatDialog,
  ) {

  }

  ngOnInit() {
    if (this._global.isUsuarioVisualizador()) {
      this.modificar = false;
    } else {
      this.modificar = true;
    }
    this.forma = this._financiamientoMantenedorArchivoServicio.getForm();
    this.dataEntity = this.init(this.dataTable);
    this.dataEntity.data = [];
    this.allowedExtensions = 'audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/oga,audio/m4a,video/mp4,image/jpg,image/jpeg,image/png,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';
    //inicializa primera carga
    this.refreshGrid();
    //subscripcion que se ejecuta por el commponent child
    this._financiamientoMantenedorArchivoServicio.grillaLoad.subscribe(() => {

      this.refreshGrid();
      this.data.refreshGridParent();

    });
  }
  init(table: PagingGridComponent): PrimeTable {
    this.dataTable = table;
    return (this.dataEntity = this._financiamientoMantenedorArchivoServicio.getConfigTable());
  }




  deleteFile(filename: string) {
    this._financiamientoArchivoService.deleteFile(filename).subscribe(res => {

    });
  }



  send() {
    this.forma.get('financiamientoId').setValue(this.data.financiamientoId);
    swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        for (var i = 0; i < this.tipoArchivo.length; i++) {
          this.tipoArchivo[i].NombreArchivo = this.filesv2[i].nombre
        }

        this.tipoArchivo = [];
        this.filesv3.forEach(element => element.file.forEach(itemFile => this.tipoArchivo.push(itemFile)));

        const resultadoServicio = this._financiamientoMantenedorArchivoServicio.saveChange(this.tipoArchivo);
        resultadoServicio.subscribe((response) => {
          if (response.valid) {
            this.filesv2 = [];
            this.filesv3 = [];
            this.tipoArchivo = [];
            swal('La operación se realizó satisfactoriamente', '', 'success');
            this.forma.get('idTipoArchivo').setValue(1);
            this.forma.get('base64Logo').setValue(null);
            this.forma.get('imagePath').setValue(null);
            this.forma.get('nombreArchivo').setValue(null);
            this.filesv2.splice(this.filesv2[0])
            this.filesv2.pop()
            this.filesv3.pop();

            this.data.refreshGridParent();
            this.refreshGrid();
          }
        });
      }
    });
  }

  deleteAll(i: number, idTipoArchivo: number) {
    this.filesv2.splice(i, 1)
    this.tipoArchivo.splice(i, 1)

    /*
    if(this.tipoArchivo != []){
      this.forma.get('base64Logo').setValue(null);

    }*/
    const objFileTipoArchivo = this.filesv3.find(x => x.idTipoArchivo == idTipoArchivo);
    for (var t = objFileTipoArchivo.file.length - 1; t >= 0; t--) {
      t == i && objFileTipoArchivo.file.splice(t, 1);
    }
  }

  loadLazy(event: LazyLoadEvent) {
    event.filters = { financiamientoId: { value: this.data.financiamientoId, matchMode: 'equals' } };
    const primerNgFilter = Object.assign({ columnas: this.dataEntity.columnas }, event);
    this._financiamientoMantenedorArchivoServicio.loadLazyFilter(primerNgFilter, '').subscribe((response) => {
      if (response.valid) {

        this.dataEntity.data = response.data.entities;
        this.dataEntity.totalRegistros = response.data.count;


        this.isSustento = this.dataEntity.data.filter(x => x.idTipoArchivo == 1).length;
        this.isEntrega = this.dataEntity.data.filter(x => x.idTipoArchivo == 2).length;

      }
    });
  }

  selectedValue(event: MatSelectChange) {
    this.selectedData = {
      value: event.value,
      text: event.source.triggerValue
    };
  }

  async loadArchivo(event, idTipoArchivo) {

    var archivo = idTipoArchivo;
    const fileNamesList = [];

    this.viewPreviewPdfOrImage(event.target.files[0])

    for (var i = 0; i < event.target.files.length; i++) {
      var files = event.target.files[i];
      if (files.length === 0) return;

      if (!this.allowedExtensions.includes(files.type)) {
        swal('Tipo de archivo no válido', '', 'warning');
        return false;
      }

      let mb = 20;
      let bytes = mb * 1024 * 1024;
      if (files.size >= bytes) {
        swal(`Solo se puede adjuntar ${mb} MB como capacidad máxima`, '', 'warning');
        return false;
      }

      this.filesv2.push({
        'nombre': files.name,
      })

      const file = {
        'idTipoArchivo': archivo,
        "FinanciamientoId": this.data.financiamientoId,
        "Descripcion": ' ',
        "NombreArchivo": files.name,
        "Base64Logo": null
      }

      let objFileTipoArchivo = this.filesv3.find(x => x.idTipoArchivo == idTipoArchivo);
      if (objFileTipoArchivo == undefined) {
        objFileTipoArchivo = { idTipoArchivo, file: [] } as FileUploadModel;
        objFileTipoArchivo.file.push(file)
        this.filesv3.push(objFileTipoArchivo)
      } else {
        objFileTipoArchivo.file.push(file)
      }

      var reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = async (_event) => {
        var z = 0;

        const file = {
          'idTipoArchivo': archivo,
          "FinanciamientoId": this.data.financiamientoId,
          "Descripcion": ' ',
          "NombreArchivo": files.name,
          "Base64Logo": (_event.target as any).result
        }
        await this.tipoArchivo.push(file);

        setTimeout(() => {
          let objFileTipoArchivo = this.filesv3.find(x => x.idTipoArchivo == idTipoArchivo);
          const fileNothing = objFileTipoArchivo.file.find(x => x.Base64Logo == null);
          fileNothing.Base64Logo = (_event.target as any).result;
        }, 100);

        this.forma.get('base64Logo').setValue((_event.target as any).result);
        this.forma.get('nombreArchivo').setValue(files.name);
      };
    }
  }

  refreshGrid() {
    this.loadLazy({
      first: 0,
      globalFilter: null,
      multiSortMeta: undefined,
      rows: 10,
      sortField: 'Id',
      sortOrder: 1,
    });
    this.forma.get('base64Logo').setValue(null);
  }

  viewPreviewPdfOrImage(path: any) {
    //debugger;
    let imageExtensions = 'image/jpg,image/jpeg/image/png';
    if (path.type === 'application/pdf') {
      this._financiamientoMantenedorArchivoServicio.ViewPreViewPdf(path);
    }
    else if (imageExtensions.includes(path.type)) {
      this.openAdjuntarArchivo(path);
    }
  }


  openAdjuntarArchivo(path: any) {
    const dialogRef = this.dialog.open(PreviewImagenComponent, {
      width: '950px',
      data: {
        path: path
      }
    });
  }
}