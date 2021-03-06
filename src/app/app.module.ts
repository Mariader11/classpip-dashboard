import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
import { CreateTeamsComponent } from './pages/create-teams/create-teams';

// pages (competitions)
import { LeagueComponent} from './pages/competitions/league/league';
import { TennisComponent} from './pages/competitions/tennis/tennis';
import { CreateLeagueCompetitionComponent } from './pages/competitions/create-league-competition/create-league-competition';
import { CreateTennisCompetitionComponent } from './pages/competitions/create-tennis-competition/create-tennis-competition';
import { DeleteCompetitionComponent } from './pages/competitions/delete-competition/delete-competition';
import { TeamsComponent } from './pages/competitions/teams/teams';
import { ClassificationComponent } from './pages/competitions/league/classification/classification';
import { JourneysLeagueComponent } from './pages/competitions/league/journeys-league/journeys-league';
import { JourneysTennisComponent } from './pages/competitions/tennis/journeys-tennis/journeys-tennis';
import { TournamentsComponent } from './pages/competitions/tennis/tournaments/tournaments';

// shared (components)
import { NavBarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';

// shared (services)
import { AuthGuard } from './shared/auth/auth.guard';
import { LoadingComponent } from './shared/loading/loading';
import {
  UtilsService, LoginService, LoadingService, AlertService,
  SchoolService, AvatarService, UserService, GroupService,
  GradeService, MatterService, CompetitionService, JourneyService,
  MatchesService, TeamService} from './shared/services/index';

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
    CreateTeamsComponent,
    // pages (competitions)
    LeagueComponent,
    TennisComponent,
    CreateLeagueCompetitionComponent,
    CreateTennisCompetitionComponent,
    DeleteCompetitionComponent,
    TeamsComponent,
    ClassificationComponent,
    JourneysLeagueComponent,
    JourneysTennisComponent,
    TournamentsComponent,
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
    ReactiveFormsModule,
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
    CompetitionService,
    JourneyService,
    MatchesService,
    TeamService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
