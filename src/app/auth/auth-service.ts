import {Injectable} from '@angular/core';
import { AdminLib } from '../lib/admin-lib';
import { NotificationService } from '../services/notification-service';

@Injectable()
export class AuthService {

    /**Конструктор*/
    constructor(public notificationService: NotificationService) {
    }

    /**Аутентетифицирован ли пользователь*/
    get authenticated(): boolean {
        if (localStorage.getItem('auth_token')) {
            return true;
        } else {
            return false;
        }
    }

    /**Аутентетифицирован ли пользователь*/
    get authenticatedAndSelectedCustomerDepartment(): boolean {
        return this.authenticated && AdminLib.checkSelectedDep();
    }

    /**Получить заголовко авторизации*/
    get authorizationHeader(): string {
        if (!this.authenticated) {
            throw new Error('Error getting authorization header, user not authorized!');
        }
        return `Bearer<${localStorage.getItem('auth_token')}>`;
    }

    /**Удалить авторизованый токен из источника данных*/
    clear() {
        // Информация о пользователе
        localStorage.removeItem('auth_token');
        localStorage.removeItem('iduser');
        localStorage.removeItem('idorg');
        localStorage.removeItem('user_name');
        // Информация о подразделении
        localStorage.removeItem('iddep');
        localStorage.removeItem('dep_name');
        // Пустой пользователь
        this.notificationService.user.next(null);
        // Пустое подразделение
        this.notificationService.dep.next(null);

    }
}
