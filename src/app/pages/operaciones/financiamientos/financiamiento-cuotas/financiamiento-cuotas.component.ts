import { Component, OnInit, Input } from '@angular/core';
import { PlanCuotas } from 'src/app/models/financiamiento.model';
import { FinanciamientoEdicionService } from 'src/app/services/feature.service.index';

@Component({
  selector: 'app-financiamiento-cuotas',
  templateUrl: './financiamiento-cuotas.component.html',
  styleUrls: []
})
export class FinanciamientoCuotasComponent implements OnInit {
  @Input() montoEvaluar = 0;

  planCuotas: PlanCuotas = {
    cuota3: 0,
    cuota6: 0,
    cuota9: 0,
    cuota12: 0,
    cuota18: 0,
    cuota24: 0,
    cuota36: 0,
    cuota48: 0,
    cuota60: 0
  };
  constructor(public _financiamientoEdicionService: FinanciamientoEdicionService) {}

  ngOnInit() {
    this.generatePlanCuotas(this.montoEvaluar);
    this._financiamientoEdicionService.totalPedidoChange.subscribe(total => {
      this.generatePlanCuotas(total);
    });
  }

  generatePlanCuotas(montoEvaluar: number) {
    this._financiamientoEdicionService.tasaMensualFinanciamiento().subscribe(tasa => {
      const tasaMensual = parseFloat(tasa.toString());
      this.planCuotas = {
        cuota3: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 3, tasaMensual),
        cuota6: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 6, tasaMensual),
        cuota9: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 9, tasaMensual),
        cuota12: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 12, tasaMensual),
        cuota18: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 18, tasaMensual),
        cuota24: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 24, tasaMensual),
        cuota36: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 36, tasaMensual),
        cuota48: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 48, tasaMensual),
        cuota60: this._financiamientoEdicionService.calcularCuota(montoEvaluar, 60, tasaMensual)
      };
    });
  }
}
