import { Component, OnInit} from '@angular/core';


import { Login, Group, Role } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService } from '../../shared/services/index';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.html',
  styleUrls: ['./competitions.css']
})
export class CompetitionsComponent implements OnInit {

  public teacherr: boolean;
  public studentt: boolean;
  public competitionss: boolean;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService) {

      this.teacherr = false;
      this.studentt = false;
      this.competitionss = true;
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    this.loadingService.show();
    if (this.utilsService.role === Role.TEACHER) {
      this.teacherr = true;
    }
    if (this.utilsService.role === Role.STUDENT) {
      this.studentt = true;
    }
    this.loadingService.hide();
  }

}
