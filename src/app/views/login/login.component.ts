import { Component, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification-service';
import { Router, ActivatedRoute } from '@angular/router';
import { authenticate } from '../../services/authenticate';
import { AlertConfig } from 'ngx-bootstrap/alert';

export function getAlertConfig(): AlertConfig {
  return Object.assign(new AlertConfig(), { type: 'success' });
}

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styles: [
    `
  .alert-md-local {
    background-color: #009688;
    border-color: #00695C;
    color: #fff;
  }
  `
  ],
  providers: [{ provide: AlertConfig, useFactory: getAlertConfig }]

})
export class LoginComponent {

  loginForm = new FormGroup({
    login: new FormControl('', Validators.required),
    pass: new FormControl('', Validators.required),
  });

  errorMessage = null;

  constructor(
    public injector: Injector,
    public notificationService: NotificationService,
    public router: Router,
    public route: ActivatedRoute) {
  }

  showErrorMessage(errorMessage) {
    console.error(errorMessage);
    this.errorMessage = errorMessage;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      authenticate(this.injector, this.loginForm.value.login, this.loginForm.value.pass)
        .subscribe(
          {
            next: (response: boolean) => {
              if (response) {
                const url = this.route.snapshot.queryParams.url || '';
                const nextUrl = `/${url}`;
                this.router.navigate(['dashboard']);
              } else {
                this.showErrorMessage('Invalid password or username');
              }
            },
            error: (error) => {
              this.showErrorMessage('Invalid password or username');
            },
            complete: () => { }
          }
        );
    } else {
      this.showErrorMessage('You have not entered a username or password');
    }
  }
}
