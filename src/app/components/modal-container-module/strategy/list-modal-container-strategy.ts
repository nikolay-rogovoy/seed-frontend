import { IEntity } from '../../../entities/i-entity';
import { IListSelectComponent } from '../../../lib/i-list-select-component';
import { IModalContainerStrategy } from '../i-modal-container-strategy';
import { ModalContainerComponent } from '../modal-container-component/modal-container-component';

/***/
export class ListModalContainerStrategy<T, P extends IEntity> implements IModalContainerStrategy<IListSelectComponent<T>> {

  /***/
  constructor() {
  }

  /***/
  prepare(component: IListSelectComponent<T>, modalContainerComponent: ModalContainerComponent) {
    component.selection.subscribe((entity: P) => {
      modalContainerComponent.ok(entity);
    });
  }
}
