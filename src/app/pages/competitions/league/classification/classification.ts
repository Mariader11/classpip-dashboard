import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Para linkear lo de :id
import { ActivatedRoute, ParamMap } from '@angular/router';
//

import { AppConfig } from '../../../../app.config';
import { Login, Student, Role, Competition, Journey, Match, Team } from '../../../../shared/models/index';
import { LoadingService, UtilsService, AlertService, TeamService,
  CompetitionService, JourneyService } from '../../../../shared/services/index';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.html',
  styleUrls: ['./classification.scss']
})
export class ClassificationComponent implements OnInit {

  tableHeader = ['Posición', 'Nombre', 'Ganados', 'Empatados', 'Perdidos', 'Puntuación'];

  competition: Competition;
  competitionId: string;
  modeIndividual: boolean;

  journeys: Journey[];
  participants: Participant[];
  matchesJourneys: Array<Array<Match>>;

  scores = new Array<Score>();
  score: Score;

  countJourneys: number;
  found: boolean;

  constructor(public utilsService: UtilsService,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public journeyService: JourneyService,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private competitionService: CompetitionService) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
     }

  ngOnInit() {
    this.loadingService.show();
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.getClassificationOfCompetition();
  }

  getClassificationOfCompetition(): void {
    this.competitionService.getCompetition(this.competitionId)
    .subscribe( ((competition: Competition) => {
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
        this.getMatches();
        this.loadingService.hide();
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
        for (let _m = 0; _m < matches.length; _m++) {
          this.matchesJourneys[_j][_m] = new Match();
          this.matchesJourneys[_j][_m] = matches[_m];
        }
         // tslint:disable-next-line:no-console
         console.log(this.matchesJourneys);
         if ( this.countJourneys === this.journeys.length ) {
           this.getParticipants();
          }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }
  }

  getParticipants(): void {
    this.participants = [];
    if (this.competition.mode === 'Individual') {
      this.modeIndividual = true;
      this.competitionService.getStudentsCompetition(this.competitionId)
      .subscribe(( (students: Array<Student>) => {
        for (let _s = 0; _s < students.length; _s++) {
          this.participants[_s] = {
            id: +students[_s].id,
            name: students[_s].name.concat(' ', students[_s].surname)
          };
        }
        this.getScores();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
      } else {
      this.modeIndividual = false;
      this.teamService.getTeamsCompetition(this.competitionId)
      .subscribe(( (teams: Array<Team>) => {
        for (let _t = 0; _t < teams.length; _t++) {
          this.participants[_t] = {
            id: +teams[_t].id,
            name: teams[_t].name
          };
        }
        this.getScores();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
      }
  }

  getScores(): void {

      // tslint:disable-next-line:no-console
      console.log(this.participants);
      this.scores = [];
      for (let _p = 0; _p < this.participants.length; _p++) {
        this.score = { position: 0, name: this.participants[_p].name,
                       won: 0, draw: 0, lost: 0, points: 0};
        for (let _j = 0; _j < this.journeys.length; _j++) {
          this.found = false;
          for (let _m = 0; _m < this.matchesJourneys[_j].length && !this.found; _m++) {
            if ( +this.participants[_p].id === this.matchesJourneys[_j][_m].playerOne ||
            +this.participants[_p].id === this.matchesJourneys[_j][_m].playerTwo ) {
              if ( this.matchesJourneys[_j][_m].winner === +this.participants[_p].id ) {
                this.score.points = this.score.points + 3;
                this.score.won = this.score.won + 1;
              } else if ( this.matchesJourneys[_j][_m].winner === 1 ) {
                this.score.points = this.score.points + 1;
                this.score.draw = this.score.draw + 1;
              } else if ( this.matchesJourneys[_j][_m].winner === 0 ) {
              } else {
                this.score.lost = this.score.lost + 1;
              }
              this.found = true;
            }
          }
        }
        this.scores.push(this.score);
      }
      // ordenar descendentemente los resultados por sus puntos
      this.scores.sort(function (a, b) {
        return (b.points - a.points);
      });
      for (let _s = 0; _s < this.scores.length; _s++) {
        this.scores[_s].position = _s + 1;
       }
      // tslint:disable-next-line:no-console
      console.log(this.scores);
  }

}

export interface Score {
  position: number;
  name: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
}

export interface Participant {
  id: number;
  name: string;
}
