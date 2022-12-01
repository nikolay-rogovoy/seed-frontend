import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';
import { Location } from '@angular/common';

/***/
export function ReactiveFormDecorator() {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {

      getChanged() {
        return this.formGroup.dirty || this.changed;
      }

      goBack(): void {
        this.injector.get(Location).back();
      }

      acceptChanges(): void {
        const { value: formValueSnap } = this.formGroup;
        this.formGroup.reset(formValueSnap);
        this.changed = false;
      }

    };
  };
}
