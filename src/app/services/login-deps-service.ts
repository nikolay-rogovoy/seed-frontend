import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Dep } from '../entities/user/dep';
import { IUserDep } from '../interfaces/i-user-dep';

/***/
@Injectable()
export class LoginDepsService implements OnDestroy {

  /***/
  private depsBS: BehaviorSubject<IUserDep[]> = new BehaviorSubject<IUserDep[]>(null);

  /***/
  private unsubscribeAll: Subject<any> = new Subject();

  /***/
  deps: Observable<IUserDep[]> = this.depsBS.pipe(
    filter((deps: IUserDep[]) => {
      return deps != null;
    }),
    takeUntil(this.unsubscribeAll)
  );

  /***/
  setDeps(deps: IUserDep[]) {
    this.depsBS.next(deps);
  }

  /***/
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
