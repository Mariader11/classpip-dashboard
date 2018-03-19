import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor} from '@angular/forms';

// Para linkear lo de :id
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//

import { AppConfig } from '../../../app.config';
import { Login, Group, Role, Competition, Journey, Match } from '../../../shared/models/index';
import { LoadingService, UtilsService, GroupService, AlertService, CompetitionService,
JourneyService } from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-league',
  templateUrl: './league.html',
  styleUrls: ['./league.css']
})
export class LeagueComponent implements OnInit {

  id: string;
  competition$: Observable<Competition>;
  competition: Competition;

  journeys: Array<Journey>;
  finishedJourneys = new Array<Journey>();
  journeysFormGroup: FormGroup;
  newJourney: Journey;

  matches = new Array<Match>();
  count: number;


  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public journeyService: JourneyService,
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder) {

      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    // tslint:disable-next-line:no-console
    console.log(this.route);
    this.id = this.route.snapshot.paramMap.get('id');
    // tslint:disable-next-line:no-console
    console.log(this.id);
    this.competition$ = this.competitionService.getCompetition(this.id);
    // tslint:disable-next-line:no-console
    console.log(this.competition$);

    this.competition$.subscribe(
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

      this.journeysFormGroup = this._formBuilder.group({
        id: ['', Validators.required],
        date: ['', Validators.required]
      });


    // Getting competition's journeys
    this.loadingService.show();
    this.journeyService.getJourneysCompetition(this.id).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        for (let _n = 0; _n < this.journeys.length; _n++) {
          this.journeys[_n].completed = false;
          this.journeyService.getMatchesJourney(this.journeys[_n].id).subscribe(
          ((matches: Array<Match>) => {
            this.matches = matches;
            this.count = 0;
            for (let _m = 0; _m < this.matches.length; _m++) {
              if ( this.matches[_m].winner !== 0 ) {
                this.count = this.count + 1;
              }
            }
            if ( this.count === this.matches.length ) {
              this.journeys[_n].completed = true;
            }
            if ( this.journeys[_n].completed === false) {
              this.finishedJourneys.push(this.journeys[_n]);
            }
            // tslint:disable-next-line:no-console
            console.log(this.finishedJourneys);
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

    gotoComponents() {
      this.router.navigate(['/components']);
    }

    onSubmitJourney (value) {
      this.loadingService.show();
      // tslint:disable-next-line:no-console
      console.log(value);
      this.journeyService.putJourney(value)
      .subscribe( (journey => {
        this.newJourney = journey;
        // tslint:disable-next-line:no-console
        console.log(this.newJourney);
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    }

  }

