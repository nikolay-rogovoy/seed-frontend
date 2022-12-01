import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AtGridModule } from '../../components/at-grid/at-grid-module';
import { TemplateProviderModule } from '../../lib/template-provider-component/template-provider-module';
import { DepEditComponent } from './dep-edit/dep-edit.component';
import { DepsSelectComponent } from './deps-select/deps-select.component';
import { DepsComponent } from './deps/deps.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    AtGridModule,
    ReactiveFormsModule,
    TemplateProviderModule,
  ],
  declarations: [
    DepsComponent,
    DepEditComponent,
    DepsSelectComponent,
  ],
  entryComponents: [
    DepsSelectComponent,
  ]
})
export class UsersModule { }
