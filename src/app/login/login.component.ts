import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { TranslateService, LangChangeEvent } from 'ng2-translate/ng2-translate';

import { AppConfig } from '../app.config';
import { AlertService, AngularService, LoginService, UtilsService } from '../_services/index';
import { Credentials, Role, Login } from '../_models/index';

@Component({
  selector: 'app-login-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // TODO: add a login spinner while the call is processing

  public credentials: Credentials = new Credentials();
  public role: Role;
  public roles: Array<Object>;
  private returnUrl: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public loginService: LoginService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public translateService: TranslateService,
    public angularService: AngularService) {
  }

  ngOnInit() {

    this.angularService.disableMenu();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Configure the role on the utils service
    this.role = Role.TEACHER;
    this.utilsService.role = Role.TEACHER;

    // reset login status
    if (localStorage.getItem(AppConfig.LS_USER)) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.loginService.logout().finally(() => {
        localStorage.removeItem(AppConfig.LS_USER);
        localStorage.removeItem(AppConfig.LS_ROLE);
      }).subscribe();
    }

    this.translateService.get(['LOGIN.STUDENT', 'LOGIN.TEACHER', 'LOGIN.SCHOOLADMIN']).subscribe(
      values => {

        this.roles = new Array<Object>();
        this.roles.push({ id: Role.STUDENT, name: values['LOGIN.STUDENT'] });
        this.roles.push({ id: Role.TEACHER, name: values['LOGIN.TEACHER'] });
        this.roles.push({ id: Role.SCHOOLADMIN, name: values['LOGIN.SCHOOLADMIN'] });
      });

    // TODO: remove this:
    this.credentials.username = 'teacher-1';
    this.credentials.password = 'teacher-1';
  }

  /**
   * Method for performing a login against the backend. If it OK will
   * redirect from the comming URL, if not, will prompt an error
   */
  public login(): void {
    this.loginService.login(this.credentials).subscribe(
      ((data: Response) => {
        localStorage.setItem(AppConfig.LS_USER, JSON.stringify(data.json()));
        localStorage.setItem(AppConfig.LS_ROLE, JSON.stringify(this.role));

        this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
        this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

        this.router.navigate([this.returnUrl]);
      }),
      error => {
        this.alertService.error(error);
      });
  }

  public roleChange(): void {
    this.utilsService.role = this.role;
    switch (this.role) {
      case Role.TEACHER:
        this.credentials.username = 'teacher-1';
        this.credentials.password = 'teacher-1';
        break;
      case Role.STUDENT:
        this.credentials.username = 'student-1';
        this.credentials.password = 'student-1';
        break;
      case Role.SCHOOLADMIN:
        this.credentials.username = 'school-admin-1';
        this.credentials.password = 'school-admin-1';
        break;
      default:
        break;
    }
  }
}
