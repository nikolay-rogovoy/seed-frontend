import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnFormat, ColumnInfo } from '../../components/at-grid/column-info';
import { FilterInfo } from '../../components/at-grid/filter-info';
import { IUserDep } from '../../interfaces/i-user-dep';
import { AdminLib } from '../../lib/admin-lib';
import { TemplateProviderComponent } from '../../lib/template-provider-component/template-provider-component';
import { LoginDepsService } from '../../services/login-deps-service';
import { NotificationService } from '../../services/notification-service';

@Component({
  moduleId: module.id,
  selector: 'app-select-dep-component',
  templateUrl: 'select-dep-component.html'
})
export class SelectDepComponent implements OnInit {

  positions = [];

  gridMetaData: ColumnInfo[] = [
    new ColumnInfo('name', 'Department', true, new FilterInfo(''), ColumnFormat.Default, false),
    new ColumnInfo('comment', 'Comment', true, new FilterInfo(''), ColumnFormat.Default, false),
    new ColumnInfo('posts_template', 'Roles', true, new FilterInfo(''), ColumnFormat.Template, false),
  ];

  headerText = '';

  @ViewChild(TemplateProviderComponent, { static: true })
  templateProvider: TemplateProviderComponent;

  /**Конструктор*/
  constructor(public notificationService: NotificationService,
    public route: ActivatedRoute,
    public router: Router,
    public loginDepsService: LoginDepsService) {
  }

  /***/
  ngOnInit() {
    this.loginDepsService.deps
      .subscribe(
        (deps: IUserDep[]) => {
          for (let dep of deps) {
            dep['posts_template'] = {
              template: this.templateProvider.badges,
              context: {
                data:
                {
                  badges: dep.posts.map(x => <any>{ text: x.name, css: 'badge badge-success' }),
                  text: null,
                }
              }
            };
          }
          this.positions = deps;
        }
      );
  }

  /***/
  selectRow(dep: IUserDep) {
    AdminLib.saveDep(dep);
    const url = this.route.snapshot.queryParams.url;
    this.notificationService.dep.next(dep);
    this.router.navigateByUrl(url ? `/${url}` : '/dashboard');
  }

}
