import { Component, OnInit } from '@angular/core';

import { AlertService } from '../_services/index';
import { Alert } from '../_models/index';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})

export class AlertComponent implements OnInit {

  public alert: Alert;

  constructor(private alertService: AlertService) { }

  /**
   * Initialize the directive/component after Angular
   * first displays the data-bound properties and sets
   * the directive/component's input properties.
   */
  ngOnInit() {
    this.alertService.getMessage().subscribe(
      ((message: Alert) => {
        this.alert = message;
      })
    );
  }
}
