import { User } from '../entities/user/user';
import { Dep } from '../entities/user/dep';
import { IUserDep } from '../interfaces/i-user-dep';

/**Библиотека с зависимостями от сущностей*/
export class AdminLib {

  /**Получить своего сотрудника*/
  static getMyUser(): User {
    let user = <User>{
      iduser: +localStorage.getItem('iduser'),
      idorg: +localStorage.getItem('idorg'),
      name: localStorage.getItem('user_name'),
    };
    return user;
  }

  /***/
  static checkSelectedDep() {
    return localStorage.getItem('iddep') != null;
  }

  /**Получить текущее поразделение*/
  static getDep(): Dep {
    let dep = <Dep>{
      iddep: +localStorage.getItem('iddep'),
      idorg: +localStorage.getItem('idorg'),
      name: localStorage.getItem('dep_name'),
    };
    return dep;
  }

  /**Сохранить текущее подразделение пользователя*/
  static saveDep(dep: IUserDep) {
    localStorage.setItem('iddep', dep.iddep.toString());
    localStorage.setItem('dep_name', dep.name);
  }

  /***/
  static clearDep() {
    localStorage.removeItem('iddep');
    localStorage.removeItem('dep_name');
  }
}
