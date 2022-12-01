import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ServiceProvider } from '../services/service-provider';
import { ColumnTypeMetadata, getEntitiesMetadata } from '../entities/metadata/entity-metadata';
import { EntityName } from '../entities/entity-name';
import { NotificationService } from '../services/notification-service';
import { IUserDep } from '../interfaces/i-user-dep';

/***/
export function SubmitFormDecorator(entityName: EntityName) {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {
      onSubmit() {
        if (this.formGroup.valid) {
          this.injector.get(NotificationService).dep.pipe(
            switchMap((dep: IUserDep) => {
              const value = { ...this.formGroup.getRawValue() };
              const entitiesMetadata = getEntitiesMetadata().find(x => x.name === entityName);
              if (entitiesMetadata) {
                if (value[entitiesMetadata.pkName] === null) {
                  delete value[entitiesMetadata.pkName];
                }
              } else {
                throw new Error(`Not found metadata for ${entityName}`);
              }
              return this.injector.get(ServiceProvider).postEntity(value, dep.iddep, entityName);
            })
          ).subscribe(() => {
            this.acceptChanges();
            this.goBack();
          });
        }
      }
    };
  };
}
