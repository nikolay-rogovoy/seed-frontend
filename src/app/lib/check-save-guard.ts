import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageboxService } from '../components/messagebox-module/messagebox-service';
import { IReactiveForm } from './i-reactive-form';

/***/
@Injectable()
export class CheckSaveGuard implements CanDeactivate<IReactiveForm> {

  /***/
  constructor(public messageboxService: MessageboxService) {
  }

  /***/
  canDeactivate(component: IReactiveForm,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean> {
    return this.checkSave(component);
  }

  /***/
  checkSave(component: IReactiveForm) {
    if (component.getChanged()) {
      return this.messageboxService.show({ caption: 'Warning!', text: 'Unsaved change found.', showCancel: false, style: 'warning' })
        .pipe(
          map(() => false)
        );
    } else {
      // Нет изменений можно переходить
      return of(true);
    }
  }
}
