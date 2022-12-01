import { EventEmitter } from '@angular/core';
import { IEntity } from '../entities/i-entity';
import { IListComponent } from './i-list-component';

/***/
export interface IListSelectComponent<T extends IEntity> extends IListComponent<T> {
  selection: EventEmitter<T>;
}
