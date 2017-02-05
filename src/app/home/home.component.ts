import { Component, OnInit } from '@angular/core';

import { AppConfig } from '../app.config';
import { LoginLocalStorage } from '../_models/login.local.storage';
import { UserService, UtilsService, SchoolService, GroupService } from 'classpip-utils';
import { Profile, Login, Role, School, Group } from 'classpip-utils';
import { AngularService, AlertService } from '../_services/index';

@Component({
  selector: 'app-home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public profile: Profile;
  public school: School;
  public groups: Array<Group>;

  constructor(
    public angularService: AngularService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public groupService: GroupService,
    public userService: UserService) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit() {
    this.angularService.enableMenu();

    this.userService.getMyProfile().subscribe(
      ((profile: Profile) => this.profile = profile),
      error => this.alertService.error(error));

    if (this.utilsService.role === Role.TEACHER) {
      this.schoolService.getMySchool().subscribe(
        ((school: School) => {
          this.school = school;

          this.groupService.getMyGroups().subscribe(
            ((groups: Array<Group>) => this.groups = groups),
            error => this.alertService.error(error));
        }),
        error => this.alertService.error(error));
    }
  }
}
