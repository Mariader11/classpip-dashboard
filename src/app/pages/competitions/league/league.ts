import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor} from '@angular/forms';
import { MatDialog } from '@angular/material';
// Para linkear lo de :id
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//

import { AppConfig } from '../../../app.config';
import { Login, Group, Role, Competition, Journey, Match } from '../../../shared/models/index';
import { LoadingService, UtilsService, GroupService, AlertService, CompetitionService,
JourneyService, MatchesService } from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { DeleteCompetitionComponent } from '../delete-competition/delete-competition';

@Component({
  selector: 'app-league',
  templateUrl: './league.html',
  styleUrls: ['./league.css']
})
export class LeagueComponent implements OnInit {
 // Html
  show = false;
  option = 'Manualmente';
  teams: boolean;
  matchesUploaded = false;
  finished = false;
  // Forms
  journeysFormGroup: FormGroup;
  informationFormGroup: FormGroup;
  resultsFormGroup: FormGroup;
  // Get methods
  competitionId: number;
  competition$: Observable<Competition>;
  competition: Competition;
  information: string;
  journeys = new Array<Journey>();
  public matchesJourneys: Match[][];
  //
  countJourneys: number;
  countCompleted: number;
  notCompletedJourneys = new Array<Journey>();
  journeyMatch = new Journey();

  results: Array<any>;
  winner: any;
  newInformation: any;

  matches = new Array<Match>();
  matchGhost = new Match();

  public showMatches: any[][];
  arrayMatch: Array<any>;


  numberPostMatches: number;
  journeyIndex: number;
  clicked = false;
  descanso: number;


