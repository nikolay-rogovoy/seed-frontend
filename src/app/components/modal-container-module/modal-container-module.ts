import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AdDirective } from './modal-container-component/ad.directive';
import { ModalContainerComponent } from './modal-container-component/modal-container-component';
import { ModalContainerService } from './modal-container-service';

@NgModule({

  imports: [
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
  ],

  exports: [
    ModalContainerComponent,
  ],

  declarations: [
    ModalContainerComponent,
    AdDirective,
  ],

  providers: [
    ModalContainerService,
  ],
})
export class ModalContainerModule { }
