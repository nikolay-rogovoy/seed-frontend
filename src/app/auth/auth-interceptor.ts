import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';
import { ServiceProvider } from '../services/service-provider';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**Конструктор*/
  constructor(
    public auth: AuthService,
    public appConfig: AppConfig) {
  }

  /***/
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.appConfig && this.appConfig.config && this.appConfig.config.host) {
      let url = ServiceProvider.getApiAddr(this.appConfig.config.host);
      // Если пользователь авторизован
      if (this.auth.authenticated && req.url.startsWith(url)) {
        // Получить заголовок с токеном
        const authHeader = this.auth.authorizationHeader;
        // Клонировать запрос и добавить новый заголовок
        let authReq = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': authHeader
          }
        });
        // Передать клонированый запрос вместо оригинального
        return next.handle(authReq);
      } else {
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
  }
}
