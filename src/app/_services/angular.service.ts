import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class AngularService {

  @Output() fire: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

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
}
