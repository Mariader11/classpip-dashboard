import { Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { GroupService } from './group.service';
import { AppConfig } from '../../app.config';
import { Competition, Teacher, Student, Group, Matter, Grade, Team } from '../models/index';


@Injectable()
export class CompetitionService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public gradeService: GradeService,
    public matterService: MatterService) { }

    /**
     * This method returns the list of competitions of
     * the current user logged into the application with
     * the group (grade and matter)
     * @return {Array<Competition>} returns the list of competitions
     */

    public getMyCompetitionsGroup(): Observable<Array<Competition>> {

      const ret: Array<Competition> = new Array<Competition>();

      return Observable.create(observer => {
        this.getCompetitions().subscribe(competitions => {
          competitions.forEach(competition => {
            this.groupService.getGroup(competition.groupId).subscribe(
              group => {
               this.gradeService.getGrade(group.gradeId).subscribe(
                grade => {
                 competition.grade = grade;
                   this.matterService.getMatter(group.matterId).subscribe(
                     matter => {
                      competition.matter = matter;
                       ret.push(competition);
                      if (ret.length === competitions.length) {
                      observer.next(ret);
                      observer.complete();
                    }
                  }, error => observer.error(error));
              }, error => observer.error(error));
            }, error => observer.error(error));
          });
        }, error => observer.error(error));
      });
    }


    /**
     * This method returns the list of competitions of
     * the current user logged into the application
     * @return {Array<Competition>} returns the list of competitions
     */

    private getCompetitions(): Observable<Array<Competition>> {

      const options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      const url: string = this.utilsService.getMyUrl() + AppConfig.COMPETITIONS_URL;

      return this.http.get(url, options)
        .map((response: Response, index: number) => Competition.toObjectArray(response.json()))
        .catch((error: Response) => this.utilsService.handleAPIError(error));

    }


    /**
     * This method returns the number of competitions of
     * the current user logged into the application
     * @return {Object} returns the "Object" with count
     */
    public getCompetitionsCount() {

      const options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      const url: string = this.utilsService.getMyUrl() + AppConfig.COMPETITIONS_URL + AppConfig.COUNT_URL;

      return this.http.get(url, options)
        .map((response: Response) => response.json())
        .catch((error: Response) => this.utilsService.handleAPIError(error));
      }

      public getCompetition(id: number | string): Observable<Competition> {

        const options: RequestOptions = new RequestOptions({
          headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
        });

        return this.http.get(AppConfig.COMPETITION_URL + '/' + id, options)
          .map((response: Response, index: number) => Competition.toObject(response.json()))
          .catch((error: Response) => this.utilsService.handleAPIError(error));
      }

              /** POST: add a new hero to the database */
        public postCompetition (competition: Competition): Observable<Competition> {

          const options: RequestOptions = new RequestOptions({
            headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
          });

           return this.http.post(AppConfig.COMPETITION_URL, competition, options)
          .map((response: Response, index: number) => Competition.toObject(response.json()))
          .catch((error: Response) => this.utilsService.handleAPIError(error));
        }

        public putInformation (information: string, id: string): Observable<Competition> {

          const options: RequestOptions = new RequestOptions({
            headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
          });

           return this.http.put(this.utilsService.getMyUrl() + AppConfig.COMPETITIONS_URL + '/' + id, information, options)
          .map((response: Response, index: number) => Competition.toObject(response.json()))
          .catch((error: Response) => this.utilsService.handleAPIError(error));
        }


        public relCompetitionStudent (competitionId: string | number, studentId: string | number): Observable<Response> {

          const options: RequestOptions = new RequestOptions({
            headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
          });

          return this.http.put(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.STUDENTS_URL
                 + AppConfig.REL_URL + '/' + studentId, Response , options)
                 .map((response: Response) => response.json())
                .catch((error: Response) => this.utilsService.handleAPIError(error));

      }




      // TEAMS


     public postTeam (team: Team): Observable<Team> {

     const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });

     return this.http.post(AppConfig.TEAM_URL, team, options)
     .map((response: Response, index: number) => Team.toObject(response.json()))
     .catch((error: Response) => this.utilsService.handleAPIError(error));
                    }

    public getTeams(): Observable<Array<Team>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });

      const url: string = this.utilsService.getMyUrl() + AppConfig.TEAMS_URL;

      return this.http.get(url, options)
        .map((response: Response, index: number) => Team.toObjectArray(response.json()));
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
