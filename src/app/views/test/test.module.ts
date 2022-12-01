import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AtGridModule } from '../../components/at-grid/at-grid-module';
import { TemplateProviderModule } from '../../lib/template-provider-component/template-provider-module';
import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test/test.component';

@NgModule({
  imports: [
    CommonModule,
    TestRoutingModule,
    AtGridModule,
    ReactiveFormsModule,
    TemplateProviderModule,
  ],
  declarations: [
    TestComponent
  ],
  entryComponents: [
  ]
})
export class TestModule { }
