import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { MessageboxParam } from './messagebox-param';

@Component({
  selector: 'app-messagebox-component',
  templateUrl: './messagebox-component.html'
})
export class MessageboxComponent implements OnInit, OnDestroy {

  @ViewChild('modalContainer')
  modalContainer: ModalDirective;

  result = new BehaviorSubject(null);
  unsubscribe = new Subject();

  caption: string;
  text: string;
  showCancel: boolean;
  style: string;
  constructor() {
  }

  show(messageboxParam: MessageboxParam) {
    this.caption = messageboxParam.caption;
    this.text = messageboxParam.text;
    this.showCancel = messageboxParam.showCancel;
    this.style = messageboxParam.style;
    this.modalContainer.config = { ignoreBackdropClick: true };
    this.modalContainer.show();
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

  ok() {
    this.result.next(true);
    this.modalContainer.hide();
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
  }

  ngOnInit() {
  }

  getStyle() {
    switch (this.style) {
      case 'primary':
        return 'modal-primary';
      case 'success':
        return 'modal-success';
      case 'warning':
        return 'modal-warning';
      case 'danger':
        return 'modal-danger';
      case 'info':
        return 'modal-info';
      default:
        return 'modal-primary';
    }
  }
}
