import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs'; // tslint:disable-line
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoadingService {

  private subject = new Subject<Boolean>();
  private keepAfterNavigationChange: boolean;

  constructor(public router: Router) {

    // Subscripbe to the router events in order to clear the
    // loading or not dpending on keepAfterNavigationChange
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

  public show(keepAfterNavigationChange?: boolean): void {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next(true);
  }

  public hide(keepAfterNavigationChange?: boolean): void {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next(false);
  }

  public getLoading(): Observable<Boolean> {
    return this.subject.asObservable();
  }
}
