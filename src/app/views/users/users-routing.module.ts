import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckSaveGuard } from '../../lib/check-save-guard';
import { DepEditComponent } from './dep-edit/dep-edit.component';
import { DepsComponent } from './deps/deps.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Admin'
    },
    children: [
      {
        path: 'deps',
        component: DepsComponent,
        data: {
          title: 'Departments'
        }
      },
      {
        path: 'dep/:id',
        component: DepEditComponent,
        data: {
          title: 'Department'
        },
        canDeactivate: [CheckSaveGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
