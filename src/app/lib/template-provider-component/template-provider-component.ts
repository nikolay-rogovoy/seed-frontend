import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'template-provider-component',
  templateUrl: 'template-provider-component.html'
})
export class TemplateProviderComponent {

  /***/
  @ViewChild('badges', { static: true })
  badges: TemplateRef<any>;

  /***/
  @ViewChild('gridButtons')
  gridButtons: TemplateRef<any>;

  /***/
  dataTest: any;

  /***/
  constructor() {
  }

  /***/
  log(data: any) {
    console.log(data);
    return 'ok';
  }

  /***/
  clickTest(item: any) {
    console.log(item);
  }

  /***/
  getContext() {
    return this.dataTest;
  }
}
