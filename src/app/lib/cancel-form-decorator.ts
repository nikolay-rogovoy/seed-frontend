import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';
import { Location } from '@angular/common';

/***/
export function CancelFormDecorator() {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {
      cancel() {
        this.acceptChanges();
        this.injector.get(Location).back();
      }
    };
  };
}
