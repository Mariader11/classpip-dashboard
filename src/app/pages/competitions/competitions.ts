import { Component, OnInit} from '@angular/core';


import { Login, Competition, Role } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, CompetitionService, AlertService } from '../../shared/services/index';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.html',
  styleUrls: ['./competitions.scss']
})
export class CompetitionsComponent implements OnInit {

  public competitions: Array<Competition>;
  public numCompetitions: number;
  public competition: Competition;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService) {

      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {

    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {

    this.loadingService.show();

    this.competitionService.getCompetitionsCount().subscribe(
      ( res => {
        this.numCompetitions = res.count;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

        this.competitionService.getMyCompetitionsGroup().subscribe(
          ((competitions: Array<Competition>) => {
            this.competitions = competitions;
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));

          this.competitionService.getCompetition(1).subscribe(
            ((competition: Competition) => {
              this.competition = competition;
              // tslint:disable-next-line:no-console
              console.log(this.competition);
              this.loadingService.hide();
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
     }

  }

}
