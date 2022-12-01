import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';
import { ServiceProvider } from '../services/service-provider';
import { EntityName } from '../entities/entity-name';
import { getEntitiesMetadata } from '../entities/metadata/entity-metadata';

/***/
export function DeleteFormDecorator(entityName: EntityName) {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {
      delete() {
        let entitiesMetadata = getEntitiesMetadata().find(x => x.name === entityName);
        if (entitiesMetadata) {
          const id = this.formGroup.value[entitiesMetadata.pkName];
          this.injector.get(ServiceProvider).deleteEntityById(id, entityName)
            .subscribe(() => {
              this.acceptChanges();
              this.goBack();
            });
        } else {
          throw new Error(`Not found metadata for ${entityName}`);
        }
      }
    };
  };
}
