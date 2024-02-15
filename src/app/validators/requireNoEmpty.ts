import { AbstractControl, ValidationErrors } from '@angular/forms';  


export function RequireNoEmpty(control: AbstractControl) {
    const valor: string = (control.value as string);    
    if((control.value as string).trim().length === 0){  
        return { requiredNoEmpty: true}  
    }  

    return null;  
}
