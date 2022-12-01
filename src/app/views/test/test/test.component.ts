import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ColumnFormat, ColumnInfo } from '../../../components/at-grid/column-info';
import { FilterInfo } from '../../../components/at-grid/filter-info';
import { CancelFormDecorator } from '../../../lib/cancel-form-decorator';
import { IListComponent } from '../../../lib/i-list-component';
import { IReactiveForm } from '../../../lib/i-reactive-form';
import { InvalidControlFormDecorator } from '../../../lib/invalid-control-form-decorator';
import { LifecycleComponent } from '../../../lib/lifecycle-component';
import { ReactiveFormDecorator } from '../../../lib/reactive-form-decorator';
import { TemplateProviderComponent } from '../../../lib/template-provider-component/template-provider-component';
import { IUserDep } from '../../../interfaces/i-user-dep';
@Component({
  templateUrl: 'test.component.html'
})
@ReactiveFormDecorator()
@CancelFormDecorator()
@InvalidControlFormDecorator()
export class TestComponent extends LifecycleComponent implements IListComponent<any>, OnInit, IReactiveForm {

  formGroup = new FormGroup({
  });

  changed = false;

  constructor(public injector: Injector) {
    super();
  }

  /***/
  @ViewChild(TemplateProviderComponent, { static: true })
  templateProvider: TemplateProviderComponent;

  positions: any[] = [];

  gridMetaData: ColumnInfo[] = [
    new ColumnInfo('order_num', 'Order', true, new FilterInfo(''), ColumnFormat.Default, false),
  ];

  /***/
  getAction(position: any, dep: IUserDep) {
  }

  newItem() {
    throw new Error('Not implemented');
  }
  selectRow(entity) {
  }
  onInit(): void {
    this.positions = [];
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
  }
  invalidControlClass(controlName: string) {
    throw new Error('Not implemented');
  }

}