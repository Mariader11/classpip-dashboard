import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AppConfig } from '../app.config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  /**
   * Indicates that a class can implement to be a guard
   * deciding if a route can be activated.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // TODO: check the ttl of the session
    if (localStorage.getItem(AppConfig.LS_USER)) {
      return true;
    } else {
      this.router.navigate([AppConfig.PATH_LOGIN], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
