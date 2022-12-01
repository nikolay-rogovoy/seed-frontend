import { Type } from '@angular/core';
import { ServiceProvider } from '../services/service-provider';
import { IEntity } from '../entities/i-entity';
import { EntityName } from '../entities/entity-name';
import { IListComponent } from './i-list-component';

/***/
export function LoadActiveListDecorator<P extends IEntity>(entityName: EntityName) {
  /***/
  return function <T extends Type<IListComponent<P>>>(target: T) {
    /***/
    return class extends target {
      onInit(): void {
        this.injector.get(ServiceProvider).getEntityList<P>(entityName)
          .subscribe(
            (positions) => {
              this.positions = positions.filter(x => x.active);
              super.onInit();
            }
          );
      }
    };
  };
}
