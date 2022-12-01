import { IReactiveForm } from './i-reactive-form';
import { Type } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ServiceProvider } from '../services/service-provider';
import { ColumnTypeMetadata, getEntitiesMetadata } from '../entities/metadata/entity-metadata';
import { IEntity } from '../entities/i-entity';
import { EntityName } from '../entities/entity-name';
import { CommonLib } from './common-lib';

/***/
export function LoadFormDecorator<T extends IEntity>(entityName: EntityName, creator: () => Observable<T>) {

  /***/
  return function <T extends Type<IReactiveForm>>(target: T) {
    /***/
    return class extends target {
      onInit() {
        this.injector.get(ActivatedRoute).paramMap.pipe(
          switchMap(params => {
            if (params.get('id') === 'new') {
              return creator();
            } else {
              const id = Number(params.get('id'));
              return this.injector.get(ServiceProvider).getEntity<T>(id, entityName);
            }
          })
        ).subscribe((entity) => {
          let patchValue = <any>{ ...entity };
          let entityMetadata = getEntitiesMetadata().find(x => x.name === entityName);
          if (entityMetadata) {
            for (let dateColumn of entityMetadata.columns.filter(x => x.type === ColumnTypeMetadata.date)) {
              if (entity[dateColumn.name]) {
                patchValue[dateColumn.name] = CommonLib.formatDate(entity[dateColumn.name]);
              }
            }
          }
          this.formGroup.patchValue(patchValue);
          super.onInit();
        });
      }
    };
  };
}
