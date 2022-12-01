import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';

/***/
export function IsFormValueDecorator() {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {
      isValue(propertyName: string) {
        return this.formGroup.get(propertyName).value;
      }
    };
  };
}
