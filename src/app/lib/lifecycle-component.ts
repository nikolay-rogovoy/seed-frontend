import { Component, OnDestroy, OnInit } from '@angular/core';

/***/
@Component({
  template: ''
})
export class LifecycleComponent implements OnInit, OnDestroy, ILifecycleComponent {
  /***/
  onInit() {
  }
  /***/
  onDestroy() {
  }
  /***/
  ngOnInit() {
    this.onInit();
  }
  /***/
  ngOnDestroy() {
    this.onDestroy();
  }
}
export interface ILifecycleComponent {
  onInit(): void;
  onDestroy(): void;
}
