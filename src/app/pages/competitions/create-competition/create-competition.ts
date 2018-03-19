import { Component, OnInit  } from '@angular/core';

import {FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor} from '@angular/forms';
import { AlertService, UtilsService, LoadingService, GroupService, CompetitionService,
   JourneyService } from '../../../shared/services/index';
import { Login, Role, Group, Competition, Student, Journey, Match, Team } from '../../../shared/models/index';
import { AppConfig } from '../../../app.config';
import { Response } from '@angular/http/src/static_response';


@Component({
  selector: 'app-create-competition',
  templateUrl: './create-competition.html',
  styleUrls: ['./create-competition.css']
})
export class CreateCompetitionComponent implements OnInit {

  isLinear = true;
  competitionFormGroup: FormGroup;
  journeysFormGroup: FormGroup;
  participantsFormGroup: FormGroup;
  informationFormGroup: FormGroup;
  selectedParticipants: any;

  types =  [
    {value: 'Liga', viewValue: 'Liga'},
    {value: 'Tenis', viewValue: 'Tenis'}
  ];

  modes =   [
    {value: 'Individual', viewValue: 'Individual'},
    {value: 'Equipos', viewValue: 'Equipos'}
  ];
  groups = [];

  participant: any;
  participants = new Array<any>();

  newCompetition: Competition;
  newInformation: string;

  // Journeys
  journeys = new Array();   // mejor Array<Journey> ?? probar cuando tenga tiempo
  newJourneys: Array<any>;
  students = new Array<Student>();

  // Matches
  match: Match;
  match2: any;
  previousStudents = new Array();
  studentBefore: number;
  //

  newCompetitionPost: Competition;
  newCompetitionPost3: Competition;
  newMatchesJourneys: Match;
  relations: Response;

  constructor( public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    private _formBuilder: FormBuilder) {


      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
   }

  ngOnInit() {

    if (this.utilsService.role === Role.TEACHER) {
      // Defining 3 forms:
    this.competitionFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      groupId: ['', Validators.required],
      mode: ['', Validators.required],
      numJourneys: ['', Validators.required]
    });

    this.journeysFormGroup = this._formBuilder.group({
      journeys: this._formBuilder.array([
        this._formBuilder.group({
          date: ['']
        })
      ])
    });

    this.participantsFormGroup = this._formBuilder.group({
      participantId: ['']
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
  onSubmit(value: Competition) {

    this.loadingService.show();
    this.newCompetition = value;
    this.newCompetition.teacherId = this.utilsService.currentUser.userId;

    // Add the journeys to the next step
    for (let _n = 0; _n < this.newCompetition.numJourneys - 1; _n++) {
      let journeys = <FormArray>this.journeysFormGroup.get('journeys');
      journeys.push(this._formBuilder.group({
        date: ['']
      }));
    }

     // POST COMPETITION

    this.competitionService.postCompetition(this.newCompetition)
    .subscribe( (competition => {
      this.newCompetitionPost = competition;
      this.loadingService.hide();
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));

    // GET STUDENTS SELECTED GROUP ( INDIVIDUAL MODE )

    if ( this.newCompetition.mode === 'Individual' ) {
      this.groupService.getMyGroupStudents(this.newCompetition.groupId).subscribe(
      ( (students: Array<Student>) => {
        this.students = students;
         for (let _n = 0; _n < this.students.length; _n++) {
         this.participant = {
          id: this.students[_n].id,
          name:  this.students[_n].name,
          surname:  this.students[_n].surname,
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

      // GET TEAMS SELECTED GROUP ( TEAM MODE )

      if ( this.newCompetition.mode === 'Equipos' ) {
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
          // tslint:disable-next-line:no-console
          console.log(this.participants);
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
        }
  }


 // SELECTED PARTICIPANTS
  onSubmitParticipants(list) {
    this.selectedParticipants = list.selectedOptions.selected.map(item => item.value);
    // tslint:disable-next-line:no-console
    console.log(this.selectedParticipants);
  }

  // SECOND FORM: JOURNEYS
  onSubmitJourneys (value) {

    this.loadingService.show();
    this.newJourneys = value.journeys;
    // Adding to the journeys: number and competitionId
    for ( let _n = 0; _n < this.newCompetition.numJourneys; _n++) {
      this.newJourneys[_n].number = _n + 1;
      this.newJourneys[_n].competitionId = +this.newCompetitionPost.id;
      if ( this.newJourneys[_n].date === '' ) {
        this.newJourneys[_n].date = null;
      }
     }
      // tslint:disable-next-line:no-console
      console.log(this.newJourneys);

       // POST JOURNEYS
       for (let _a = 0; _a < this.newJourneys.length; _a++) {
       this.journeyService.postJourney(this.newJourneys[_a])
       .subscribe( (journey => {
         this.journeys.push(journey);
         this.loadingService.hide();
       }),
       ((error: Response) => {
         this.loadingService.hide();
         this.alertService.show(error.toString());
       }));
      }

        // relations
    if ( this.newCompetition.mode === 'Individual' ) {
    for ( let _i = 0; _i < this.selectedParticipants.length; _i++ ) {
      this.competitionService.relCompetitionStudent(this.newCompetitionPost.id, this.selectedParticipants[_i]).subscribe(
        ( res => {
          this.relations = res;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  } else {
    for ( let _i = 0; _i < this.selectedParticipants.length; _i++ ) {
      this.competitionService.relCompetitionTeam(this.newCompetitionPost.id, this.selectedParticipants[_i]).subscribe(
        ( res => {
          this.relations = res;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  }

  // THIRD FORM: INFORMATION
  onSubmitInf(value: string) {

    this.loadingService.show();
    this.newInformation = value;
    this.competitionService.putInformation(this.newInformation, this.newCompetitionPost.id)
    .subscribe( (competition => {
      this.newCompetitionPost3 = competition;
      this.loadingService.hide();
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));

    // Matches

    for (let _j = 0; _j < this.journeys.length; _j++) {
      for (let _m = 0; _m < (this.selectedParticipants.length / 2); _m++) {
        this.match2 = {
          playerOne : +this.selectedParticipants[_m],
          playerTwo : +this.selectedParticipants[this.selectedParticipants.length - 1 - _m],
          journeyId : +this.journeys[_j].id
        };
        this.match = this.match2;
          // POST MATCHES
          this.journeyService.postJourneyMatches(this.match)
          .subscribe( (match => {
            this.newMatchesJourneys = match;
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      }

      this.studentBefore =  this.selectedParticipants[1];
      for (let _s = 1; _s < (this.selectedParticipants.length - 1); _s++) {
        this.selectedParticipants[_s] = this.selectedParticipants[_s + 1];
      }
      this.selectedParticipants[this.selectedParticipants.length - 1] = this.studentBefore;
    }
  }

}
