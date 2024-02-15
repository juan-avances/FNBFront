import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-preview-imagen',
  templateUrl: './preview-imagen.component.html',
  styleUrls: ['./preview-imagen.component.scss']
})
export class PreviewImagenComponent {
    formGroup: FormGroup;
    changedImage = false;
    constructor(
        public modalReference: MatDialogRef<PreviewImagenComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder
        ) {
            this.createForm();
            this.previewImage(data.path);
    }

    previewImage(event: any) {        
        var reader = new FileReader();
        reader.readAsDataURL(event);
        reader.onload = _event => {
          this.changedImage = true;
          this.formGroup.controls.nombreLogo.patchValue(event.name);
          this.formGroup.controls.base64Logo.patchValue(reader.result);
        };
      }

      createForm() {
        this.formGroup = this.formBuilder.group({
          id: [0],          
          nombreLogo: [''],
          base64Logo: [''],
          imagePath: [''],          
        });
      }
}