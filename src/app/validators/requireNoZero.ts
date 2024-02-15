import { AbstractControl, ValidationErrors } from '@angular/forms';  


export function RequireNoZero(control: AbstractControl) {
    const valor: string = (control.value as string);
    if(valor == '0'){  
        return { requiredNoEmpty: true}  
    }  

    return null;  
}
