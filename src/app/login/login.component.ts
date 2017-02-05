import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Credentials, LoginService} from 'classpip-utils';
import { AlertService, AngularService } from '../_services/index';

@Component({
  selector: 'app-login-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // TODO: add a login spinner while the call is processing

  public credentials: Credentials = new Credentials();
  private returnUrl: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public loginService: LoginService,
    public alertService: AlertService,
    public angularService: AngularService) {
  }

  ngOnInit() {

    this.angularService.disableMenu();

    // reset login status
    if (localStorage.getItem(AppConfig.LS_USER)) {
      this.loginService.logout().finally(() => {
        localStorage.removeItem(AppConfig.LS_USER);
      }).subscribe();
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Method for performing a login against the backend. If it OK will
   * redirect from the comming URL, if not, will prompt an error
   */
  public login(): void {
    this.loginService.login(this.credentials).subscribe(
      ((data: Response) => {
        localStorage.setItem(AppConfig.LS_USER, JSON.stringify(data.json()));
        this.router.navigate([this.returnUrl]);
      }),
      error => {
        this.alertService.error(error);
      });
  }
}
