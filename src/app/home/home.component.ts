import { Component, OnInit } from '@angular/core';

import { AppConfig } from '../app.config';
import { LoginLocalStorage } from '../_models/login.local.storage';
import { AngularService } from '../_services/index';

@Component({
  selector: 'app-home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public currentUser: LoginLocalStorage;

  constructor(public angularService: AngularService) {
    this.currentUser = LoginLocalStorage.toObject(localStorage.getItem(AppConfig.LS_USER));
  }

  ngOnInit() {
    this.angularService.enableMenu();
  }
}
