
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function PassStrengthValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);

      const hasLowerCase = /[a-z]+/.test(value);

      const hasNumeric = /[0-9]+/.test(value);

      const hasFormat =  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasFormat;

      return !passwordValid ? {passwordStrength:true}: null;
  }
}
