import { Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { GroupService } from './group.service';
import { AppConfig } from '../../app.config';
import { Competition, Teacher, Student, Group, Matter, Grade } from '../models/index';


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
        .map((response: Response, index: number) => Competition.toObjectArray(response.json()));
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
        .map((response: Response) => response.json());
      }

}
