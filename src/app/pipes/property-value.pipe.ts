import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'propertyValue'
})
export class PropertyValuePipe implements PipeTransform {
  transform(value: any, name: string): any {
    if (Array.isArray(value) || !(value instanceof Object) || !name) {
      return value;
    } else if (name.indexOf('.') > -1) {
      const valorProperty = name.split('.').reduce((a, b) => a[b], value);
      return valorProperty;
    } else {
      return value[name];
    }
  }
}
