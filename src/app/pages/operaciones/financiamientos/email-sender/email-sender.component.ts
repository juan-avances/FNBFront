import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder, FormArray, Form } from '@angular/forms';
import { CorreoService } from 'src/app/services/backend/correo.service';
import { EmailShipment } from '../../../../models/email-shipment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-email-sender',
  templateUrl: './email-sender.component.html',
  styleUrls: ['./email-sender.component.scss']
})
export class EmailSenderComponent implements OnInit {
  formGroup: FormGroup;
  maxEmailCount: number = 5;
  constructor(
    public modalReference: MatDialogRef<EmailSenderComponent>,
    private formBuilder: FormBuilder,
    private emailService: CorreoService,
    @Inject(MAT_DIALOG_DATA) private input: any
  ) {}

  ngOnInit() {
    this.createForm();
    this.addEmailControl(this.input.clientEmail);
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      emailList: this.formBuilder.array([], Validators.minLength(2)),
      type: [this.input.type],
      data: [this.input.data]
    });
  }
  get emailListControl(): FormArray {
    return this.formGroup.controls.emailList as FormArray;
  }


  addEmailControl(email?: string) {
    if (this.emailListControl.length < this.maxEmailCount) this.emailListControl.push(this.getEmailControl(email));
  }

  getEmailControl(email?: string): FormGroup {
    return this.formBuilder.group({
      email: [email, [Validators.email, Validators.required]]
    });
  }
  send() {
    let msg:string="";
    let position = 1;

    this.emailListControl.controls.forEach((control:FormGroup)=>{

      if(control.controls['email'].errors){
         msg +=( `<p>El campo en la posición ${position} no puede estar vacío.</p><br>`);
      } 
      position +=1;
    });

    if(msg.length>2) return swal({title:'Aviso',html:msg,type:'info'});

    let shipment = new EmailShipment();
    shipment.emailList = this.emailListControl.controls.map(form => form.get('email').value);
    shipment.data = this.formGroup.controls.data.value;

    this.emailService.sendEmail(shipment).subscribe(
      response => {
        if (response.valid) {
          swal('', 'El correo fue enviado exitosamente.', 'success');
          this.modalReference.close();
        } else swal('', 'Ha ocurrido un error inesperado.', 'error');
      },
      error => {
        swal('', 'Ha ocurrido un error inesperado.', 'error');
      }
    );
  }
  getDefaultEmail() {
    this.emailService.initEmailSender().subscribe(response => {
      let emailList = response.data.emails.map(function(item) {
        return item['email'];
      });
      this.formGroup.controls.emailList.patchValue(emailList.join('; '));
    });
  }
  deleteEmailControl(index: number) {
    if (this.emailListControl.length > 1) this.emailListControl.removeAt(index);
  }
}
