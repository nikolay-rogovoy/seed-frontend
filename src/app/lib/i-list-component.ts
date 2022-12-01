import { Injector, OnInit } from '@angular/core';
import { IEntity } from '../entities/i-entity';
import { ILifecycleComponent } from './lifecycle-component';

/***/
export interface IListComponent<T extends IEntity> extends ILifecycleComponent {
    positions: T[];
    injector: Injector;
}
