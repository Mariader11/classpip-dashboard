/* tslint:disable:no-unused-variable */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// aplication
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { routing } from './app.routing';

// pages
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { StudentsComponent } from './students/students.component';

// components
import { AlertComponent } from './_directives/index';
import { OrderByIdPipe, OrderByNamePipe, OrderBySurnamePipe } from './_pipes/index';
import { AuthGuard } from './_guards/index';
import {
  AlertService, AngularService, AvatarService, GradeService, GroupService,
  LoginService, MatterService, SchoolService, UserService, UtilsService
} from './_services/index';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, AppConfig.LANG_PATH, AppConfig.LANG_EXT);
}

describe('AppComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AlertComponent,
        LoginComponent,
        HomeComponent,
        StudentsComponent,
        // pipes
        OrderByIdPipe,
        OrderByNamePipe,
        OrderBySurnamePipe
      ],
      imports: [
        NgbModule.forRoot(),
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [Http]
        })
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AuthGuard,
        AlertService,
        AngularService,
        AvatarService,
        GradeService,
        GroupService,
        LoginService,
        MatterService,
        SchoolService,
        UserService,
        UtilsService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
