import { Component, OnInit } from '@angular/core';

import { AppConfig } from '../app.config';
import { LoginResponse } from '../_models/index';
import { UtilsService } from '../_services/index';

@Component({
  selector: 'app-home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public currentUser: LoginResponse;

  constructor(private utilsService: UtilsService) {
    this.currentUser = LoginResponse.toObject(localStorage.getItem(AppConfig.LS_USER));
  }

  ngOnInit() {
    this.utilsService.enableMenu();
  }
}
