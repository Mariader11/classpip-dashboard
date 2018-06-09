import { Component, OnInit  } from '@angular/core';

import {FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor} from '@angular/forms';
import { AlertService, UtilsService, LoadingService, GroupService, CompetitionService,
   JourneyService, TeamService, MatchesService} from '../../../shared/services/index';
import { Login, Role, Group, Competition, Student, Journey, Match, Team } from '../../../shared/models/index';
import { AppConfig } from '../../../app.config';
import { Response } from '@angular/http/src/static_response';


@Component({
  selector: 'app-create-league-competition',
  templateUrl: './create-league-competition.html',
  styleUrls: ['./create-league-competition.css']
})
export class CreateLeagueCompetitionComponent implements OnInit {

  finished = false;
  isLinear = true;

  competitionFormGroup: FormGroup;
  journeysFormGroup: FormGroup;
  participantsFormGroup: FormGroup;
  informationFormGroup: FormGroup;

  groups = [];

  participant: any;
  participants = new Array<any>();
  // forms
  newCompetition: Competition;
  selectedParticipants: Array<number>;
  newJourneys: Array<any>;
  newInformation: string;
  // post
  newCompetitionPost: Competition;
  journeys = new Array();
  //
  count: number;
  count2: number;
  match: any;
  studentBefore: number;


