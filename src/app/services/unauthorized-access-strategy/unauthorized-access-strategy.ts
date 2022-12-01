import { Injectable, Injector } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { IUnauthorizedAccessStrategy } from './i-unauthorized-access-strategy';
import { Router } from '@angular/router';
import { UnauthorizedAccess } from '../../errors/unauthorized-access';
import { AuthService } from '../../auth/auth-service';
import { NotificationService } from '../notification-service';

@Injectable()
export class UnauthorizedAccessStrategy implements IUnauthorizedAccessStrategy {
  /***/
  constructor(public injector: Injector) { }
  /***/
  handle(error: any): Observable<never> {
    this.injector.get(Router).navigateByUrl('login');
    logOut(this.injector.get(AuthService), this.injector.get(Router), this.injector.get(NotificationService));
    return throwError(new UnauthorizedAccess('UnauthorizedAccess'));
  }
}

/***/
export function logOut(auth: AuthService, router: Router, notificationService: NotificationService) {
  auth.clear();
  notificationService.bPMetadataBehaviorSubject.next(null);
  notificationService.loadedMetadata = false;
  router.navigate(['/login']);
}
