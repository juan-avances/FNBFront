import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"
  ];


  transform(value: string): string {
    let parseDate = Date.parse(value);
    const date = new Date(parseDate);
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let msg = `Del ${this.LocalDay(firstDay.getUTCDate())} al ${this.LocalDay(lastDay.getUTCDate())} de ${this.monthNames[date.getMonth()]} del ${date.getFullYear()} `
    return msg;
  }

   private LocalDay(value:number):string | number{ 
    const numbers= [1,2,3,4,5,6,7,8,9];

    if(numbers.find(x=> x == value)) return `0${value}`;

    return value;
  }
}

