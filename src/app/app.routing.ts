import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConfig } from './app.config';
import { AuthGuard } from './shared/auth/auth.guard';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { GroupsComponent } from './pages/groups/groups';

// Competitions
import { CompetitionsComponent} from './pages/competitions/competitions';
import { LigaComponent } from './pages/competitions/liga/liga';
import { LeagueComponent } from './pages/competitions/league/league';
import { CreateCompetitionComponent } from './pages/competitions/create-competition/create-competition';
import { ClasificationComponent } from './pages/competitions/liga/clasification/clasification';
import { TeamsComponent } from './pages/competitions/teams/teams';


const appRoutes: Routes = [

  // authenticated pages
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'competitions', component: CompetitionsComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id', component: LeagueComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/:id', component: ClasificationComponent, canActivate: [AuthGuard]},
  { path: 'competition/create', component: CreateCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/liga', component: LigaComponent, canActivate: [AuthGuard]},
  { path: 'competition/:id/clasification', component: ClasificationComponent, canActivate: [AuthGuard]},
  { path: 'competition/:id/teams', component: TeamsComponent, canActivate: [AuthGuard]},
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },

  // unauthenticad pages
  { path: 'login', component: LoginComponent },

  // otherwise (redirect to home)
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { enableTracing: true });
