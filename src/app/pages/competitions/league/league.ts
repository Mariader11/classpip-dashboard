import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor} from '@angular/forms';

// Para linkear lo de :id
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//

import { AppConfig } from '../../../app.config';
import { Login, Group, Role, Competition, Journey, Match } from '../../../shared/models/index';
import { LoadingService, UtilsService, GroupService, AlertService, CompetitionService,
JourneyService, MatchesService } from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-league',
  templateUrl: './league.html',
  styleUrls: ['./league.css']
})
export class LeagueComponent implements OnInit {

  journeysFormGroup: FormGroup;
  informationFormGroup: FormGroup;
  resultsFormGroup: FormGroup;

  competitionId: string;
  competition$: Observable<Competition>;
  competition: Competition;
  information: string;

  journeys = new Array<Journey>();
  notCompletedJourneys = new Array<Journey>();
  journeyMatch = new Journey();

  matches = new Array<Match>();
  winner: any;
  public matchesJourneys: Match[][];
  public showMatches: any[][];
  arrayMatch: Array<any>;
  count: number;
  numberMatches: number;
  numberPostMatches: number;
  journeyIndex: number;
  clicked = false;

  url: string;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public journeyService: JourneyService,
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private matchesService: MatchesService,
    private _formBuilder: FormBuilder) {

      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
      this.matchesJourneys = [];
      this.showMatches = [];
    }

  ngOnInit() {

    this.loadingService.show();
    // tslint:disable-next-line:no-console
    console.log(this.route);
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
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.competition$ = this.competitionService.getCompetition(this.competitionId);

    this.competition$.subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        this.information = competition.information;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    // Getting competition's journeys

    this.journeyService.getJourneysCompetition(this.competitionId).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        for (let _n = 0; _n < this.journeys.length; _n++) {
          this.journeys[_n].completed = false;
          // Getting matches of each journey
          this.matchesJourneys[_n] = [];
          this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competitionId).subscribe(
          ((matches: Array<Match>) => {
            this.numberMatches = matches.length;
            this.count = 0;
            // Multidimensional array Journey[_n] and Matches[_m]
            for (let _m = 0; _m < matches.length; _m++) {
              this.matchesJourneys[_n][_m] = new Match();
              this.showMatches[_m] = [];
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
    }

    gotoTeams() {
      this.url = this.route.snapshot.url.join('/') + '/teams';
      // tslint:disable-next-line:no-console
      console.log(this.url);
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
     // tslint:disable-next-line:no-console
     console.log(value);
     this.competitionService.putInformation(value, this.competitionId).subscribe();
     this.loadingService.hide();
     this.alertService.show('Información actualizada');
    }

    onSubmitResults(value) {
      this.loadingService.show();
      this.numberPostMatches = 0;
      // tslint:disable-next-line:no-console
      console.log(value.results);
      for (let _m = 0; _m < value.results.length; _m++) {

        this.winner = {
          winner: 0
        };
        if ( this.matches[_m].namePlayerOne === value.results[_m].winner ) {
          this.matches[_m].winner = this.matches[_m].playerOne;
          this.winner.winner = this.matches[_m].playerOne;
        } else if (this.matches[_m].namePlayerTwo === value.results[_m].winner ) {
          this.matches[_m].winner = this.matches[_m].playerTwo;
          this.winner.winner = this.matches[_m].playerTwo;
        } else if ('Empate' === value.results[_m].winner) {
          this.matches[_m].winner = 1;
          this.winner.winner = 1;
        }
        this.matchesService.putWinner(this.winner, this.matches[_m].id)
        .subscribe( (match => {
          this.numberPostMatches ++;
          if (this.numberPostMatches === this.numberMatches ) {
            this.loadingService.hide();
            this.alertService.show('Todos los resultados han sido registrados');
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
      // tslint:disable-next-line:no-console
      console.log(this.matches);
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

    for (let _m = 0; _m < this.matches.length; _m++) {
      this.arrayMatch = [this.matches[_m].namePlayerOne, 'Empate', this.matches[_m].namePlayerTwo];
      this.showMatches[_m].push(this.arrayMatch);
    }

           // Add the results to section: introduce the results section

          for (let _a = 0; _a < this.numberMatches - 1; _a++) {
            let results = <FormArray>this.resultsFormGroup.get('results');
            results.push(this._formBuilder.group({
              winner: ['']
            }));
          }

        }
    this.loadingService.hide();
    }
  }

  }
