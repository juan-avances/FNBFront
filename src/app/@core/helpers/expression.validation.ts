import { FormGroup } from '@angular/forms';

export enum ExpressionValidation {
  LetterSpace = '^(?!\\s*$)[-a-zA-ZáéíóúÁÉÍÓÚÑñ.\\s]{1,200}$',
  LetterSpaceNumber = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚ.\\s]{1,200}$',
  LetterNumber = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚ\u00f1\u00d1]{1,200}$',
  Ruc = '(\\d{11})',
  Dni = '(\\d{8})',
  NroC = '(\\d{6})',
  Telefono = '^[0-9]{7,9}$',
  Correo = '^[\\w-_.+]*[\\w-_.]@([\\w]+\\.)+[\\w]+[\\w]$',
  AddressStreet = '^[a-zA-Z0-9áéíóúÁÉÍÓÚ.?¿&%$\\.()\,\-\\s\u00f1\u00d1]{1,}$',
  Cpi = '(\\d{6,7})',
  Number = '^(?!\\s*$)[0-9./-]{1,200}$',
  PassWord = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
  CodigoEncuesta = '^(?!\\s*$)[-a-zA-Z0-9_-]{1,15}$',
  CodigoPregunta = '^(?!\\s*$)[-a-zA-Z0-9_-]{1,15}$',
  CodigoAlternativa = '^(?!\\s*$)[-a-zA-Z0-9_-]{1,15}$',
  NombrePregunta = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚÑñ.,-?¿%\\s]{1,200}$',
  NombreAlternativa = '^(?!\\s*$)[-a-zA-Z0-9áéíóúÁÉÍÓÚÑñ.,-?¿%\\s]{1,200}$',
  CodigoMotivo = '^(?!\\s*$)[-a-zA-Z0-9_-]{1,15}$',
  CodigoMaterial = '^(?!\\s*$)[-a-zA-Z0-9]{1,10}$',
  LetterNumberSign =  '^[a-zA-Z0-9áéíóúÁÉÍÓÚ.?¿&%$\,\-\\s\u00f1\u00d1]{1,}$'
}

export class CustomValidators {
  static dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const f = group.controls[from];
      const properties = to.split('.');
      let t: any = group;

      properties.forEach(p => {
        t = t.controls[p];
      });

      if (f.value != null && t.value != null && f.value.isAfter(t.value, 'day')) {
        return {
          dates: 'Fecha inválida.'
        };
      }
      return {};
    };
  }
}
