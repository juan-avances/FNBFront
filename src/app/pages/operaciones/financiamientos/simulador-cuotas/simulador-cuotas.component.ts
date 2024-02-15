import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';
import { FinanciamientoCuotasComponent } from '../financiamiento-cuotas/financiamiento-cuotas.component';

@Component({
  selector: 'app-simulador-cuotas',
  templateUrl: './simulador-cuotas.component.html',
  styleUrls: []
})
export class SimuladorCuotasComponent implements OnInit {
  forma: FormGroup;
  @ViewChild('cuotas', { static: false }) cuotas: FinanciamientoCuotasComponent;

  lineaCredito: number;

  constructor(
    public dialogRef: MatDialogRef<SimuladorCuotasComponent>,
    public _financiamientoEdicionService: FinanciamientoEdicionService
  ) {}

  ngOnInit() {
    if (typeof Storage !== 'undefined' && localStorage.getItem('lineaCredito') !== null)
      this.lineaCredito = parseFloat(localStorage.getItem('lineaCredito'));

    this.setForm();
  }

  setForm() {
    this.forma = new FormGroup({
      montoTotal: new FormControl('', [Validators.required, Validators.min(1), Validators.max(this.lineaCredito)])
    });
  }

  btnCerrar(): void {
    this.dialogRef.close();
  }

  calcular() {
    this.cuotas.generatePlanCuotas(this.forma.value.montoTotal);
  }
}
