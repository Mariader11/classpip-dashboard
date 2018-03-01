import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, FormControl, Validators } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { NgxLoremIpsumModule } from 'ngx-lorem-ipsum';

// aplication
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AppMaterialModule } from './app.material.module';
import { routing } from './app.routing';

// pages
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { GroupsComponent } from './pages/groups/groups';
import { CompetitionsComponent } from './pages/competitions/competitions';

// pages (competitions)
import { LigaComponent } from './pages/competitions/liga/liga';
import { LeagueComponent} from './pages/competitions/league/league';
import { CreateCompetitionComponent } from './pages/competitions/create-competition/create-competition';
import { ClasificationComponent } from './pages/competitions/liga/clasification/clasification';
import { TeamsComponent } from './pages/competitions/teams/teams';

// shared (components)
import { NavBarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';

// shared (services)
import { AuthGuard } from './shared/auth/auth.guard';
import { LoadingComponent } from './shared/loading/loading';
import {
  UtilsService, LoginService, LoadingService, AlertService,
  SchoolService, AvatarService, UserService, GroupService,
  GradeService, MatterService, CompetitionService
} from './shared/services/index';

// rxjs
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { from } from 'rxjs/observable/from';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, AppConfig.LANG_PATH, AppConfig.LANG_EXT);
}

@NgModule({
  declarations: [
    AppComponent,
    // pages
    LoginComponent,
    HomeComponent,
    GroupsComponent,
    CompetitionsComponent,
    // pages (competitions)
    LigaComponent,
    LeagueComponent,
    CreateCompetitionComponent,
    ClasificationComponent,
    TeamsComponent,
    // shared
    NavBarComponent,
    FooterComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule,
    FormsModule,
    HttpModule,
    routing,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [Http]
    }),
    NgxLoremIpsumModule
  ],
  providers: [
    AuthGuard,
    AvatarService,
    AlertService,
    LoginService,
    LoadingService,
    SchoolService,
    UserService,
    UtilsService,
    GroupService,
    GradeService,
    MatterService,
    CompetitionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
