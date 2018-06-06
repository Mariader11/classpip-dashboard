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
  selector: 'app-tennis',
  templateUrl: './tennis.html',
  styleUrls: ['./tennis.scss']
})
export class TennisComponent implements OnInit {

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
  competition: Competition;
  information: string;
  journeys = new Array<Journey>();
  matchesJourneys: Match[][];
  lastJourney: number;
  completed = false;
  // Expansion panels
  notCompletedJourneys = new Array<Journey>();
  newInformation: any;
  clicked = false;
  matches = new Array<Match>();
  showMatchesPrimary: String[][];
  showMatchesIdPrimary: Number[][];
  ghostsPrimary: Array<Array<number>>;
  showMatchesSecondary: String[][];
  showMatchesIdSecondary: Number[][];
  ghostsSecondary: Array<Array<number>>;
  // Submit results
  results: any[];
  results2: any[];
  winner: any;
  matchesIdPrimary: Array<number>;
  matchesIdSecondary: Array<number>;
  // Next journey
  postMatches: Array<Match>;
  principalMatches: Array<number>;
  secondaryMatches: Array<number>;
  submitMatches: Array<number>;
  secondary: Array<number>;
  countMatches: number;
  match1: any;
  founded: boolean;


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
      ]),
      results2: this._formBuilder.array([
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
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        this.information = competition.information;
        // tslint:disable-next-line:no-console
        console.log(this.competition);
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
    this.matchesJourneys = [];
    let journeysCount = 0;
    for (let _n = 0; _n < this.journeys.length; _n++) {
      this.journeys[_n].completed = false;
      this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        this.matchesJourneys[_n] = [];
        let incompletedJourney = 0;
        for (let _m = 0; _m < matches.length; _m++) {
          this.matchesJourneys[_n][_m] = new Match();
          this.matchesJourneys[_n][_m] = matches[_m];
          if (this.matchesJourneys[_n][_m].winner === 0) {
            incompletedJourney++;
            if ( incompletedJourney === matches.length ) {
              this.lastJourney = _n;
              this.matches = matches;
            }
          }
        }
        journeysCount++;
        if ( journeysCount === this.lastJourney + 1 || journeysCount === this.journeys.length) {
          this.loadJourneysSection();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }
  }

  loadJourneysSection() {
    for (let _j = this.lastJourney; _j < this.journeys.length; _j++) { this.notCompletedJourneys.push(this.journeys[_j]); }
    this.finished = true;
    this.loadingService.hide();
  }

  loadResultSection() {
    if (!this.clicked) {
      this.clicked = true;
      this.loadingService.show();
      // Construyendo los enfrentamientos a mostrar
      this.showMatchesPrimary = [];
      this.showMatchesIdPrimary = [];
      this.ghostsPrimary = [];
      this.matchesIdPrimary = [];
      this.showMatchesSecondary = [];
      this.showMatchesIdSecondary = [];
      this.ghostsSecondary = [];
      this.matchesIdSecondary = [];
      if ((this.lastJourney + 1) % 2 !== 0) { // jornada impar
        if (this.lastJourney === 0) {
          for (let _m = 0; _m < this.matches.length; _m++) {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
            this.showMatchesIdPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
            this.showMatchesPrimary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
            this.matchesIdPrimary.push(+this.matches[_m].id);
            } else {
            this.ghostsPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          }
        } else {
          for (let _m = 0; _m < this.matches.length; _m++) {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
            this.showMatchesIdSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
            this.showMatchesSecondary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
            this.matchesIdSecondary.push(+this.matches[_m].id);
            } else {
            this.ghostsSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          }
        }
    } else {   // para las jornadas pares tendremos partidos en principal y secundario
        for (let _m = 0; _m < this.matches.length; _m++) {
          if ( _m < this.matches.length / 2 ) {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
            this.showMatchesIdPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
            this.showMatchesPrimary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
            this.matchesIdPrimary.push(+this.matches[_m].id);
            } else {
            this.ghostsPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          } else {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
              this.showMatchesIdSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
              this.showMatchesSecondary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
              this.matchesIdSecondary.push(+this.matches[_m].id);
            } else {
              this.ghostsSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          }
        }
       }
       for (let _a = 0; _a < this.showMatchesPrimary.length - 1 ; _a++) {
        let results = <FormArray>this.resultsFormGroup.get('results');
        results.push(this._formBuilder.group({
          winner: ['', Validators.required]
        }));
      }
      for (let _a = 0; _a < this.showMatchesSecondary.length - 1 ; _a++) {
        let results2 = <FormArray>this.resultsFormGroup.get('results2');
        results2.push(this._formBuilder.group({
          winner: ['', Validators.required]
        }));
      }
      if (this.showMatchesPrimary.length === 0) {
        let primary = <FormArray>this.resultsFormGroup.get('results');
        primary.removeAt(0);
       }
      if (this.showMatchesSecondary.length === 0) {
        let secondary = <FormArray>this.resultsFormGroup.get('results2');
        secondary.removeAt(0);
      }
              // tslint:disable-next-line:no-console
              console.log(this.showMatchesPrimary);
              // tslint:disable-next-line:no-console
              console.log(this.showMatchesSecondary);
  }
  this.loadingService.hide();
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
    this.results = [];
    this.results2 = [];
    this.postMatches = [];

    if (value === undefined ) {
      for (let _m = 0; _m < this.showMatchesIdPrimary.length; _m++) {
        this.results[_m] = {
          winner: this.showMatchesIdPrimary[_m][Math.floor(Math.random() * 2) + 0]
        };
      }
       // añado los fantasma del torneo principal con el winner donde no sea el ghost
      for (let _g = 0; _g < this.ghostsPrimary.length; _g++) {
       this.ghostsPrimary[_g][0] === 0 ?
       this.results.push({ winner: this.ghostsPrimary[_g][1] }) : this.results.push({ winner: this.ghostsPrimary[_g][0] });
       this.matchesIdPrimary.push(this.ghostsPrimary[_g][2]); // añado el id de los partidos fantasma
      }
      // Lo mismo pal secundario
      for (let _v = 0; _v < this.showMatchesIdSecondary.length; _v++) {
        this.results2[_v] = {
          winner: this.showMatchesIdSecondary[_v][Math.floor(Math.random() * 2) + 0]
        };
      }
      for (let _g = 0; _g < this.ghostsSecondary.length; _g++) {
        this.ghostsSecondary[_g][0] === 0 ?
        this.results2.push({ winner: this.ghostsSecondary[_g][1] }) : this.results2.push({ winner: this.ghostsSecondary[_g][0] });
        this.matchesIdSecondary.push(this.ghostsSecondary[_g][2]); // añado el id de los partidos fantasma
      }
    } else {
      // convierto el nombre en { winner: 10000 }
      for (let _v = 0; _v < value.results.length; _v++) {
        let index = this.showMatchesPrimary[_v].indexOf(value.results[_v].winner);
        this.results[_v] = { winner: this.showMatchesIdPrimary[_v][index] };
      }
      // añado los fantasma del torneo principal con el winner donde no sea el ghost
      for (let _g = 0; _g < this.ghostsPrimary.length; _g++) {
      this.ghostsPrimary[_g][0] === 0 ?
      this.results.push({ winner: this.ghostsPrimary[_g][1] }) : this.results.push({ winner: this.ghostsPrimary[_g][0] });
      this.matchesIdPrimary.push(this.ghostsPrimary[_g][2]); // añado el id de los partidos fantasma
      }
      //  aqui ya tendriamos la primera parte de results montada (torneo principal) tanto con ghost como sin

      // Lo mismo pal secundario
      for (let _v = 0; _v < value.results2.length; _v++) {
      let index = this.showMatchesSecondary[_v].indexOf(value.results2[_v].winner);
      this.results2[_v] = { winner: this.showMatchesIdSecondary[_v][index] };
      }
      for (let _g = 0; _g < this.ghostsSecondary.length; _g++) {
      this.ghostsSecondary[_g][0] === 0 ?
      this.results2.push({ winner: this.ghostsSecondary[_g][1] }) : this.results2.push({ winner: this.ghostsSecondary[_g][0] });
      this.matchesIdSecondary.push(this.ghostsSecondary[_g][2]); // añado el id de los partidos fantasma
      }
    }

   const allResults = this.results.concat(this.results2);
   const allMatches = this.matchesIdPrimary.concat(this.matchesIdSecondary);

    for (let _m = 0; _m < allResults.length; _m++) {
      this.matchesService.putWinner(allResults[_m], allMatches[_m])
      .subscribe( (match => {
        this.postMatches.push(match);
        if (this.postMatches.length === allResults.length ) {
        this.postMatches.sort(function (a, b) { return (+a.id - +b.id); });
        this.alertService.show('Todos los resultados han sido registrados');
        this.matchesUploaded = true;
        if ((this.lastJourney + 1) !== this.journeys.length) {
          this.postNextJourney();
        } else { this.loadingService.hide(); }
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
       }));
    }
  }

  postNextJourney() {
    this.principalMatches = [];
    this.secondaryMatches = [];
    this.submitMatches = [];
    if ((this.lastJourney + 1) % 2 !== 0) { // si la jornada es impar la siguiente tendra en ambos torneos
     if (this.lastJourney === 0) {
      for (let _m = 0; _m < this.postMatches.length; _m++) {
        if (this.postMatches[_m].winner === this.postMatches[_m].playerOne) {
          this.principalMatches.push(this.postMatches[_m].playerOne);
          this.secondaryMatches.push(this.postMatches[_m].playerTwo);
          } else {
          this.principalMatches.push(this.postMatches[_m].playerTwo);
          this.secondaryMatches.push(this.postMatches[_m].playerOne);
        }
      }
     } else {
      for (let _m = 0; _m < (this.matchesJourneys[this.lastJourney - 1].length / 2); _m++) {
        this.matchesJourneys[this.lastJourney - 1][_m].winner ===  this.matchesJourneys[this.lastJourney - 1][_m].playerOne ?
        this.principalMatches.push(this.matchesJourneys[this.lastJourney - 1][_m].playerOne) :
        this.principalMatches.push(this.matchesJourneys[this.lastJourney - 1][_m].playerTwo);
      }
      for (let _m = 0; _m < this.postMatches.length; _m++) {
        this.postMatches[_m].winner === this.postMatches[_m].playerOne ?
        this.secondaryMatches.push(this.postMatches[_m].playerOne) :
        this.secondaryMatches.push(this.postMatches[_m].playerTwo);
      }
     }
      this.submitMatches = this.principalMatches.concat(this.secondaryMatches);
    } else if ( (this.lastJourney + 1) % 2 === 0 ) { // si es par
      for (let _m = 0; _m < this.postMatches.length; _m++) {
        if ( _m < (this.postMatches.length / 2)) {
          this.postMatches[_m].winner === this.postMatches[_m].playerOne ?
            this.secondaryMatches.push(this.postMatches[_m].playerTwo) :
            this.secondaryMatches.push(this.postMatches[_m].playerOne);
        } else {
          this.postMatches[_m].winner === this.postMatches[_m].playerOne ?
            this.secondaryMatches.push(this.postMatches[_m].playerOne) :
            this.secondaryMatches.push(this.postMatches[_m].playerTwo);
        }
      }
      this.submitMatches = this.secondaryMatches;
    }

    this.countMatches = 0;

    for (let _s = 0; _s < this.secondaryMatches.length; _s += 2) {
     this.match1 = {
       playerOne : +this.submitMatches[_s],
       playerTwo : +this.submitMatches[_s + 1],
       journeyId : +this.journeys[this.lastJourney + 1].id
     };
       // POST MATCHES
       this.matchesService.postMatch(this.match1)
       .subscribe( (match => {
         this.countMatches++;
         if ( this.countMatches === (this.secondaryMatches.length / 2)) {
          if ((this.lastJourney + 1) % 2 !== 0) {
            this.postSecondaryTournament();
          } else {
            this.loadingService.hide();
            this.alertService.show('Los enfrentamientos de la siguiente jornada se han actualizado correctamente');
          }
         }
         if ((this.lastJourney + 1) === (this.journeys.length - 1)) {
          this.loadingService.hide();
          this.alertService.show('El enfrentamiento de la siguiente jornada se ha actualizado correctamente');
         }
       }),
       ((error: Response) => {
         this.loadingService.hide();
         this.alertService.show(error.toString());
       }));
    }
   }

   postSecondaryTournament() {
    this.countMatches = 0;
    for (let _s = 0; _s < this.secondaryMatches.length; _s += 2) {
      this.match1 = {
        playerOne : +this.secondaryMatches[_s],
        playerTwo : +this.secondaryMatches[_s + 1],
        journeyId : +this.journeys[this.lastJourney + 1].id
      };
        // POST MATCHES
        this.matchesService.postMatch(this.match1)
        .subscribe( (match => {
          this.countMatches++;
          if ( this.countMatches === (this.secondaryMatches.length / 2)) {
             this.loadingService.hide();
             this.alertService.show('Los enfrentamientos de la siguiente jornada se han actualizado correctamente');
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
     }
   }

  showInformation() {
    this.show === true ? this.show = false : this.show = true;
  }

  showResults() {
    this.option === 'Manualmente' ? this.option = 'Aleatoriamente' : this.option = 'Manualmente';
  }

  gotoTournament() {
    const url = this.route.snapshot.url.join('/') + '/tournaments';
    this.router.navigate([url]);
  }

  gotoJourneys() {
    const url = this.route.snapshot.url.join('/') + '/journeys';
    this.router.navigate([url]);
  }

  gotoTeams() {
    const url = this.route.snapshot.url.join('/') + '/teams';
    this.router.navigate([url]);
  }

  deleteCompetition() {
    const dialogRef = this.dialog.open(DeleteCompetitionComponent, {
      data: { competition: this.competition, journeys: this.journeys }
    });
  }

}
