import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

/***/
export function ExistsEntityFormDecorator() {
  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {
      isExistsEntity() {
        return this.injector.get(ActivatedRoute).paramMap.pipe(
          map(params => {
            return params.get('id') !== 'new';
          })
        );
      }
    };
  };
}
