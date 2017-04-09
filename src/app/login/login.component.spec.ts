/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { Http, HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppConfig } from '../app.config';
import { routing } from '../app.routing';
import { LoginComponent } from './login.component';
import { HomeComponent } from '../home/home.component';
import { StudentsComponent } from '../students/students.component';
import { AlertService, AngularService } from '../_services/index';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, AppConfig.LANG_PATH, AppConfig.LANG_EXT);
}

describe('Component: Login', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, HomeComponent, StudentsComponent],
      imports: [
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [Http]
        }),
        FormsModule,
        routing
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        AlertService,
        AngularService,
      ],
      schemas: []
    });
    TestBed.compileComponents();
  });

  it('should create an instance', async(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