  url: string;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public journeyService: JourneyService,
    public competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private matchesService: MatchesService,
    private _formBuilder: FormBuilder,
    private dialog?: MatDialog) {

      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
      this.matchesJourneys = [];
      this.showMatches = [];
    }

  ngOnInit() {
    if ( this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT ) {
    this.loadingService.show();
    this.journeysFormGroup = this._formBuilder.group({
      id: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.informationFormGroup = this._formBuilder.group({
      information: ['']
    });

    this.resultsFormGroup = this._formBuilder.group({
      results: this._formBuilder.array([
        this._formBuilder.group({
          winner: ['', Validators.required]
        })
      ])
    });

    this.competitionId = +this.route.snapshot.paramMap.get('id');
    this.getSelectedCompetition();
  }
  }

    getSelectedCompetition(): void {
      this.competition$ = this.competitionService.getCompetition(this.competitionId);
      this.competition$.subscribe(
        ((competition: Competition) => {
          this.competition = competition;
          this.information = competition.information;
          this.competition.mode === 'Equipos' ? this.teams = true : this.teams = false;
          if (this.utilsService.role === Role.TEACHER) {
            this.getJourneys();
          } else {
            this.finished = true;
            this.loadingService.hide();
          }
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
          this.journeys.sort(function (a, b) { return (a.number - b.number); });
          this.getMatches();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }

    getMatches(): void {
      this.countJourneys = 0;
      for (let _n = 0; _n < this.journeys.length; _n++) {
        this.journeys[_n].completed = false;
        // Getting matches of each journey
        this.matchesJourneys[_n] = [];
        this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competition).subscribe(
        ((matches: Array<Match>) => {
          this.countCompleted = 0;
          this.countJourneys = this.countJourneys + 1;
          // Multidimensional array Journey[_n] and Matches[_m]
          for (let _m = 0; _m < matches.length; _m++) {
            this.matchesJourneys[_n][_m] = new Match();
            this.matchesJourneys[_n][_m] = matches[_m];
            if ( matches[_m].winner !== 0 ) { this.countCompleted++; }
          }
          // There are results for all matches so the journey is completed
          if ( this.countCompleted === matches.length ) {
            this.journeys[_n].completed = true;
          }
          // Making the array for journeys not completed
          if ( this.journeys[_n].completed === false) {
            this.notCompletedJourneys.push(this.journeys[_n]);
          }
          if ( this.countJourneys === this.journeys.length ) {
            this.finished = true;
            this.loadingService.hide();
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
    }


   loadResultSection() {
      if ( this.clicked === false ) {
    // RESULTS SECTION
        this.loadingService.show();
        this.clicked = true;
    // Searching the lower number of journey not completed
    if (this.notCompletedJourneys.length !== 0) {
      this.journeyMatch = this.notCompletedJourneys[0];
      for (let _j = 1; _j < this.notCompletedJourneys.length; _j++) {
        if ( this.notCompletedJourneys[_j].number < this.journeyMatch.number ) {
          this.journeyMatch = this.notCompletedJourneys[_j];
        }
      }
     this.journeyIndex = this.journeys.findIndex(((journey) => journey.id === this.journeyMatch.id));
     this.matches = this.matchesJourneys[this.journeyIndex];

     // Construyendo los enfrentamientos a mostrar

      for (let _m = 0; _m < this.matches.length; _m++) {
        if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
        this.arrayMatch = [this.matches[_m].namePlayerOne, 'Empate', this.matches[_m].namePlayerTwo];
        this.showMatches[_m] = [];
        this.showMatches[_m] = this.arrayMatch;
       } else {
        this.descanso = _m;
        this.matchGhost = this.matches[_m];
      }
     }
     if (this.descanso !== undefined) {
     this.showMatches.splice(this.descanso, 1); // y ocultando el enfrentamiento del descanso
     }
     // tslint:disable-next-line:no-console
     console.log(this.showMatches);
       // Add the results of each match to section: introduce the results section
        for (let _a = 0; _a < this.showMatches.length - 1 ; _a++) {
        let results = <FormArray>this.resultsFormGroup.get('results');
        results.push(this._formBuilder.group({
          winner: ['', Validators.required]
        }));
        }

    }
    this.loadingService.hide();
    }
   }
    showInformation() {
      this.show === true ? this.show = false : this.show = true;
    }
    showResults() {
      this.option === 'Manualmente' ? this.option = 'Aleatoriamente' : this.option = 'Manualmente';
    }

    gotoClassification() {
      this.url = this.route.snapshot.url.join('/') + '/classification';
      this.router.navigate([this.url]);
    }

    gotoJourneys() {
      this.url = this.route.snapshot.url.join('/') + '/journeys';
      this.router.navigate([this.url]);
    }

    gotoTeams() {
      this.url = this.route.snapshot.url.join('/') + '/teams';
      this.router.navigate([this.url]);
    }

    onSubmitJourney (value) {
      this.loadingService.show();
      this.journeyService.putJourney(value).subscribe();
      this.loadingService.hide();
      this.alertService.show('Jornada actualizada');
    }

    onSubmitInformation(value: string) {
     this.loadingService.show();
     this.competitionService.putInformation(value, this.competitionId).subscribe();
     this.newInformation = value;
     this.competition.information = this.newInformation.information;
     this.loadingService.hide();
     this.alertService.show('Información actualizada');
    }

    onSubmitResults(value) {
      this.loadingService.show();
      if (value === undefined ) {
        this.results = [];
        for (let _m = 0; _m < this.showMatches.length; _m++) {
          this.results[_m] = {
            winner: this.showMatches[_m][Math.floor(Math.random() * 3) + 0]
          };
        }
        if ( this.matchGhost.playerOne === 0 || this.matchGhost.playerTwo === 0) {
          this.results.splice(this.descanso, 0, {winner: 'Descanso'} );
        }
      } else {
        this.results = value.results;
        if ( this.matchGhost.playerOne === 0 || this.matchGhost.playerTwo === 0) {
         this.results.splice(this.descanso, 0, {winner: 'Descanso'} );
        }
      }
      this.numberPostMatches = 0;

      for (let _m = 0; _m < this.results.length; _m++) {
        this.winner = {winner: 0 };
        if ( this.matches[_m].namePlayerOne === this.results[_m].winner ) {
          this.matches[_m].winner = this.matches[_m].playerOne;  // estas lineas se pueden borrar, pura comprobacion CREO
          this.winner.winner = this.matches[_m].playerOne;
        } else if (this.matches[_m].namePlayerTwo === this.results[_m].winner ) {
          this.matches[_m].winner = this.matches[_m].playerTwo;  // estas lineas se pueden borrar, pura comprobacion
          this.winner.winner = this.matches[_m].playerTwo;
        } else if ('Empate' === this.results[_m].winner) {
          this.matches[_m].winner = 1;  // estas lineas se pueden borrar, pura comprobacion
          this.winner.winner = 1;
        } else if ('Descanso' === this.results[_m].winner) {
          this.matches[_m].winner = 2;  // estas lineas se pueden borrar, pura comprobacion
          this.winner.winner = 2;
        }
        this.matchesService.putWinner(this.winner, this.matches[_m].id)
        .subscribe( (match => {
          this.numberPostMatches ++;
          if (this.numberPostMatches === this.matchesJourneys[0].length ) {
            this.loadingService.hide();
            this.alertService.show('Todos los resultados han sido registrados');
            this.matchesUploaded = true;
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
    }

    deleteCompetition() {
      const dialogRef = this.dialog.open(DeleteCompetitionComponent, {
        data: { competition: this.competition, journeys: this.journeys }
      });
    }

  }
