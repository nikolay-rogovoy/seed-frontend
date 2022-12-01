import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, pluck, switchMap } from 'rxjs/operators';
import { FailedDependency } from '../errors/failed-dependency';
import { IDependency } from '../interfaces/i-dependency';
import { AppConfig } from '../app.config';
import { IEntity } from '../entities/i-entity';
import { AccessDenied } from '../errors/access-denied';
import { NotFound } from '../errors/not-found';
import { IUnauthorizedAccessStrategy } from './unauthorized-access-strategy/i-unauthorized-access-strategy';
import { unauthorizedAccessStrategyInjectionToken } from './unauthorized-access-strategy/unauthorized-access-strategy-injection-token';
import { EntityName } from '../entities/entity-name';
import { getEntitiesMetadata, ColumnTypeMetadata } from '../entities/metadata/entity-metadata';

/**Базовый сервис*/
@Injectable()
export class ServiceProvider {

  /** Фильтр строки поиска */
  searchFilter = '';

  /***/
  static getPostHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    // headers.set('Authorization', 'my-auth-token');
    return headers;
  }

  /***/
  static getApiAddr(host: string): string {
    return `${host}/api/`;
  }

  /**Обработка ошибки извлечения данных*/
  handleError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      let errMsg: string;
      if (error.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        errMsg = `An error occurred: ${error.error.message}`;
        return throwError(new Error(errMsg));
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errMsg = `Backend returned code ${error.status}, body was: ${error.error && error.error.message ? error.error.message : error.error}`;
        if (error.status === 401) {
          return this.unauthorizedAccessStrategy.handle(error);
        } else if (error.status === 403) {
          return throwError(new AccessDenied(errMsg));
        } else if (error.status === 404) {
          return throwError(new NotFound(errMsg));
        } else {
          return throwError(new Error(errMsg));
        }
      }
    } else {
      return throwError(error);
    }
  }



  /***/
  constructor(public http: HttpClient,
    public appConfig: AppConfig,
    @Inject(unauthorizedAccessStrategyInjectionToken) public unauthorizedAccessStrategy: IUnauthorizedAccessStrategy) {
  }

  /**Удалить сущность*/
  checkDeleteEntity(entity: IEntity): Observable<FailedDependency> {
    const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + 'checkdelete/' + entity.entityName;
    return this.http.get(entityUrl + '/' + entity[entity.keyName])
      .pipe(
        mergeMap((data: any) => {
          if (data.message === 'Failed Dependency') {
            return of(new FailedDependency(<IDependency[]>data.result));
          } else {
            return of(null);
          }
        }),
        catchError((error) => this.handleError(error))
      );
  }

  /**Удалить сущность*/
  deleteEntityById(identity: number, entityName: EntityName): Observable<boolean> {
    const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName;
    return this.http.delete(entityUrl + '/' + identity)
      .pipe(
        map((data) => {
          return true;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 424 && error.error.result) {
            // Обрабатываем ошибку удаления из за зависимостей
            const failedDependency = new FailedDependency(<IDependency[]>error.error.result);
            return throwError(failedDependency);
          } else {
            return throwError(error);
          }
        }),
        catchError((error) => this.handleError(error))
      );
  }

  /**Удалить сущность*/
  deleteEntitys(entitys: IEntity[], entityName: EntityName): Observable<boolean> {
    if (entitys.length) {
      const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName + '/delete';
      // Массив ключей для удаления
      let entityMetadata = getEntitiesMetadata().find(x => x.name === entityName);
      if (entityMetadata == null) {
        throw new Error(`Not found metadata for ${entityName}`);
      }
      const deleteData = {
        data: entitys.map(x => x[entityMetadata.pkName])
      };
      return this.http.post(entityUrl, deleteData, { headers: ServiceProvider.getPostHeaders() })
        .pipe(map(() => {
          // Все удалилось
          return true;
        }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 424 && error.error.result) {
              // Обрабатываем ошибку удаления из за зависимостей
              const failedDependency = new FailedDependency(<IDependency[]>error.error.result);
              return throwError(failedDependency);
            } else {
              return throwError(error);
            }
          }),
          catchError((error) => this.handleError(error)),
          map((val: boolean) => {
            return val;
          })
        );
    } else {
      return of(true);
    }
  }

  /***/
  postEntityWithoutDepartment(entity: IEntity, entityName: EntityName): Observable<number> {
    return this.postEntity(entity, undefined, entityName);
  }

  /**Сохранить сущность*/
  postEntity(entity: IEntity, iddep: number, entityName: EntityName): Observable<number> {
    const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName + (iddep ? `/${iddep}` : ``);
    const saveData = {
      data: [entity]
    };
    // console.log('entityUrl:', entityUrl);
    // console.log('saveData:', saveData, JSON.stringify(saveData));
    return this.http.post(entityUrl, saveData,
      { headers: ServiceProvider.getPostHeaders() })
      .pipe(map((result: any) => {
        if (result.result && result.result.length && result.result.length === 1) {
          return result.result[0].key_value;
        } else {
          console.error('PostEntity method error, server response not correct:', result);
          throw new Error(`PostEntity method error, server response not correct: ${result}`);
        }
      }));
  }

  /**Сохранить сущность*/
  postEntitys(entitys: IEntity[], entityName: EntityName): Observable<number[]> {
    if (entitys.length) {
      const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName;
      const saveData = {
        data: entitys
      };
      // console.log('entityUrl:', entityUrl);
      // console.log('saveData:', saveData, JSON.stringify(saveData));
      return this.http.post(entityUrl, saveData,
        { headers: ServiceProvider.getPostHeaders() })
        .pipe(map((result: any) => {
          if (result.result && result.result.length && result.result.length === entitys.length) {
            return result.result.map(x => x.key_value);
          } else {
            console.error('postEntitys method error, server response not correct:', result);
            throw new Error(`postEntitys method error, server response not correct: ${result}`);
          }
        }));
    } else {
      return of([]);
    }
  }

  /**Сохранить сущность*/
  postRequest(entityUrl: string, data: any): Observable<any> {
    entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityUrl;
    const saveData = {
      data: [data]
    };
    return this.http.post(entityUrl, saveData,
      { headers: ServiceProvider.getPostHeaders() })
      .pipe(map((result: any) => {
        if (result.result) {
          return result.result;
        } else {
          console.error('PostRequest method error, server response not correct:', result);
          throw new Error(`PostRequest method error, server response not correct: ${result}`);
        }
      }));
  }

  /**Получить сущность*/
  getEntity<T extends IEntity>(identity: number, entityName: EntityName): Observable<T> {
    const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName + '/' + identity;
    return this.http.get(entityUrl)
      .pipe(
        map((data: any) => {
          return this.loadRawData(data.result.data[0], entityName);
        }),
        catchError((error) => this.handleError(error)),
        map((val: T) => val)
      );
  }

  /**Получить сущность*/
  getEntityForField<T extends IEntity>(fieldName: string, fieldValue: string, entityName: EntityName): Observable<T[]> {
    // null для REST
    if (!fieldValue) {
      fieldValue = 'null';
    }
    const entityUrl = `${ServiceProvider.getApiAddr(this.appConfig.config.host)}${entityName}/${fieldName}/${fieldValue}`;
    return this.http.get(entityUrl)
      .pipe(
        pluck('result'),
        pluck('data'),
        map((data: T[]) => {
          return data.map(x => this.loadRawData(x, entityName))
        }),
        catchError((error) => this.handleError(error)),
        map((val: T[]) => val)
      );
  }

  /**Получить сущность*/
  getEntityForFieldRange<T extends IEntity>(fieldName: string, fieldValueMin: string,
    fieldValueMax: string, entityName: EntityName): Observable<T[]> {

    // null для REST
    if (!fieldValueMin) {
      fieldValueMin = 'null';
    }
    if (!fieldValueMax) {
      fieldValueMax = 'null';
    }
    const entityUrl = `${ServiceProvider.getApiAddr(this.appConfig.config.host)}${entityName}/${fieldName}/${fieldValueMin}/${fieldValueMax}`;
    return this.http.get(entityUrl)
      .pipe(
        pluck('result'),
        pluck('data'),
        map((data: T[]) => {
          return data.map(x => this.loadRawData(x, entityName))
        }),
        catchError((error) => this.handleError(error)),
        map((val: T[]) => val)
      );
  }

  /**Получить список для родительской сущности*/
  getEntityListForParent<T extends IEntity>(parentName: string, identity: number, entityName: EntityName): Observable<T[]> {
    return this.getEntityForField<T>(`id${parentName}`, identity.toString(), entityName);
  }

  /**Получить список из фильтра*/
  getEntityListForFilter<T extends IEntity>(idfilter: number, entityName: EntityName): Observable<T[]> {
    const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName;
    return this.http.get(entityUrl + '/filter/' + this.getIdDep() + '/' + idfilter)
      .pipe(
        map((data: any) => <T[]>data.result.data),
        map((data: T[]) => {
          return data.map(x => this.loadRawData(x, entityName))
        }),
        catchError((error) => this.handleError(error)),
      );
  }


  /**Получить список из фильтра*/
  getEntityListForSearchFilter<T extends IEntity>(filter: string, entityName: EntityName): Observable<T[]> {
    const url = ServiceProvider.getApiAddr(this.appConfig.config.host) + `search_post`;
    return this.http.post(url + '/' + this.getIdDep(), { filter })
      .pipe(
        map((data: any) => data.result.data),
        map((data: T[]) => {
          return data.map(x => this.loadRawData(x, entityName))
        }),
        catchError((error) => this.handleError(error)),
        map((val: T[]) => val)
      );
  }

  /**Получить список из фильтра*/
  getEntityListForFilterParam<T extends IEntity>(idfilter: number, param: object, entityName: EntityName): Observable<T[]> {
    const entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityName;
    return this.http.post(entityUrl + '/filter/' + this.getIdDep() + '/' + idfilter, param)
      .pipe(
        map((data: T[]) => {
          return data.map(x => this.loadRawData(x, entityName))
        }),
        catchError((error) => this.handleError(error)),
        map((val: T[]) => val)
      );
  }

  /**Получить список*/
  public getEntityList<T extends IEntity>(entityName: EntityName): Observable<T[]> {
    return this.getEntityListUrl<T>(entityName)
      .pipe(
        map((entities: T[]) => {
          return entities.map(x => this.loadRawData(x, entityName));;
        })
      );
  }

  /**Получить список для URL*/
  getEntityListUrl<T extends IEntity>(entityUrl: string): Observable<T[]> {
    // Добавляем имя хоста
    entityUrl = ServiceProvider.getApiAddr(this.appConfig.config.host) + entityUrl;
    return this.http.get(entityUrl)
      .pipe(
        map((data: any) => {
          return data.result.data;
        }),
        catchError((error) => this.handleError(error)),
        map((val: T[]) => val)
      );
  }

  /***/
  getRawData<T>(path: string): Observable<T> {
    const url = ServiceProvider.getApiAddr(this.appConfig.config.host) + path;
    return this.http.get<T>(url);
  }

  /***/
  postRawData(path: string, body: any): Observable<Object> {
    const url = ServiceProvider.getApiAddr(this.appConfig.config.host) + path;
    return this.http.post(url, body)
      .pipe(
        catchError((error) => {
          return throwError(error.error);
        })
      );
  }

  /***/
  private getIdDep(): number {
    return +localStorage.getItem('iddep');
  }

  loadRawData(raw, entityName: EntityName) {
    let entityMetadata = getEntitiesMetadata().find(x => x.name === entityName);
    if (entityMetadata) {
      for (let dateColumn of entityMetadata.columns.filter(x => x.type === ColumnTypeMetadata.date)) {
        if (raw[dateColumn.name]) {
          raw[dateColumn.name] = new Date(raw[dateColumn.name]);
        }
      }
    }
    return raw;
  }
}
