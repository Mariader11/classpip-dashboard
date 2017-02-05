import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Alert } from '../_models/index';

@Injectable()
export class AlertService {

  private subject = new Subject<Alert>();
  private keepAfterNavigationChange: boolean;

  constructor(public router: Router) {

    // Subscripbe to the router events in order to clear the
    // alerts or not dpending on keepAfterNavigationChange
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          this.keepAfterNavigationChange = false;
        } else {
          this.subject.next();
        }
      }
    });
  }

  /**
   * Method for displaying a success alert message into the
   * directive.
   * @param message {string} Message to displaying
   * @param keepAfterNavigationChange {boolean} keep the message after navigation
   */
  public success(message: string, keepAfterNavigationChange?: boolean): void {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next(new Alert('success', message));
  }

  /**
   * Method for displaying a error alert message into the
   * directive.
   * @param message {string} Message to displaying
   * @param keepAfterNavigationChange {boolean} keep the message after navigation
   */
  public error(message: string, keepAfterNavigationChange?: boolean): void {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next(new Alert('danger', message));
  }

  /**
   * REturn the current subject alert as an Observable
   * @return {Alert} the current message displayed
   */
  public getMessage(): Observable<Alert> {
    return this.subject.asObservable();
  }
}
