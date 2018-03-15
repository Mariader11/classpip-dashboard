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

   public postJourneyMatches (match: Match): Observable<Match> {

    const options: RequestOptions = new RequestOptions({
       headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });

     return this.http.post(AppConfig.MATCH_URL, match, options)
     .map((response: Response, index: number) => Match.toObject(response.json()))
     .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
