import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import { AlertService, UtilsService, LoadingService, GroupService,
        CompetitionService, TeamService} from '../../shared/services/index';
import { Login, Role, Group, Student, Team } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.html',
  styleUrls: ['./create-teams.scss']
})
export class CreateTeamsComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  groups = [];
  groupId: string;
  team: any;
  teams = new Array();

  students = new Array<Student>();
  numStudents: number;

  relTeamStudent: Response;

  show = 1;

  constructor( public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public teamService: TeamService,
    private _formBuilder: FormBuilder) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
     }

  ngOnInit() {

    if (this.utilsService.role === Role.TEACHER) {

    this.firstFormGroup = this._formBuilder.group({
      groupId: ['', Validators.required],
      teams: this._formBuilder.array([
        this._formBuilder.group({
          name: ['', Validators.required]
        })
      ])
    });
    // tslint:disable-next-line:no-console
    console.log(this.firstFormGroup);

    this.secondFormGroup = this._formBuilder.group({
      teamsId: this._formBuilder.array([
        this._formBuilder.group({
          teamId: ['', Validators.required]
        })
      ])
    });
       // tslint:disable-next-line:no-console
       console.log(this.secondFormGroup);

    let teams = <FormArray>this.firstFormGroup.get('teams');
    teams.push(this._formBuilder.group({
      name: ['', Validators.required]
    }));

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

  onSubmit(value: any) {

    this.loadingService.show();
    this.groupId = value.groupId;
    // tslint:disable-next-line:no-console
    console.log(value);

        for (let _m = 0; _m < (value.teams.length); _m++) {
         this.team = {
          name: value.teams[_m].name,
          teacherId : this.utilsService.currentUser.userId,
          groupId : value.groupId
          };
          this.teamService.postTeam(this.team)
          .subscribe( (team => {
           this.teams.push(team);
           if ( this.teams.length === value.teams.length - 1 ) {
            this.show = this.show + 1;
              // tslint:disable-next-line:no-console
              console.log(this.teams);
           }
           this.loadingService.hide();
            }),
           ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
            }));
        }


        // GET STUDENTS of the group
      this.groupService.getMyGroupStudents(this.groupId).subscribe(
      ( (students: Array<Student>) => {
        this.students = students;
        this.numStudents = this.students.length;
        // tslint:disable-next-line:no-console
        console.log(this.students);
        for (let _n = 0; _n < this.numStudents - 1; _n++) {
          let teamsId = <FormArray>this.secondFormGroup.get('teamsId');
          teamsId.push(this._formBuilder.group({
            teamId: ['', Validators.required]
          }));
        }
        this.show = this.show + 1;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

  }

  onSubmit2(value: any) {

    this.loadingService.show();

      for ( let _s = 0; _s < this.numStudents; _s++ ) {
      this.teamService.relTeamStudent(value.teamsId[_s].teamId, this.students[_s].id).subscribe(
        ( res => {
          this.relTeamStudent = res;
          if ( _s === this.numStudents - 1 ) {

              // aqui


            this.show = this.show + 1;
           }
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }

  }
  removeTeam(i) {
    let teams = <FormArray>this.firstFormGroup.get('teams');
    teams.removeAt(i);
  }

  addTeam() {
    let teams = <FormArray>this.firstFormGroup.get('teams');
    teams.push(this._formBuilder.group({
      name: ['', Validators.required]
    }));
  }

  getValue(i: number) {
    return (this.students[i].name);
  }

}
