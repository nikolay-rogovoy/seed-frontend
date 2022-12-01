import { Type } from '@angular/core';
import { IEntity } from '../entities/i-entity';
import { EntityName } from '../entities/entity-name';
import { IListComponent } from './i-list-component';
import { ActivatedRoute, Router } from '@angular/router';
import { getEntitiesMetadata } from '../entities/metadata/entity-metadata';

/***/
export function SelectRowDecorator<P extends IEntity>(entityName: EntityName) {
  /***/
  return function <T extends Type<IListComponent<P>>>(target: T) {
    /***/
    return class extends target {

      selectRow(entity: P) {
        let entitiesMetadata = getEntitiesMetadata().find(x => x.name === entityName);
        if (entitiesMetadata) {
          this.injector.get(Router).navigate([`${entityName}/${entity[entitiesMetadata.pkName]}`], { relativeTo: this.injector.get(ActivatedRoute).parent });
        } else {
          throw new Error(`Not found metadata for ${entityName}`);
        }
      }

    };
  };
}
