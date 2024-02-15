import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { DocumentoComentario, FinanciamientoArchivoDto } from 'src/app/models/financiamiento.model';
import { FinanciamientoArchivoService, FinanciamientoService } from 'src/app/services/backend.service.index';
import { FinanciamientoMantenedorArchivoService } from 'src/app/services/feature.service.index';
import Swal from 'sweetalert2';
import * as JSZip from 'jszip';
import { MatDialog } from '@angular/material';
import { PreviewImagenComponent } from '../../financiamiento-archivo/preview-imagen/preview-imagen.component';
@Component({
  selector: 'documento-seccion',
  templateUrl: './documento-seccion.component.html',
  styleUrls: ['./documento-seccion.component.scss']
})
export class DocumentoSeccionComponent implements OnInit {
  @Input() financiamientoId : number;
  @Input() tipoDocumento: string;
  private _documentos: any[] = [];
  readOnlyBool: boolean = false;
  estadoConformidad: number = -1;

  @Input()
  set documentos(val: any[]) {
      this._documentos = val;
      this.loadDataValues();
  }

  get documentos(): any[] {
      return this._documentos;
  }
  @Input() todosDocumentosAgregados: boolean;
 
  @Input() nroPedido : string;
  allowedExtensions = 'audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/oga,audio/m4a,video/mp4,image/jpg,image/jpeg,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf';
  rol: string;
  documentsQueue: any[] = [];
  conformidadList: any[] = [];
  conformidadListAux: any[] = [];
  tipoConformidadList: any[] = [];
  isSaving = false;
  promises: any[] = [];
  financiamientoArchivos: FinanciamientoArchivoDto[] = [];
  documentosAux: any[];
  ocultar: boolean = false;
  ocultarBoton: boolean = false;
  documentoComentarios : DocumentoComentario[] = [];
  valuesList: any[] = [];
  constructor(
    public _financiamientoService: FinanciamientoService,
    public _financiamientoArchivoService: FinanciamientoArchivoService,
    public dialog: MatDialog,
    private mant :FinanciamientoMantenedorArchivoService,private cd: ChangeDetectorRef
    
  ) { 
   
    this.rol = localStorage.getItem('RolUsuario');
  }

  ngOnInit() {
    if(this.rol != "Gestor de operación" && this.rol != "Administrador Web"){
      this.readOnlyBool = true;
    }

    if(this.documentos[0].estado == 4 && this.documentos[0].tipoDocumento != "Sustento de Anulación"){
      this.ocultar = false;
      this.ocultarBoton = true;
    }
    if(this.documentos[0].estado != 4 && this.documentos[0].tipoDocumento == "Sustento de Anulación"){
      this.ocultar = true;
      this.ocultarBoton = true;
    }
  }
  getValuesDesplegables(financiamientoId: number) {
    this._financiamientoService.getValuesDesplegables(financiamientoId).subscribe( res => {
      this.valuesList = res.data;
      for (let i = 0; i < this.documentos.length; i++) {
        let documento = this.documentos[i];
        documento.conformidad = this.getValueConforme(documento.idFinanciamientoArchivo);
        this.changeTipoConformidad(documento.conformidad, documento);
        documento.comentarios = this.getValueComentarios(documento.idFinanciamientoArchivo);
    
        if (this.valuesList.length == 0) break;
        console.log("valuesList", this.valuesList)
        let filterData = this.valuesList.find(x => x.idFinanciamientoArchivo == documento.idFinanciamientoArchivo);
        documento.revision = filterData == undefined ? '0' : filterData.revision;
    }    
      this. estadoConformidad = this.sonTodosConforme();
    })
  }
  getRevision(row){
    //console.log("row",row)
  }
  sonTodosConforme() {
    const uniqueIds = new Set(this.documentos.map(documento => documento.idDocumento));
    const uniqueIdsArray = Array.from(uniqueIds);    
    return -1;
  }
  loadDataValues() {
    this.getValuesDesplegables(this.financiamientoId);
    
  }
  getValueConforme(idFinanciamientoArchivo){
    const filterValue = this.valuesList.filter(x => x.idFinanciamientoArchivo == idFinanciamientoArchivo)[0]
    if(filterValue){
      return filterValue.desplegablesTipoValue;
    }else{
      return "";
    }
  }

  getValueComentarios(idFinanciamientoArchivo){
    const filterValue = this.valuesList.filter(x => x.idFinanciamientoArchivo == idFinanciamientoArchivo)[0]
    if(filterValue){
      return filterValue.idDesplegableValue;
    }else{
      return -1;
    }
  }

