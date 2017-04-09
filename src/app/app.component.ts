import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { AppConfig } from './app.config';
import { AngularService, AlertService, UserService, UtilsService } from './_services/index';
import { Profile, Login } from './_models/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public menu: boolean;
  public profile: Profile;

  constructor(
    public angularService: AngularService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public userService: UserService,
    public translateService: TranslateService) {

    // i18n configuration
    translateService.setDefaultLang(AppConfig.LANG);
    translateService.use(AppConfig.LANG);
  }

  ngOnInit() {

    // subscribe to the menu events
    this.angularService.getMenu().subscribe(item => {
      this.menu = item;
      if (this.menu) {
        // the user is logged into the system
        this.userService.getMyProfile().subscribe(
          ((value: Profile) => this.profile = value),
          error => this.alertService.error(error));
      }
    });
  }
}
