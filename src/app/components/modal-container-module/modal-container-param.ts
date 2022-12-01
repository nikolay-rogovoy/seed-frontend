import { Type } from '@angular/core';
import { IModalContainerStrategy } from './i-modal-container-strategy';

export interface ModalContainerParam<T> {
  ctor: Type<T>;
  caption: string;
  style: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  modalContainerStrategy: IModalContainerStrategy<T>;
}