  changeTipoConformidad(event, documento) {
    documento.comentariosFiltrados = documento.deplegableComentario
    .filter(x => x.tipo === event);
  }

  changeComentario(event, idDocumento, idFinanciamientoArchivo){
    if (idFinanciamientoArchivo === -1) {
      return;
    }

    const selectedchangeComentario = event.value;
    let user = Number(localStorage.getItem('id'));
    let doc : DocumentoComentario = {
      idDesplegablesTipo: selectedchangeComentario,
      idDocumento: idDocumento,
      idFinanciamientoArchivo: idFinanciamientoArchivo,
      isActive: true,
      id: 0,
      idUser: user
    }
   
    const index = this.documentoComentarios.findIndex(d => 
      d.idDocumento === idDocumento && d.idFinanciamientoArchivo === idFinanciamientoArchivo
    );

    if (index !== -1) {
      this.documentoComentarios[index] = doc;
    } else {
      this.documentoComentarios.push(doc);
    }
  }

  refresh(){
    this._financiamientoService.getDocumentosFinanciamiento(this.financiamientoId).subscribe(res =>{
      
      this.documentos = res.data.filter( x => x.tipoDocumento == this.tipoDocumento);
      this.documentosAux = res.data.filter( x => x.tipoDocumento == this.tipoDocumento);
      this.todosDocumentosAgregados = this.documentos
      .filter(doc => !doc.nombre.includes("Otros Documentos"))
      .every(doc => doc.documentoAgregado);
      this.loadDataValues();
    })
  }

