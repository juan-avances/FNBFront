import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mensajePaginador'
})
export class MensajePaginadorPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const state = value;
    const totalRegistros = args;

    return `Se muestran ${Math.min((state.page + 1) * state.rows, totalRegistros)} de ${totalRegistros} registros`;
  }
}
