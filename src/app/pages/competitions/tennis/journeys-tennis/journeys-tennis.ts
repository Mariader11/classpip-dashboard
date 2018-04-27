import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../../../app.config';
import { Login, Role, Team, Student, Competition, Journey, Match } from '../../../../shared/models/index';
import { LoadingService, UtilsService, AlertService, JourneyService,
  CompetitionService, TeamService} from '../../../../shared/services/index';
  import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-journeys-tennis',
  templateUrl: './journeys-tennis.html',
  styleUrls: ['./journeys-tennis.scss']
})
export class JourneysTennisComponent implements OnInit {

  show = false;
  results = false;
  competitionId: string;
  competition: Competition;

  journeys = new Array<Journey>();
  numJourneys: number;
  dates: String[];
  datesNoMatches: any[];

  matchesJourneys: Match[][];
  matchesPrincipal: Match[][];
  matchesSecondary: Match[][];
  lastJourney: number;
  tournaments: String[][];

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
    if ( this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT ) {
      this.loadingService.show();
      this.competitionId = this.route.snapshot.paramMap.get('id');
      this.getSelectedCompetition();
    }
  }

  getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
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
        this.numJourneys = this.journeys.length;
        this.getMatches();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getMatches(): void {
    let countJourneys = 0;
    this.matchesJourneys = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.journeyService.getMatchesJourneyDetails(this.journeys[_j].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        this.matchesJourneys[_j] = [];
        for (let _m = 0; _m < matches.length; _m++) {
          this.matchesJourneys[_j][_m] = new Match();
          this.matchesJourneys[_j][_m] = matches[_m];
        }
        if (this.matchesJourneys[_j][0].winner === 0) { this.lastJourney = _j; }
        countJourneys++;
        if ( countJourneys === this.lastJourney + 1 || countJourneys === this.numJourneys) {
          if ( this.lastJourney === undefined ) { this.lastJourney = this.numJourneys - 1; }
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
    this.datesNoMatches = [];
    this.tournaments = [];
    // DATES AND TOURNAMENTS
    for (let _j = 0; _j < this.journeys.length; _j++) {
      if ( _j <= this.lastJourney) {
      this.journeys[_j].date === null ?
        this.dates[_j] = 'No establecida' :
        this.dates[_j] = this.datePipe.transform(this.journeys[_j].date, 'dd-MM-yyyy');
      } else {
        this.journeys[_j].date === null ?
        this.datesNoMatches.push({date: 'No establecida', number: _j + 1}) :
        this.datesNoMatches.push({date: this.datePipe.transform(this.journeys[_j].date, 'dd-MM-yyyy'), number: _j + 1});
        if ((_j + 1) % 2 === 0 && _j !== this.journeys.length - 1) { // si es par y no es el final participa en ambos
          this.tournaments.push(['Torneo principal: Participa', 'Torneo secundario: Participa']);
        } else if ((_j + 1) % 2 !== 0) {
          this.tournaments.push(['Torneo principal: No participa', 'Torneo secundario: Participa']);
        } else if ( _j === this.journeys.length - 1) {
          this.tournaments.push(['FINAL']);
        }
      }
    }
    // INTRODUCE THE RESULT AND TO SEPARATE IN PRINCIPAL AND SECONDARY MATCHES
    this.matchesPrincipal = [];
    this.matchesSecondary = [];
    for (let _j = 0; _j < this.matchesJourneys.length; _j++) {
      this.matchesPrincipal[_j] = [];
      this.matchesSecondary[_j] = [];
      for (let _m = 0; _m < this.matchesJourneys[_j].length; _m++) {
        if ( this.matchesJourneys[_j][_m].winner === 0 ) {
          this.matchesJourneys[_j][_m].result = '-';
        } else {
          this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerOne ?
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerOne :
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerTwo;
        }
        if ((_j + 1) % 2 === 0) { // si es par participa en ambos
          if ( _m < this.matchesJourneys[_j].length / 2) {
          this.matchesPrincipal[_j].push(this.matchesJourneys[_j][_m]);
          } else {
          this.matchesSecondary[_j].push(this.matchesJourneys[_j][_m]);
          }
        } else if ((_j + 1) % 2 !== 0 && _j !== 0) { // si es impar participa solo en el secundario excepto en el primer partido
          this.matchesSecondary[_j].push(this.matchesJourneys[_j][_m]);
        } else if ( _j === 0) {
          this.matchesPrincipal[_j].push(this.matchesJourneys[_j][_m]);
        }
      }
    }
    this.results = true;
    this.loadingService.hide();
  }

  showMore() {
    this.show === true ? this.show = false : this.show = true;
  }
}
