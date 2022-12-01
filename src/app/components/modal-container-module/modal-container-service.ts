import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalContainerParam } from './modal-container-param';

@Injectable()
export class ModalContainerService {
  listner: (modalContainerParam: ModalContainerParam<any>) => Observable<any>;
  show(modalContainerParam: ModalContainerParam<any>) {
    if (this.listner) {
      return this.listner(modalContainerParam);
    }
  }
}
