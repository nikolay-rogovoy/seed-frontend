import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckSaveGuard } from '../../lib/check-save-guard';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Test'
    },
    children: [
      {
        path: 'test',
        component: TestComponent,
        data: {
          title: 'Certificate WO'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
