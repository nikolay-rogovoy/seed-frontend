import { Type } from '@angular/core';
import { IEntity } from '../entities/i-entity';
import { EntityName } from '../entities/entity-name';
import { IListComponent } from './i-list-component';
import { ActivatedRoute, Router } from '@angular/router';

/***/
export function CreateDecorator<P extends IEntity>(entityName: EntityName) {
  /***/
  return function <T extends Type<IListComponent<P>>>(target: T) {
    /***/
    return class extends target {
      newItem() {
        this.injector.get(Router).navigate([`${entityName}/new`], { relativeTo: this.injector.get(ActivatedRoute).parent });
      }
    };
  };
}
