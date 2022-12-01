import { Injectable } from '@angular/core';
import { IDependency } from '../interfaces/i-dependency';
import { ServiceProvider } from './service-provider';
import { filter, map, mergeMap, reduce, skip, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { User } from '../entities/user/user';
import { Dep } from '../entities/user/dep';
import { IBPMetadata } from '../b-p-metadata/i-b-p-metadata';
import { INavigateItem } from '../interfaces/i-navigate-item';
import { IUserDep } from '../interfaces/i-user-dep';

/***/
@Injectable()
export class NotificationService {

  /**Лог роутинга*/
  log = new Array<INavigateItem>();

  /***/
  private _userLogined: BehaviorSubject<boolean> = new BehaviorSubject(null);

  /***/
  userLogined = this._userLogined.pipe(
    filter(x => x != null)
  );

  /**Ошибки зависимостей*/
  failedDependency = new BehaviorSubject<IDependency[]>([]);

  /**Ключи бузинес процесса :)*/
  bPMetadataBehaviorSubject = new BehaviorSubject<IBPMetadata>(null);

  /***/
  loadedMetadata = false;

  /**Текущий пользователь*/
  user = new BehaviorSubject<User>(null);

  /**Подразделение текущее*/
  dep = new BehaviorSubject<IUserDep>(null);

  /**Процесс аутентификации пользователем*/
  authProcess = new BehaviorSubject<boolean>(null);

  /***/
  private _routeChanged = new BehaviorSubject<RouterEvent>(null);

  /**Права на объекты без инициализационного значения*/
  get bPMetadata(): Observable<IBPMetadata> {
    return this.bPMetadataBehaviorSubject
      .pipe(filter(x => x != null));
  }

  /***/
  get authProcessObservable(): Observable<boolean> {
    return this.authProcess
      .pipe(filter(x => x != null));
  }

  /***/
  constructor(public service: ServiceProvider,
    public router: Router
  ) {
    // Изменение подразделение - переинициализировать матрицу прав
    this.dep
      .pipe(
        switchMap((dep: IUserDep) => {
          // При выпоре подразделения загружаем его матрицу прав
          if (dep == null) {
            return of([]);
          } else {
            return of([]);
          }
        })
      )
      .subscribe(() => {
      });

    // После изменения матрицы прав уведомляем о процессе аутентификации
    this.dep
      .pipe(
        skip(1), // Пропускаем инициализационное значение - нет прав
        switchMap(() => {
          return of(true);
        })
      )
      .subscribe(this.authProcess);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(this._routeChanged);
  }

  /**Получить метаданные из базы*/
  loadMetaData(): Observable<IBPMetadata> {
    return this.service.getRawData('bp_mt')
      .pipe(
        map((data: any) => <IBPMetadata>data.result.data),
        map((metadata: IBPMetadata) => {
          if (metadata) {
            return metadata;
          } else {
            throw new Error('metadata is undefined!');
          }
        }),
        map((metadata: IBPMetadata) => {
          this.loadedMetadata = true;
          this.bPMetadataBehaviorSubject.next(metadata);
          return metadata;
        })
      );
  }

  /***/
  checkLoadMetaData(): Observable<IBPMetadata> {
    if (this.loadedMetadata) {
      return this.bPMetadata;
    } else {
      return this.loadMetaData();
    }
  }

  /**Получить предыдущий урл*/
  getPrevUrl(): string {
    if (this.log.length === 1) {
      this.log.pop();
      return '/dashboard';
    } else if (this.log.length === 0) {
      return '/dashboard';
    } else {
      // Удалить текущий роут
      this.log.pop();
      let prevUrl = this.log[this.log.length - 1].url;
      // Вернуть предыдущий роут
      return decodeURI(prevUrl);
    }
  }

  /***/
  addRouteComponent(routeParamObservable: Observable<{ route: string, caption: string }>, fromTab?: boolean): void {
    routeParamObservable
      .subscribe((routeParam) => {
        if (fromTab) {
          if (this.log.length > 0) {
            this.log.pop();
          }
        }
        let item = this.log.find(_ => _.url === routeParam.route);
        if (item) {
          let idx = this.log.indexOf(item);
          if (idx > -1) {
            this.log = this.log.slice(0, idx + 1);
          }
        } else {
          this.log.push({ url: routeParam.route, caption: routeParam.caption });
          if (this.log.length > 5) {
            this.log.shift();
          }
        }
      });
  }

  /***/
  addRouteComponentTab(routeParamObservable: Observable<{ route: string, caption: string }>): void {
    this.addRouteComponent(routeParamObservable, true);
  }
}
