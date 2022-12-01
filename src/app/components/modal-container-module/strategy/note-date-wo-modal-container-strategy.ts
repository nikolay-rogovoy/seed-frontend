import { NoteDateWoComponent } from '../../../views/cmms/note-date-wo/note-date-wo.component';
import { IModalContainerStrategy } from '../i-modal-container-strategy';
import { ModalContainerComponent } from '../modal-container-component/modal-container-component';

/***/
export class NoteDateWoModalContainerStrategy implements IModalContainerStrategy<NoteDateWoComponent> {

  /***/
  constructor(private text: string, private dt: Date) {
  }

  /***/
  prepare(component: NoteDateWoComponent, modalContainerComponent: ModalContainerComponent) {
    component.param = { text: this.text, dt: this.dt };
    component.submit.subscribe((result: { text: string, dt: Date }) => {
      modalContainerComponent.ok(result);
    });
  }
}
