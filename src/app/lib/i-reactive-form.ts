import { Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ILifecycleComponent } from './lifecycle-component';

/***/
export interface IReactiveForm extends ILifecycleComponent {
  changed: boolean;
  formGroup: FormGroup;
  injector: Injector;
  acceptChanges(): void;
  goBack(): void;
  getChanged(): boolean;
}
