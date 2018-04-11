import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { AppConfig } from '../../../../app.config';
import { Login, Role, Team, Student, Competition, Journey, Match } from '../../../../shared/models/index';
import { LoadingService, UtilsService, AlertService, JourneyService,
  CompetitionService, TeamService} from '../../../../shared/services/index';
  import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-journeys-league',
  templateUrl: './journeys-league.html',
  styleUrls: ['./journeys-league.css']
})
export class JourneysLeagueComponent implements OnInit {

  competitionId: string;
  competitionType: string;
  competition: Competition;
  journeys = new Array<Journey>();
  notCompletedJourneys = new Array<Journey>();
  count: number;
  numberMatches: number;
  public matchesJourneys: Match[][];
  public showMatches: any[][];

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public teamService: TeamService,
    private route: ActivatedRoute) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
      this.matchesJourneys = [];
      this.showMatches = [];
    }

  ngOnInit() {
    this.loadingService.show();
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.competitionType = this.route.snapshot.url[1].path;
    this.getSelectedCompetition();
    this.loadingService.hide();
  }

  getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        this.getJourneysAndMatches();
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getJourneysAndMatches(): void {
    this.journeyService.getJourneysCompetition(this.competitionId).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        for (let _n = 0; _n < this.journeys.length; _n++) {
          this.journeys[_n].completed = false;
          // Getting matches of each journey
          this.matchesJourneys[_n] = [];
          this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competition).subscribe(
          ((matches: Array<Match>) => {
            this.numberMatches = matches.length;
            this.count = 0;
            // Multidimensional array Journey[_n] and Matches[_m]
            for (let _m = 0; _m < matches.length; _m++) {
              this.matchesJourneys[_n][_m] = new Match();
              this.matchesJourneys[_n][_m] = matches[_m];
              if ( matches[_m].winner !== 0 ) {
                this.count = this.count + 1;
              }
            }
            // There are results for all matches so the journey is completed
            if ( this.count === matches.length ) {
              this.journeys[_n].completed = true;
            }
            // Making the array for journeys not completed
            if ( this.journeys[_n].completed === false) {
              this.notCompletedJourneys.push(this.journeys[_n]);
            }

          }),
          ((error: Response) => {
            this.alertService.show(error.toString());
          }));
        }
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
      // tslint:disable-next-line:no-console
      console.log(this.matchesJourneys);
  }

}
