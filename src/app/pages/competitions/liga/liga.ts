import { Component, OnInit } from '@angular/core';
import { FormsModule, FormControl, Validators } from '@angular/forms'; // añadio no es nesesario


import { Login, Group, Role } from '../../../shared/models/index';
import { AppConfig } from '../../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService } from '../../../shared/services/index';

@Component({
  selector: 'app-liga',
  templateUrl: './liga.html',
  styleUrls: ['./liga.css']
})
export class LigaComponent implements OnInit {

  public teacherr: boolean;
  public studentt: boolean;
  selectedValue: string;
  jornadaControl = new FormControl('', [Validators.required]);

    jornadas = [
      {value: 'Jornada 1', sound: '1'},
      {value: 'Jornada 2', sound: '2'},
      {value: 'Jornada 3', sound: '3'}
    ];

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService) {

      this.teacherr = false;
      this.studentt = false;
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
