import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { ModalContainerParam } from '../modal-container-param';
import { AdDirective } from './ad.directive';

@Component({
  selector: 'app-modal-container-component',
  templateUrl: './modal-container-component.html'
})
export class ModalContainerComponent implements OnInit, OnDestroy {

  @ViewChild('modalContainer')
  public modalContainer: ModalDirective;

  @ViewChild(AdDirective)
  adHost: AdDirective;

  caption = ''

  result = new BehaviorSubject(null);
  unsubscribe = new Subject();

  constructor(public componentFactoryResolver: ComponentFactoryResolver) {
  }

  show(modalContainerParam: ModalContainerParam<any>) {
    this.caption = modalContainerParam.caption;
    this.modalContainer.config = { ignoreBackdropClick: true };
    this.modalContainer.show();
    this.loadComponent(modalContainerParam);
    this.result = new BehaviorSubject(null);
    return this.result
      .pipe(
        takeUntil(this.unsubscribe),
        filter(x => x != null),
        first(),
      );
  }

  cancel() {
    this.result.next(false);
    this.modalContainer.hide();
  }

  ok(value) {
    this.result.next(value);
    this.modalContainer.hide();
  }

  ngOnInit() {
  }

  loadComponent<T>(modalContainerParam: ModalContainerParam<T>): T {

    // Фабрика компонента
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(modalContainerParam.ctor);

    // Контейнер для присоединения видов (туда ложим компонент)
    let viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    // Создаем компонент в контейнере
    let componentRef = viewContainerRef.createComponent(componentFactory);
    modalContainerParam.modalContainerStrategy.prepare(componentRef.instance, this);

    return <T>componentRef.instance;

  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
  }
}
