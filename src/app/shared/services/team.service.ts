import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { GroupService } from './group.service';
import {CompetitionService} from './competition.service';
import { AppConfig } from '../../app.config';
import { Competition, Teacher, Student, Group, Matter, Grade, Team, Match } from '../models/index';

@Injectable()
export class TeamService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public gradeService: GradeService,
    public matterService: MatterService,
    public competitionService: CompetitionService) { }

  public postTeam (team: Team): Observable<Team> {

    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.post(AppConfig.TEAM_URL, team, options)
    .map((response: Response, index: number) => Team.toObject(response.json()))
    .catch((error: Response) => this.utilsService.handleAPIError(error));
                   }

   public getTeamsCompetition(competitionId: number | string): Observable<Array<Team>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });
        return this.http.get(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.TEAMS_URL, options)
           .map((response: Response, index: number) => Team.toObjectArray(response.json()));
      }

      public getStudentsTeam(teamId: number): Observable<Array<Student>> {

       const options: RequestOptions = new RequestOptions({
         headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
        });
       return this.http.get(AppConfig.TEAM_URL + '/' + teamId + AppConfig.STUDENTS_URL, options)
         .map((response: Response, index: number) => Student.toObjectArray(response.json()));
       }

       public getTeamsStudent(studentId: number): Observable<Array<Team>> {

        const options: RequestOptions = new RequestOptions({
          headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
         });
        return this.http.get(AppConfig.STUDENT_URL + '/' + studentId + AppConfig.TEAMS_URL, options)
          .map((response: Response, index: number) => Team.toObjectArray(response.json()));
        }

    public getCompetitionsTeam(teamId: number): Observable<Array<Competition>> {
       const options: RequestOptions = new RequestOptions({
         headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
       });
     return this.http.get(AppConfig.TEAM_URL + '/' + teamId + AppConfig.COMPETITIONS_URL, options)
     .map((response: Response, index: number) => Competition.toObjectArray(response.json()));
    }

  public relTeamStudent (teamId: string | number, studentId: string | number): Observable<Response> {

    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });

       return this.http.put(AppConfig.TEAM_URL + '/' + teamId + AppConfig.STUDENTS_URL
         + AppConfig.REL_URL + '/' + studentId, Response , options)
          .map((response: Response) => response.json())
          .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

   public relCompetitionTeam (competitionId: string | number, teamId: string | number): Observable<Response> {

      const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      return this.http.put(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.TEAMS_URL
       + AppConfig.REL_URL + '/' + teamId, Response , options)
        .map((response: Response) => response.json())
        .catch((error: Response) => this.utilsService.handleAPIError(error));
   }

}
