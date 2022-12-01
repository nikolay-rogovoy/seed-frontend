import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth-guard';
import { SelectDepComponent } from './auth/select-dep-component/select-dep-component';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { TemplateProviderComponent } from './lib/template-provider-component/template-provider-component';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: '404', component: P404Component, data: { title: 'Page 404' } },
  { path: '500', component: P500Component, data: { title: 'Page 500' } },
  { path: 'login', component: LoginComponent, data: { title: 'Login Page' } },

  { path: 'register', component: RegisterComponent, data: { title: 'Register Page' } },
  { path: 'selectdep', component: SelectDepComponent, canActivate: [AuthGuard] },
  { path: 'templateprovider', component: TemplateProviderComponent, canActivate: [AuthGuard] },
  {
    path: '', component: DefaultLayoutComponent, data: { title: 'Home' },
    children: [
      { path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'admin', loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule) },
      { path: 'test', loadChildren: () => import('./views/test/test.module').then(m => m.TestModule) },
    ],
    canActivate: [AuthGuard]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
