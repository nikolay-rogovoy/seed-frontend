import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service';
import { first, map, mapTo, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../app.config';
import { NotificationService } from '../services/notification-service';
import { ServiceProvider } from '../services/service-provider';
import { User } from '../entities/user/user';
import { EntityName } from '../entities/entity-name';
import { AdminLib } from '../lib/admin-lib';
import { LoginDepsService } from '../services/login-deps-service';
import { IUserDep } from '../interfaces/i-user-dep';
import { authenticate } from '../services/authenticate';

/***/
@Injectable()
export class AuthGuard implements CanActivate {

  /***/
  constructor(public http: HttpClient,
    public appConfig: AppConfig,
    private router: Router,
    private auth: AuthService,
    public injector: Injector
  ) {
  }

  /***/
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    if (!this.auth.authenticated) {
      this.router.navigateByUrl(`/login?url=${state.url}`);
    } else {
      // Генерим оповещение о входе пользователя
      return this.injector.get(NotificationService).user
        .pipe(
          first(),
          switchMap((user: User) => {
            if (user) {
              return of(user);
            } else {
              // Роутинг оповестил что кустомер залогинен
              return this.injector.get(ServiceProvider).getEntity(AdminLib.getMyUser().iduser, EntityName.user)
                .pipe(
                  map((userFromLocalStorage: User) => {
                    this.injector.get(NotificationService).user.next(userFromLocalStorage);
                    return userFromLocalStorage;
                  }),
                  switchMap((userFromLocalStorage: User) => {
                    return authenticate(this.injector, userFromLocalStorage.login, userFromLocalStorage.pass);
                  }),
                );
            }
          }),
          switchMap((user: User) => {
            return this.injector.get(NotificationService).checkLoadMetaData();
          }),
          switchMap(() => {
            return this.checkDep(route, state);
          }),
        );
    }
  }

  /***/
  checkDep(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (route.url.join('').includes('selectdep')) {
      // Можно переходить, выбираем подразделение
      return of(true);
    } else {
      // Подразделение не выбрано, нужно выбрать
      if (!AdminLib.checkSelectedDep()) {
        return this.injector.get(LoginDepsService).deps
          .pipe(
            switchMap((deps: IUserDep[]) => {
              if (deps.length === 1) {
                this.injector.get(NotificationService).dep.next(deps[0]);
                // Перешли по роуту
                return of(true);
              } else {
                // Пользователю нужно выбрать подразделение в котором он сидит
                this.router.navigateByUrl(`/selectdep?url=${state.url}`);
                return of(false);
              }
            })
          );
      } else {
        // Подразделение выбрано, оповестить о том что подразделение выбрано
        return this.injector.get(NotificationService).dep
          .pipe(
            first(),
            switchMap((dep: IUserDep) => {
              if (dep) {
                return of(dep);
              } else {
                return this.injector.get(LoginDepsService).deps
                  .pipe(
                    switchMap((deps: IUserDep[]) => {
                      const selectedDep = deps.find(x => x.iddep === AdminLib.getDep().iddep);
                      if (selectedDep) {
                        this.injector.get(NotificationService).dep.next(selectedDep);
                        return of(selectedDep);
                      } else {
                        // Пользователю нужно выбрать подразделение в котором он сидит
                        this.router.navigateByUrl(`/selectdep?url=${state.url}`);
                        return of(false);
                      }
                    })
                  );
              }
            }
            ),
            map(() => true));
      }
    }
  }
}
