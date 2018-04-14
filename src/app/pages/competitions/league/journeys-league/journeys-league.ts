import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../../../app.config';
import { Login, Role, Team, Student, Competition, Journey, Match } from '../../../../shared/models/index';
import { LoadingService, UtilsService, AlertService, JourneyService,
  CompetitionService, TeamService} from '../../../../shared/services/index';
  import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-journeys-league',
  templateUrl: './journeys-league.html',
  styleUrls: ['./journeys-league.scss']
})
export class JourneysLeagueComponent implements OnInit {

  competitionId: string;
  competition: Competition;
  modeIndividual: boolean;

  journeys = new Array<Journey>();
  countJourneys: number;
  dates: String[];

  matchesJourneys: Match[][];
  matches: Match[];
  descanso: number;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public teamService: TeamService,
    public datePipe: DatePipe,
    private route: ActivatedRoute) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    this.loadingService.show();
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.getSelectedCompetition();
    this.loadingService.hide();
  }

  getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        if ( competition.mode === 'Individual') { this.modeIndividual = true; } else { this.modeIndividual = false; }
        this.getJourneys();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getJourneys(): void {
    this.journeyService.getJourneysCompetition(this.competitionId).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.journeys.sort(function (a, b) {
          return (a.number - b.number);
        });
        this.getMatches();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getMatches(): void {
    this.countJourneys = 0;
    this.matchesJourneys = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.matchesJourneys[_j] = [];
      this.journeyService.getMatchesJourneyDetails(this.journeys[_j].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        this.countJourneys = this.countJourneys + 1;
        this.matches = matches;
        for (let _m = 0; _m < this.matches.length; _m++) {
          if (this.matches[_m].namePlayerOne === 'Ghost' || this.matches[_m].namePlayerTwo === 'Ghost') {
            this.descanso = _m;
          }
        }
        if (this.descanso !== undefined) {
          this.matches.splice(this.descanso, 1); // y ocultando el enfrentamiento del descanso
          }
        this.matchesJourneys[_j] = this.matches;
         if ( this.countJourneys === this.journeys.length ) {
           this.getDatesAndResults();
          }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }
  }

  getDatesAndResults(): void {
    this.dates = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      if (this.journeys[_j].date === null) {
        this.dates[_j] = 'No establecida';
      } else {
        this.dates[_j] = this.datePipe.transform(this.journeys[_j].date, 'MM-dd-yyyy');
      }
      for (let _m = 0; _m < this.matchesJourneys[_j].length; _m++) {
        if (this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerOne ) {
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerOne;
        } else if ( this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerTwo ) {
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerTwo;
        } else if ( this.matchesJourneys[_j][_m].winner === 1 ) {
          this.matchesJourneys[_j][_m].result = 'Empate';
        } else if ( this.matchesJourneys[_j][_m].winner === 0 ) {
          this.matchesJourneys[_j][_m].result = '-';
        }
      }
    }
    this.loadingService.hide();
  }
}
