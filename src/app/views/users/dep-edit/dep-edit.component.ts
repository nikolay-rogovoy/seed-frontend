import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityName } from '../../../entities/entity-name';
import { ReactiveFormDecorator } from '../../../lib/reactive-form-decorator';
import { IReactiveForm } from '../../../lib/i-reactive-form';
import { of } from 'rxjs';
import { LoadFormDecorator } from '../../../lib/load-form-decorator';
import { SubmitFormDecorator } from '../../../lib/submit-form-decorator';
import { DeleteFormDecorator } from '../../../lib/delete-form-decorator';
import { ExistsEntityFormDecorator } from '../../../lib/exists-entity-form-decorator';
import { CancelFormDecorator } from '../../../lib/cancel-form-decorator';
import { InvalidControlFormDecorator } from '../../../lib/invalid-control-form-decorator';
import { LifecycleComponent } from '../../../lib/lifecycle-component';

@Component({
  templateUrl: 'dep-edit.component.html'
})
@ReactiveFormDecorator()
@LoadFormDecorator(EntityName.dep, () => of({ iddep: null, dtcre: new Date(), active: true }))
@SubmitFormDecorator(EntityName.dep)
@DeleteFormDecorator(EntityName.dep)
@ExistsEntityFormDecorator()
@CancelFormDecorator()
@InvalidControlFormDecorator()
export class DepEditComponent extends LifecycleComponent implements IReactiveForm, OnInit {

  formGroup = new FormGroup({
    iddep: new FormControl(''),
    name: new FormControl('', Validators.required),
    comment: new FormControl(''),
    active: new FormControl(''),
    dtcre: new FormControl({ value: '', disabled: true }),
  });

  changed = false;

  constructor(public injector: Injector) {
    super();
  }

  acceptChanges(): void {
    throw new Error('Not implemented');
  }
  goBack(): void {
    throw new Error('Not implemented');
  }
  getChanged(): boolean {
    throw new Error('Not implemented');
  }

  cancel() {
    throw new Error(`Not implemented`);
  }
  onSubmit() {
    throw new Error(`Not implemented`);
  }
  invalidControlClass(controlName: string) {
    throw new Error('Not implemented');
  }
  isExistsEntity() {
    throw new Error('Not implemented');
  }
}
