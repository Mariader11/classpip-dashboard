import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Match } from '../models/index';

@Injectable()
export class MatchesService {

  constructor(public http: Http,
    public utilsService: UtilsService) { }


    public putWinner(winner: Match, matchId: string | number): Observable<Match> {

      const options: RequestOptions = new RequestOptions({
         headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
       });

       return this.http.put(AppConfig.MATCH_URL + '/' + matchId, winner, options)
       .map((response: Response, index: number) => Match.toObject(response.json()))
       .catch((error: Response) => this.utilsService.handleAPIError(error));
    }
}