  constructor( public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public matchesService: MatchesService,
    public teamService: TeamService,
    private _formBuilder: FormBuilder) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
   }

  ngOnInit() {

    if (this.utilsService.role === Role.TEACHER) {

      // Defining 3 forms:
    this.competitionFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      groupId: ['', Validators.required],
      mode: ['', Validators.required],
      numJourneys: ['', Validators.required]
    });

    this.participantsFormGroup = this._formBuilder.group({
      participantId: ['']
    });

    this.journeysFormGroup = this._formBuilder.group({
      journeys: this._formBuilder.array([
        this._formBuilder.group({
          date: ['']
        })
      ])
    });

    this.informationFormGroup = this._formBuilder.group({
      information: ['']
    });

    // Getting teacher's group
      this.loadingService.show();
      this.groupService.getMyGroups().subscribe(
        ((groups: Array<Group>) => {
          this.groups = groups;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }


  // FIRST FORM: COMPETITION
  competitionStep(value: Competition) {
    this.loadingService.show();
    this.newCompetition = value;
    this.newCompetition.type = 'Liga';
    this.getParticipants(); // getting participants for the next step
  }

  getParticipants(): void {
    if ( this.newCompetition.mode === 'Individual' ) {
      this.groupService.getMyGroupStudents(this.newCompetition.groupId).subscribe(
      ( (students: Array<Student>) => {
        for (let _n = 0; _n < students.length; _n++) {
         this.participant = {
          id: students[_n].id,
          name:  students[_n].name,
          surname: students[_n].surname,
          selected: false
          };
          this.participants.push(this.participant);
        }
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
      } else {
        this.groupService.getGroupTeams(this.newCompetition.groupId).subscribe(
        ( (teams: Array<Team>) => {
          for (let _a = 0; _a < teams.length; _a++) {
              this.participant = {
                id: teams[_a].id,
                name: teams[_a].name,
                surname: '',
                selected: false
                };
             this.participants.push(this.participant);
          }
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
  }

  participantStep(list) {
    this.loadingService.show();
    this.selectedParticipants = list.selectedOptions.selected.map(item => item.value);
    // Add the journeys to the next step
    for (let _n = 0; _n < this.newCompetition.numJourneys - 1; _n++) {
      let journeys = <FormArray>this.journeysFormGroup.get('journeys');
      journeys.push(this._formBuilder.group({
       date: ['']
      }));
    }

    // tslint:disable-next-line:no-console
    console.log(this.journeysFormGroup);
    this.loadingService.hide();
  }

  // SECOND FORM: JOURNEYS
  journeyStep(value) {
    this.loadingService.show();
    this.newJourneys = value.journeys;
    this.loadingService.hide();
  }

  // THIRD FORM: INFORMATION
  informationStep(value: Competition) {
    this.loadingService.show();
    this.newInformation = value.information;
    // tslint:disable-next-line:no-console
    console.log(this.newInformation);
    this.onSubmitCompetition();
  }

  onSubmitCompetition(): void {
    this.newCompetition.information = this.newInformation;
    this.competitionService.postCompetition(this.newCompetition)
    .subscribe( (competition => {
      this.newCompetitionPost = competition;
      this.onSubmitJourneys();
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));
  }

  onSubmitJourneys(): void {
    // Adding to the journeys: number and competitionId
    for ( let _n = 0; _n < this.newCompetition.numJourneys; _n++) {
      this.newJourneys[_n].number = _n + 1;
      this.newJourneys[_n].competitionId = +this.newCompetitionPost.id;
      if ( this.newJourneys[_n].date === '' ) {
        this.newJourneys[_n].date = null;
      }
    }
    // POST JOURNEYS
    for (let _a = 0; _a < this.newJourneys.length; _a++) {
      this.journeyService.postJourney(this.newJourneys[_a])
      .subscribe( (journey => {
       this.journeys.push(journey);
       if (this.journeys.length === this.newJourneys.length) {
         // ordenar ascendentemente las jornadas por su number
         this.journeys.sort(function (a, b) {
          return (a.number - b.number);
         });
        this.onSubmitRelations();
       }
      }),
       ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }
  }

  onSubmitRelations(): void {
    this.count = 0;
        if ( this.newCompetition.mode === 'Individual' ) {
          for ( let _i = 0; _i < this.selectedParticipants.length; _i++ ) {
            this.competitionService.relCompetitionStudent(this.newCompetitionPost.id, this.selectedParticipants[_i]).subscribe(
              ( res => {
                this.count++;
                if ( this.count === this.selectedParticipants.length ) { this.league(); }
              }),
              ((error: Response) => {
                this.loadingService.hide();
                this.alertService.show(error.toString());
              }));
          }
        } else {
          for ( let _i = 0; _i < this.selectedParticipants.length; _i++ ) {
            this.teamService.relCompetitionTeam(this.newCompetitionPost.id, this.selectedParticipants[_i]).subscribe(
              ( res => {
                this.count++;
                if ( this.count === this.selectedParticipants.length ) { this.league(); }
              }),
              ((error: Response) => {
                this.loadingService.hide();
                this.alertService.show(error.toString());
              }));
          }
        }
  }

  league(): void {
    // adding ghost participant
    if (this.selectedParticipants.length % 2 !== 0) {
      this.selectedParticipants.push(0);
    }
    this.selectedParticipants = this.selectedParticipants.sort(function() {return Math.random() - 0.5});
  // Matches
  this.count2 = 0;
   for (let _j = 0; _j < this.journeys.length; _j++) {
    for (let _m = 0; _m < (this.selectedParticipants.length / 2); _m++) {
      this.match = {
        playerOne : +this.selectedParticipants[_m],
        playerTwo : +this.selectedParticipants[this.selectedParticipants.length - 1 - _m],
        journeyId : +this.journeys[_j].id
      };
        // POST MATCHES
        this.matchesService.postMatch(this.match)
        .subscribe( (match => {
          this.count2++;
          if ( this.count2 === (this.journeys.length * (this.selectedParticipants.length / 2)) ) {
            this.finished = true;
            this.loadingService.hide();
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }

    // Cambiamos las posiciones de los participantes en el vector de selectedParticipants
    this.studentBefore =  this.selectedParticipants[1];
    for (let _s = 1; _s < (this.selectedParticipants.length - 1); _s++) {
      this.selectedParticipants[_s] = this.selectedParticipants[_s + 1];
    }
    this.selectedParticipants[this.selectedParticipants.length - 1] = this.studentBefore;
   }
}

}
