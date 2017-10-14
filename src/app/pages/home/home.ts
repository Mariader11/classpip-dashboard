import { Component, OnInit } from '@angular/core';
import { School, Role, Login, Profile } from '../../shared/models/index';
import { UtilsService, SchoolService, AlertService, LoadingService, UserService } from '../../shared/services/index';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  public profile: Profile;
  public school: School;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public loadingService: LoadingService,
    public userService: UserService
  ) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

    this.loadingService.show();
    this.userService.getMyProfile().subscribe(
      ((profile: Profile) => {
        this.profile = profile;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    if (this.utilsService.role === Role.TEACHER) {

      this.schoolService.getMySchool().subscribe(
        ((school: School) => {
          this.loadingService.hide();
          this.school = school;
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
}
