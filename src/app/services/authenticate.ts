import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppConfig } from '../app.config';
import { EntityName } from '../entities/entity-name';
import { User } from '../entities/user/user';
import { IUserDep } from '../interfaces/i-user-dep';
import { LoginDepsService } from './login-deps-service';
import { NotificationService } from './notification-service';
import { ServiceProvider } from './service-provider';

export function authenticate(injector: Injector, user: string, pass: string): Observable<boolean> {
  return injector.get(HttpClient).post(`${ServiceProvider.getApiAddr(injector.get(AppConfig).config.host)}login`, { user, pass },
    { headers: ServiceProvider.getPostHeaders() })
    .pipe(
      switchMap((result: any) => {
        if (result.success) {
          localStorage.setItem('auth_token', result.token);
          localStorage.setItem('iduser', result.user.iduser);
          localStorage.setItem('idorg', result.user.idorg);
          localStorage.setItem('user_name', result.user.user_name);
        } else {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('iduser');
          localStorage.removeItem('idorg');
          localStorage.removeItem('user_name');
        }
        if (result.success) {
          return injector.get(ServiceProvider).getEntity<User>(result.user.iduser, EntityName.user)
            .pipe(
              map((userObj: User) => {
                injector.get(NotificationService).user.next(userObj);
                if (result.iduserdeps && result.iduserdeps.length) {
                  const userdeps = <IUserDep[]>result.iduserdeps;
                  injector.get(LoginDepsService).setDeps(userdeps);
                } else {
                  injector.get(LoginDepsService).setDeps([]);
                }
                return true;
              }));
        } else {
          return of(false);
        }
      })
    );
}
