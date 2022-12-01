import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';

/***/
export function InvalidControlFormDecorator() {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {

      invalidControlClass(controlName: string) {
        return { 'is-invalid': this.formGroup.controls[controlName].invalid };
      }

    };
  };
}
