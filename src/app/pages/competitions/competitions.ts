import { Component, OnInit} from '@angular/core';

import { Login, Competition, Role, Team, Group } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, CompetitionService,
  TeamService, AlertService, GroupService } from '../../shared/services/index';

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
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public teamService: TeamService) {

      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER) {
      this.getTeacherCompetitions();
    } else if (this.utilsService.role === Role.STUDENT) {
      this.getStudentCompetitions();
    }
  }

  getTeacherCompetitions(): void {
    this.competitions = [];
    // tslint:disable-next-line:no-console
    console.log(this.competitions);
    this.groupService.getMyGroups().subscribe(
      ((groups: Array<Group>) => {
        for (let _g = 0; _g < groups.length; _g++) {
        this.competitionService.getMyCompetitionsByGroup(groups[_g]).subscribe(
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
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getStudentCompetitions(): void {
    this.competitions = [];
    this.competitionService.getMyCompetitions().subscribe(
      ((competitions: Array<Competition>) => {
        for (let _s = 0; _s < competitions.length; _s++) {
          this.competitions.push(competitions[_s]);
        }
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    this.teamService.getTeamsStudent(+this.utilsService.currentUser.userId).subscribe(
      ((teams: Array<Team>) => {
        for (let _t = 0; _t < teams.length; _t++) {
          this.teamService.getMyCompetitionsGroup(+teams[_t].id).subscribe(
            ((competitions: Array<Competition>) => {
              for (let _c = 0; _c < competitions.length; _c++) {
                this.competitions.push(competitions[_c]);
              }
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        }
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

}
