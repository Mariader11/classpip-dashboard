import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConfig } from './app.config';
import { AuthGuard } from './shared/auth/auth.guard';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { GroupsComponent } from './pages/groups/groups';

import { CreateTeamsComponent } from './pages/create-teams/create-teams';
// Competitions
import { CompetitionsComponent} from './pages/competitions/competitions';
import { LeagueComponent } from './pages/competitions/league/league';
import { DeleteCompetitionComponent } from './pages/competitions/delete-competition/delete-competition';
import { CreateLeagueCompetitionComponent } from './pages/competitions/create-league-competition/create-league-competition';
import { CreateTennisCompetitionComponent } from './pages/competitions/create-tennis-competition/create-tennis-competition';
import { TeamsComponent } from './pages/competitions/teams/teams';
import { ClassificationComponent } from './pages/competitions/league/classification/classification';
import { JourneysLeagueComponent } from './pages/competitions/league/journeys-league/journeys-league';

const appRoutes: Routes = [

  // authenticated pages
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'create-teams', component: CreateTeamsComponent, canActivate: [AuthGuard]},
  { path: 'competitions', component: CompetitionsComponent, canActivate: [AuthGuard]},
  { path: 'competition/delete', component: DeleteCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/create', component: CreateTennisCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/create', component: CreateLeagueCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id', component: LeagueComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id/classification', component: ClassificationComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id/journeys', component: JourneysLeagueComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id/teams', component: TeamsComponent, canActivate: [AuthGuard]},
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },

  // unauthenticad pages
  { path: 'login', component: LoginComponent },

  // otherwise (redirect to home)
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
// Para ver lo que hace, dentro de for Root añadir: , { enableTracing: true }
