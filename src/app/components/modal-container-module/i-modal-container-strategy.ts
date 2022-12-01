import { ModalContainerComponent } from './modal-container-component/modal-container-component';

export interface IModalContainerStrategy<T> {
    /***/
    prepare(component: T, modalContainerComponent: ModalContainerComponent): void;
}
