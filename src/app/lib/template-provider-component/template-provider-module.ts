import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AtGridModule } from '../../components/at-grid/at-grid-module';
import { TemplateProviderComponent } from './template-provider-component';

@NgModule({
  imports: [
    CommonModule,
    AtGridModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TemplateProviderComponent,
  ],
  entryComponents: [
    TemplateProviderComponent
  ],
  exports: [
    TemplateProviderComponent
  ]
})
export class TemplateProviderModule { }