  loadArchivo(event: any, documento: any) {
    const files = event.target.files;
    const maxFiles = 3;
    const maxFileSizeMB = 200;
    const allowedExtensionsArray = this.allowedExtensions.split(',');
    if (files.length > maxFiles) {
      this.showAlert('Error', 'error', 'Solo se permiten cargar un máximo de 3 archivos.');
      return;
    }
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSize += file.size / (1024 * 1024); // Convertir tamaño a MB

        if (!allowedExtensionsArray.includes(file.type)) {
          this.showAlert('Error', 'error', 'Uno o más archivos tienen una extensión no permitida.');
          return;
        }
    }
    if (totalSize > maxFileSizeMB) {
      this.showAlert('Error', 'error', 'La suma de los tamaños de los archivos supera los 200MB.');
      return;
    }
   
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newFileName = documento.nombre + '-' + file.name;
      const existsInFinanciamientoArchivos = this.financiamientoArchivos.some(
          fa => fa.Descripcion === documento.nombre && fa.NombreArchivo === newFileName
      );
      const existsInDocumentos = this.documentos.some(
          doc => doc.nombre === documento.nombre && doc.nombreArchivo === newFileName
      );
      if (existsInFinanciamientoArchivos || existsInDocumentos) {
          this.showAlert('Error', 'error','Ya existe el documento en el item: ' + documento.nombre);
          return;
      }
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const promise = new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              const base64String = (reader.result as string).split(',')[1];
              const financiamientoArchivo: FinanciamientoArchivoDto = {
                  Id: 0,
                  FinanciamientoId: this.financiamientoId,
                  Descripcion: documento.nombre,
                  idTipoArchivo: documento.idTipo,
                  NombreArchivo: documento.nombre + '-' + file.name,
                  Base64Logo: base64String,
                  idDocumento: documento.idDocumento
              };
              this.financiamientoArchivos.push(financiamientoArchivo);
              resolve(); 
          };
          reader.onerror = (error) => reject(error); 
      });
      this.promises.push(promise); 
    }
    this.viewPreviewPdfOrImage(event.target.files[0])
    Promise.all(this.promises).then(() => {
      let doc = this.updateDocumentos();
      //this.loadingFiles = false;
    });
    this.cd.detectChanges();
  }
  viewPreviewPdfOrImage(path: any) {
    //debugger;
    let imageExtensions = 'image/jpg,image/jpeg/image/png';
    if (path.type === 'application/pdf') {
      this.mant.ViewPreViewPdf(path);
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

  getTooltipMessage(nombre: string): string {
    switch (nombre) {
        case 'Contrato FNB':
            return 'Documento con firma y huella dactilar del titular. Contrato + Hoja Resumen + Cronograma';
        case 'Foto del cliente':
            return 'Se sugiere que la foto sea a rostro descubierto: sin lentes, mascarilla, gorra, capucha o cualquier accesorio que lo cubra.';
        case 'Foto del DNI del titular':
        case 'Foto del DNI titular':
            return 'Foto por ambas caras';
        case 'Acuerdo de compra y entrega':
        case 'Boleta de Venta':
            return 'Documento con firma y huella dactilar del titular.';
        case 'Otros Documentos Venta':
        case 'Otros Documentos Entrega':
            return 'Fotos del predio, Guía de remisión, Recibo de luz y agua, Foto del cliente, Carta Poder para la recepción del producto, etc.';
        case 'Foto del cliente con el producto':
            return 'Se sugiere que la foto sea a rostro descubierto: sin lentes, mascarilla, gorra, capucha o cualquier accesorio que lo cubra.';
        case 'Foto de Tarjeta de Propiedad':
        case 'Foto de Placa':
        case 'Acta de conformidad':
        case 'Correo de Anulación':
            return ''; 
        case 'Otros Documentos Anulación':
            return 'Notas de crédito, anulación de NC.';
        default:
            return '';
    }
}

  async updateDocumentos() {
    //debugger;
    const newDocuments = [];
    this.documentos.forEach(documento => {
      let financiamientos = this.financiamientoArchivos.filter( x => x.Descripcion == documento.nombre)
      if(financiamientos.length > 0){
        for (let index = 0; index < financiamientos.length; index++) {
          const financiamiento = financiamientos[index];
          if(documento.nombreArchivo == "Sin Documento"){
            documento.nombreArchivo = financiamiento.NombreArchivo;
            break;
          }else{
            if(documento.nombreArchivo != financiamiento.NombreArchivo){
              const newDocumento = {
                idFinanciamientoArchivo: -1,
                idTipo: financiamiento.idTipoArchivo,
                tipoDocumento: this.getTipoDocumento(financiamiento.idTipoArchivo),
                idDocumento: documento.idDocumento,
                nombre: financiamiento.Descripcion,
                documentoAgregado: false,
                nombreArchivo: financiamiento.NombreArchivo,
                idDocResult: 0,
                estado: 0
              };
              const exists = this.documentos.some(doc => doc.nombreArchivo === newDocumento.nombreArchivo);
              if (!exists) {
                newDocuments.push(newDocumento);
              }
              break;
            }
          }
        }           
      }
    });
    for(let doc of newDocuments) {
      this.documentos.push(doc); 
      this.cd.detectChanges();
    }
    this.documentos = [...this.documentos];    
    this.cd.detectChanges();
    return this.documentos
    
  }

  getTipoDocumento(idTipo: number): string {
    switch (idTipo) {
      case 1:
        return "Sustento de Venta";
      case 2:
        return "Sustento de Entrega";
      case 3:
        return "Sustento de Anulación";
      default:
        return "";
    }
  }

  saveDocuments(){
    if(this.financiamientoArchivos.length == 0 && this.documentoComentarios.length > 0 && (this.rol == "Gestor de operación" || this.rol == "Administrador Web")){
      this._financiamientoArchivoService.insertDocumentoComentarios(this.documentoComentarios).subscribe( res => {        
        this.showAlert('Éxito', 'success', 'Se grabó la validacion documentaria');
      })
    }else if(this.financiamientoArchivos.length > 0 ){
       Promise.all(this.promises).then(() => {
        this._financiamientoArchivoService.addArchivo(this.financiamientoArchivos).subscribe(res => {
        this.showAlert('Éxito', 'success', 'Se cargaron los archivos satisfactoriamente');
        this.refresh();
        this.financiamientoArchivos = [];
      });
      }).catch(error => {
        this.showAlert('Error', 'error','Error al leer los archivos: ' + error);
        console.error("Error al leer los archivos:", error);
        this.refresh();
      });
    }
  }

  cancel(){
    this.financiamientoArchivos = [];
    this.promises = [];
    this.refresh();
    //this.documentos = this.documentosAux
  }

  deleteDocumento(documento){
    if((documento.nombreArchivo === "Sin Documento" || this.todosDocumentosAgregados) && this.rol != "Gestor de operación"){
      return;
    }

    Swal({
      text: '¿Estás seguro de realizar esta operación?',
      type: 'question',
      confirmButtonClass: 'btn-azul',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        if(documento.idFinanciamientoArchivo != -1){
          const resultadoServicio = this._financiamientoArchivoService.delete(documento.idFinanciamientoArchivo);
          resultadoServicio.subscribe((response) => {
            if (response.valid) {
              this.showAlert('Éxito','success','Se eliminó el archivo satisfactoriamente');
              this.refresh();            
            }else{
              this.showAlert('Error', 'error', 'Ocurrió un error al eliminar el documento');
            }
          });
        }
        // Eliminar de financiamientoArchivos
        const indexFinanciamiento = this.financiamientoArchivos.findIndex(
          fa => fa.idTipoArchivo === documento.idTipo && fa.Descripcion === documento.nombre && fa.NombreArchivo == documento.nombreArchivo
        );
        if (indexFinanciamiento !== -1) {
          this.financiamientoArchivos.splice(indexFinanciamiento, 1);
        }
  
        // Actualizar NombreArchivo en documentos
        this.documentos = this.documentos.map(doc => {
          if (doc.idTipo === documento.idTipo && doc.nombre === documento.nombre && doc.nombreArchivo === documento.nombreArchivo) {
            return {
              ...doc,
              nombreArchivo: "Sin Documento"
            };
          }
          return doc;
        });
      }
    });
  }
  
  showAlert(title:string, type:any, text:string){
    Swal({
      title: title,
      text:text,
      type: type,
      toast: false,
      position: 'center',
      showConfirmButton: true,
      timer: 15000
    });
  }
  
  downloadDocumentos(documentosTodos) {
    const zip = new JSZip();

    const mapaIdNombre = new Map(documentosTodos
        .filter(doc => doc.documentoAgregado)
        .map(doc => [doc.idFinanciamientoArchivo, doc.nombreArchivo]));
    const idsFinanciamientoArchivo = Array.from(mapaIdNombre.keys()).map(id => Number(id));

    this._financiamientoArchivoService.downloadList(idsFinanciamientoArchivo).subscribe(response => {
        response.forEach(archivoDto => {
            const blob = base64ToBlob(archivoDto.fileBytes);
            const nombreArchivo = mapaIdNombre.get(archivoDto.id);
            console.log("nombreArchivo", nombreArchivo);
            if (nombreArchivo) {
                zip.file(nombreArchivo.toString(), blob);
            }
        });

        zip.generateAsync({ type: 'blob' }).then(blobZip => {
            downloadBlob(blobZip, 'Pedido-' + this.nroPedido.toString() + '-' + this.tipoDocumento + '.zip');
        });
    });         
}


  deleteDocumentos(documentosTodos) {
    if(this.todosDocumentosAgregados && this.rol != "Gestor de operación"){
      return;
    }
    const idsFinanciamientoArchivo = documentosTodos
        .filter(doc => doc.documentoAgregado)
        .map(doc => doc.idFinanciamientoArchivo);

    Swal({
        text: '¿Estás seguro de eliminar todos los archivos?',
        type: 'question',
        confirmButtonClass: 'btn-azul',
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.value) {            
            const observables = idsFinanciamientoArchivo.map(id => this._financiamientoArchivoService.delete(id));

            forkJoin(observables).subscribe(responses => {               
                const allSuccessful = responses.every(response => response);
                if (allSuccessful) {
                    this.showAlert('Éxito', 'success', 'Se eliminaron los archivos satisfactoriamente');
                } else {
                  this.showAlert('Error', 'error', 'Ocurrió un error al eliminar algún documento');
                }
                this.refresh();
            });
        }
    });
}
  get shouldHideButton(): boolean {    
    return this.documentos.some(x => x.documentoAgregado);
  }
  shouldChangeColor(documento: any): boolean {
    if ((documento.idTipo === 1 || documento.idTipo === 2) && documento.estado === 4) {
        return true;
    }
    if (documento.idTipo === 3 && documento.estado !== 4) {
        return true;
    }
    return false;
  }

  shouldDisableButtons(documento: any): boolean {
      return this.shouldChangeColor(documento);
  }

  shouldDisableAllButtons(): boolean {
      return (this.rol !="Gestor de operación" || this.documentos.some(doc => this.shouldDisableButtons(doc)));
  }

  getRoundStateColorClass(): string {
    if (this.shouldDisableButtons(this.documentos[0])) {
        return 'bg-gray';
    }
    if (!this.todosDocumentosAgregados) {
        return 'bg-red';
    }
    if (this.todosDocumentosAgregados) {
        return 'bg-green';
    }
    return ''; // default
  }
  
  getDocumentosTooltip(): string {
    return this.documentos.map(doc => doc.nombre).join(', ');
  }
  downloadDocumento(documento){
    this._financiamientoArchivoService.download(documento.idFinanciamientoArchivo).subscribe( res =>{
      const byteCharacters = atob(res);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const fileBlob = new Blob([byteArray], { type: 'application/octet-stream' });

      const blobUrl = URL.createObjectURL(fileBlob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = documento.nombreArchivo;
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    })
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}


function base64ToBlob(base64: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray]);
}