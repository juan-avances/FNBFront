import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcularCuotaService {
  constructor() {}

  setCuota(numeroCuotas: number, lineaCredito: number, totalCompra: number): number {
    const tasa = 0.0234056907962921;
    let montoFinanciado = lineaCredito;

    if (totalCompra < lineaCredito) {
      montoFinanciado = totalCompra;
    }

    let montoPago =
      (tasa * Math.pow(1 + tasa, numeroCuotas) * montoFinanciado) / (Math.pow(1 + tasa, numeroCuotas) - 1);
    montoPago = Math.round(montoPago * 100) / 100;

    return montoPago;
  }
}
