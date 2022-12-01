import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


/**Конфиг приложения*/
@Injectable()
export class AppConfig {

    /**Конфиг*/
    public config: IConfig = null;

    /**Конфиг*/
    configSubject: Subject<IConfig> = new Subject();

    /**Конфигурация окружения*/
    private env: {
        env: string
    } = null;

    /**Конструктор*/
    constructor(private http: HttpClient) {
    }

    /**Загрузить конфигурацию окружения, потом загрузить сам конфиг*/
    public load() {
        return new Promise((resolve, reject) => {
            // Загрузить конфигурацию окружения
            this.http.get('assets/env.json')
                .pipe(catchError((error: any): any => {
                    console.error('The configuration file "env.json" cannot be read');
                    resolve(true);
                    return throwError(error || 'Server error');
                }))
                .subscribe((envResponse) => {

                    // Сохраняем конфиг окружения
                    this.env = envResponse as { env: string };
                    let request: Observable<Object> = null;

                    // Анализируем тип конфига
                    if (this.env.env === 'production') {
                        request = this.http.get(`assets/config.${this.env.env}.json`);
                    } else if (this.env.env === 'development') {
                        request = this.http.get(`assets/config.${this.env.env}.json`);
                    } else {
                        console.error('The environment file is not configured correctly');
                        resolve(true);
                    }

                    // Загружаем нужный конфиг
                    if (request != null) {
                        request
                            .pipe(catchError((error: any) => {
                                console.error(`Error reading configuration file: ${this.env.env}`);
                                return throwError(error || 'Server error');
                            }))
                            .subscribe((responseData) => {
                                this.config = <IConfig>responseData;
                                this.configSubject.next(this.config);
                                console.log(`Configuration loaded ${this.env.env}`);
                                resolve(true);
                            });
                    } else {
                        console.error('Env config file "env.json" is not valid');
                    }
                });
        });
    }
}

/***/
export interface IConfig {
    /***/
    host: string;
}
