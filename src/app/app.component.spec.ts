import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { LoadingComponent } from './shared/loading/loading';
import { routing } from './app.routing';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { GroupsComponent } from './pages/groups/groups';
import { CompetitionsComponent } from './pages/competitions/competitions';
import { CreateTeamsComponent } from './pages/create-teams/create-teams';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app.material.module';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate';
import { AppConfig } from './app.config';
import { NgxLoremIpsumModule } from 'ngx-lorem-ipsum';
import { APP_BASE_HREF } from '@angular/common';
import { AuthGuard } from './shared/auth/auth.guard';
import {
  AvatarService, AlertService, LoadingService, SchoolService, LoginService,
  UserService, GradeService, GroupService, UtilsService, MatterService,
  CompetitionService, JourneyService, MatchesService, TeamService
} from './shared/services/index';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, AppConfig.LANG_PATH, AppConfig.LANG_EXT);
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      ], providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
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
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render header in a app-navbar tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-navbar').textContent).toContain('');
  }));
});
