import { Component, OnInit } from '@angular/core';

// Para linkear lo de :id
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//

import { AppConfig } from '../../../app.config';
import { Login, Group, Role, Competition } from '../../../shared/models/index';
import { LoadingService, UtilsService, GroupService, AlertService, CompetitionService } from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-league',
  templateUrl: './league.html',
  styleUrls: ['./league.css']
})
export class LeagueComponent implements OnInit {

  id: string;
  competition$: Observable<Competition>;
  competition: Competition;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private competitionService: CompetitionService) {

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

    }
    gotoComponents() {
      this.router.navigate(['/components']);
    }

  }

