import { NgModule } from '@angular/core';

import { AtGridComponent } from './at-grid';
import { SafeHtml } from './safe-html';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkDirective } from './mark-directive';

@NgModule({
  imports:
    [
      CommonModule, // Критические провайдеры, NgIf и NgFor
      FormsModule
    ],
  exports: [
    AtGridComponent,
    SafeHtml
  ],
  declarations: [
    AtGridComponent,
    SafeHtml,
    MarkDirective
  ]
})
export class AtGridModule { }
