import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';

import { AppConfig } from '../../app.config';
import { Competition, Journey, Match } from '../models/index';

@Injectable()
export class JourneyService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
  ) { }


   public postJourney (journey: Journey): Observable<Journey> {

     const options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      return this.http.post(AppConfig.JOURNEY_URL, journey, options)
      .map((response: Response, index: number) => Journey.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
   }

   public putJourney (value): Observable<Journey> {

    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });

       return this.http.put(AppConfig.JOURNEY_URL + '/' + value.id, value , options)
       .map((response: Response, index: number) => Journey.toObject(response.json()))
       .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

   public postJourneyMatches (match: Match): Observable<Match> {

    const options: RequestOptions = new RequestOptions({
       headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });

     return this.http.post(AppConfig.MATCH_URL, match, options)
     .map((response: Response, index: number) => Match.toObject(response.json()))
     .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

    public getJourneysCompetition(idCompetition: string | number): Observable<Array<Journey>> {

      const options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      const url: string = AppConfig.COMPETITION_URL + '/' + idCompetition + AppConfig.JOURNEYS_URL;

      return this.http.get(url, options)
        .map((response: Response, index: number) => Journey.toObjectArray(response.json()));
    }

    public getMatchesJourney(idJourney: string | number): Observable<Array<Match>> {

      const options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      const url: string = AppConfig.JOURNEY_URL + '/' + idJourney + AppConfig.MATCHES_URL;

      return this.http.get(url, options)
        .map((response: Response, index: number) => Match.toObjectArray(response.json()));

    }


}
