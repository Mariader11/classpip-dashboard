import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { AppConfig } from '../../../app.config';
import { Login, Role, Team, Student } from '../../../shared/models/index';
import { LoadingService, UtilsService, AlertService,
        CompetitionService, TeamService} from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.html',
  styleUrls: ['./teams.css']
})
export class TeamsComponent implements OnInit {

  competitionId: number;
  competitionType: string;
  teams: Team[];
  countTeams: number;
  students: Student[];
  public allStudents: Student[][];

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    public teamService: TeamService,
    private route: ActivatedRoute) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
      this.allStudents = [];
     }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {
    this.loadingService.show();
    this.competitionId = +this.route.snapshot.paramMap.get('id');
    this.competitionType = this.route.snapshot.url[1].path;
    this.getTeams();
    }
  }

  getTeams(): void {
    this.teamService.getTeamsCompetition(this.competitionId)
    .subscribe(teams => {this.teams = teams,
      this.getStudents();
    });
  }

  getStudents(): void {
    this.countTeams = 0;
    for (let _t = 0; _t < this.teams.length; _t++) {
    this.teamService.getStudentsTeam(+this.teams[_t].id)
    .subscribe(students => {this.students = students,
      this.allStudents[_t] = students;
      this.teams[_t].numPlayers = this.students.length;
      this.countTeams = this.countTeams + 1;
      if ( this.countTeams === this.teams.length) {
        this.loadingService.hide();
      }
    });
    }
  }

}
