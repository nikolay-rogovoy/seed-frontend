import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MessageboxComponent } from './messagebox-component/messagebox-component';
import { MessageboxService } from './messagebox-service';


@NgModule({

  imports: [
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],

  exports: [
    MessageboxComponent,
  ],

  declarations: [
    MessageboxComponent,
  ],

  providers: [
    MessageboxService,
  ],
})
export class MessageboxModule { }
