import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { Profile } from './shared/models/index';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public translateService: TranslateService) {

    // i18n configuration
    translateService.setDefaultLang(AppConfig.LANG);
    translateService.use(AppConfig.LANG);
  }
}
