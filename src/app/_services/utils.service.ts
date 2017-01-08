import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { AppConfig } from '../app.config';
import { ErrorResponse } from '../_models/index';

@Injectable()
export class UtilsService {

  @Output() fire: EventEmitter<boolean> = new EventEmitter();

  constructor(public translateService: TranslateService) { }

  /**
   * This method changed the value of the shared emitter
   * to enable the menu on the application
   */
  public enableMenu(): void {
    this.fire.emit(true);
  }

  /**
   * This method changed the value of the shared emitter
   * to disable the menu on the application
   */
  public disableMenu(): void {
    this.fire.emit(false);
  }

  /**
   * This method returns the value of the variable that holds
   * the status of the
   * @return {boolean} true if the menu is activated, false otherwise
   */
  public getMenu() {
    return this.fire;
  }

  /**
   * This method handles the bad responses of the backend
   * @param {Response} response Object with the server response
   * @return {Observable<Response>} Response with the error message
   */
  public handleAPIError(response: Response): Observable<Response> {
    let message: string;
    let error: ErrorResponse = ErrorResponse.toObject(response.json().error);

    switch (error.status) {
      case 401:
        if (error.code === AppConfig.LOGIN_FAILED) {
          message = this.translateService.instant('ERROR.LOGIN_FAILED');
        } else {
          // Unauthorized request (login again)
          localStorage.removeItem(AppConfig.LS_USER);
        }
        break;
      case 500:
        message = this.translateService.instant('ERROR.INTERNAL_ERROR') + error.message;
        break;
      default:
        message = error.message;
        break;
    }
    return Observable.throw(message);
  }
}
