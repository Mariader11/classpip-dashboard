import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

import { AppConfig } from './app.config';
import { UtilsService } from './_services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public menu: boolean = false;

  constructor(
    private utilsService: UtilsService,
    translateService: TranslateService) {

    // i18n configuration
    translateService.setDefaultLang(AppConfig.LANG);
    translateService.use(AppConfig.LANG);
  }

  ngOnInit() {

    // subscribe to the menu events
    this.utilsService.getMenu().subscribe(item => this.menu = item);
  }
}
