import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

/***/
@Injectable()
export class GrantGuard implements CanActivate {

  /***/
  constructor() {
  }

  /***/
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return of(true);
  }
}
