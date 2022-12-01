import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { SelectDepComponent } from './auth/select-dep-component/select-dep-component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { ServiceProvider } from './services/service-provider';
import { LoginDepsService } from './services/login-deps-service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth-guard';
import { AppConfig } from './app.config';
import { AuthService } from './auth/auth-service';
import { NotificationService } from './services/notification-service';
import { UnauthorizedAccessStrategy } from './services/unauthorized-access-strategy/unauthorized-access-strategy';
import { unauthorizedAccessStrategyInjectionToken } from './services/unauthorized-access-strategy/unauthorized-access-strategy-injection-token';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AtGridModule } from './components/at-grid/at-grid-module';
import { CheckSaveGuard } from './lib/check-save-guard';
import { MessageboxModule } from './components/messagebox-module/messagebox-module';
import { ModalContainerModule } from './components/modal-container-module/modal-container-module';
import { TemplateProviderModule } from './lib/template-provider-component/template-provider-module';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppAsideModule,
    AtGridModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    AlertModule.forRoot(),
    MessageboxModule,
    ModalContainerModule,
    TemplateProviderModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    SelectDepComponent,
  ],
  providers: [
    { provide: unauthorizedAccessStrategyInjectionToken, useClass: UnauthorizedAccessStrategy },
    AppConfig,
    {
        provide: APP_INITIALIZER,
        useFactory: initConfig,
        deps: [AppConfig],
        multi: true
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    AuthService,
    NotificationService,
    IconSetService,
    ServiceProvider,
    LoginDepsService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    CheckSaveGuard,
  ],
  bootstrap: [AppComponent],
  exports: [
  ]
})
export class AppModule { }

export function initConfig(config: AppConfig) {
  return () => config.load();
}
