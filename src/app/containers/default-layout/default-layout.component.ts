import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth-service';
import { MessageboxComponent } from '../../components/messagebox-module/messagebox-component/messagebox-component';
import { MessageboxParam } from '../../components/messagebox-module/messagebox-component/messagebox-param';
import { MessageboxService } from '../../components/messagebox-module/messagebox-service';
import { ModalContainerComponent } from '../../components/modal-container-module/modal-container-component/modal-container-component';
import { ModalContainerParam } from '../../components/modal-container-module/modal-container-param';
import { ModalContainerService } from '../../components/modal-container-module/modal-container-service';
import { User } from '../../entities/user/user';
import { IUserDep } from '../../interfaces/i-user-dep';
import { getCurrentRoute } from '../../lib/get-current-route';
import { NotificationService } from '../../services/notification-service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = [];

  $dep = this.notificationService.dep
    .pipe(
      map((userDep: IUserDep) => {
        return userDep.name;
      })
    );

  $user = this.notificationService.user
    .pipe(
      map((user: User) => {
        return user.name;
      })
    );

  @ViewChild('messageboxComponent') messageboxComponent: MessageboxComponent;
  @ViewChild('modalContainerComponent') modalContainerComponent: ModalContainerComponent;

  constructor(
    public authService: AuthService,
    public router: Router,
    public notificationService: NotificationService,
    public messageboxService: MessageboxService,
    public modalContainerService: ModalContainerService,
  ) {
    messageboxService.listner = (messageboxParam: MessageboxParam) => {
      return this.messageboxComponent.show(messageboxParam);
    }
    modalContainerService.listner = (modalContainerParam: ModalContainerParam<any>) => {
      return this.modalContainerComponent.show(modalContainerParam);
    }
  }

  ngOnInit() {
    this.notificationService.dep
      .pipe(
        map((userDep: IUserDep) => {
          if (userDep.posts.find(x => x.idpost == 1) != null) {
            this.navItems = navItems;
          } else if (userDep.posts.find(x => x.idpost == 2) != null) {
            this.navItems = navItems.filter(x => x.name === 'Approve');
          } else if (userDep.posts.find(x => x.idpost == 3) != null) {
            this.navItems = navItems.filter(x => x.name != null);
          }
          return userDep.name;
        })
      ).subscribe();
    // console.log('DefaultLayoutComponent');
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authService.clear();
    this.router.navigate(['/login']);
  }

  selectDep() {
    let url = getCurrentRoute();
    this.router.navigateByUrl(`/selectdep?url=${url}`);
  }
}
