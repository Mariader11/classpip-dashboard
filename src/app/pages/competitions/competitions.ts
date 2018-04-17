import { Component, OnInit} from '@angular/core';

import { Login, Competition, Role, Team } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, CompetitionService,
  TeamService, AlertService } from '../../shared/services/index';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.html',
  styleUrls: ['./competitions.scss']
})
export class CompetitionsComponent implements OnInit {

  public competitions: Array<Competition>;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    public teamService: TeamService) {

      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT ) {
    this.getCompetitions();
     }

  }

  getCompetitions(): void {
    this.competitionService.getMyCompetitionsGroup().subscribe(
      ((competitions: Array<Competition>) => {
        this.competitions = competitions;
        if ( this.utilsService.role === Role.STUDENT ) {
          this.getTeamsStudent();
        } else { this.loadingService.hide(); }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getTeamsStudent(): void {
    this.teamService.getTeamsStudent(+this.utilsService.currentUser.userId).subscribe(
      ((teams: Array<Team>) => {
        this.getCompetitionsTeam(teams);
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getCompetitionsTeam(teams: Array<Team>): void {
    for (let _t = 0; _t < teams.length; _t++) {
    this.teamService.getMyCompetitionsGroup(+teams[_t].id).subscribe(
      ((competitions: Array<Competition>) => {
        for (let _c = 0; _c < competitions.length; _c++) {
          this.competitions.push(competitions[_c]);
        }
          this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
}

}
