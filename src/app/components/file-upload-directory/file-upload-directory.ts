import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileOvService } from 'src/app/services/backend/fileOv/file-ov.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-file-upload-directory',
  templateUrl: './file-upload-directory.html',
  styleUrls: ['./file-upload-directory.scss'],
})
export class FileUploadDirectoryComponent implements OnInit {
  @Input() acceptedFormat: string = '.pdf';
  @Input() maxSize: number = 102400;
  @Output() onSendFilesList: EventEmitter<FileItem[]> = new EventEmitter<
    FileItem[]
  >();
  wrongFilesList = [];
  filesList = [];
  uploadedFiles = [];
  
  @ViewChild('fileInput',{static:true}) fileInput: ElementRef;
  constructor(public _fileOvService: FileOvService) { }
  ngOnInit() { }

  async uploadFiles(files: any) {
    this.wrongFilesList = [];
    let _tempWrongFilesList = [];
    let _tempFilesList = [];
    const folderHolder = {};
    this.uploadedFiles = [];
    var formData = new FormData();
    for (let file of Array.from(files)) {      
      const path: string = file['webkitRelativePath'];
      const pathPieces = path.split('/');

      if (!pathPieces.reverse()[0].startsWith('.')) {
        const currentFolder = pathPieces[1];
        if (folderHolder[currentFolder]) {
          var file_aux = file as any;
          formData.append('files', file_aux as any, `${file_aux.name}-___-${currentFolder}`);
          formData.append('directorys', currentFolder);
          this.uploadedFiles.push({
            fileName: pathPieces[0],
            folder: currentFolder,
            folderId: folderHolder[currentFolder],
          });
        } else {

          folderHolder[currentFolder] = 1;
          var file_aux = file as any;
          formData.append('files', file_aux as any, `${file_aux.name}-___-${currentFolder}`);
          formData.append('directorys', currentFolder);
          this.uploadedFiles.push({
            fileName: pathPieces[0],
            folder: currentFolder,
            folderId: folderHolder[currentFolder],
          });
        }
      }
    }

    this._fileOvService.getEndpointMasive().subscribe((response: any) => {
      this._fileOvService.uploadOv(response.endpoint, response.token, formData).subscribe((data) => {
 
      //  this.descargarArchivoTexto(data.data as string,`carga_images-${this.obtenerFechaHoraActualDMY()}`)
      swal('Éxito', '"Los archivos se encuentran procesando."', 'success');
      }, () => { })
    })

    this.fileInput.nativeElement.value = '';
  }

  emitFilesList(files: FileItem[]) {    
    this.onSendFilesList.emit(files);
  }

  checkFileSizeMatches(fileSize: number): boolean {
    return parseInt((fileSize / 1024).toFixed(4)) > this.maxSize || false;
  }
  checkFileTypesMatches(fileType: string): boolean {
    
    if (!this.acceptedFormat.includes(fileType)) return false;
    else return fileType.match(this.acceptedFormat) === null;
  }

   obtenerFechaHoraActualDMY(): string {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
    const anio = fecha.getFullYear();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();
  
    // Formatear los componentes de la fecha y hora con dos dígitos si es necesario
    const diaFormateado = dia < 10 ? `0${dia}` : `${dia}`;
    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
    const horaFormateada = hora < 10 ? `0${hora}` : `${hora}`;
    const minutosFormateados = minutos < 10 ? `0${minutos}` : `${minutos}`;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : `${segundos}`;
  
    // Construir la cadena con el formato DMY HH:mm:ss
    const fechaHoraActualDMY = `${anio}/${mesFormateado}/${diaFormateado} ${horaFormateada}:${minutosFormateados}:${segundosFormateados}`;
  
    return fechaHoraActualDMY;
  }
  
  private descargarArchivoTexto(texto: string, nombreArchivo: string) {
    const elementoEnlace = document.createElement('a');
    const contenidoArchivo = new Blob([texto], { type: 'text/plain' });

    elementoEnlace.href = URL.createObjectURL(contenidoArchivo);
    elementoEnlace.download = nombreArchivo;

    elementoEnlace.style.display = 'none';
    document.body.appendChild(elementoEnlace);

    elementoEnlace.click();

    document.body.removeChild(elementoEnlace);
    URL.revokeObjectURL(elementoEnlace.href);
  }


}

export class FileItem {
  name: string;
  size: number;
  type: string;
  wrongSize = false;
  wrongFormat = false;
}
