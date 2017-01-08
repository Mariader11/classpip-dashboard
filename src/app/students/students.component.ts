import { Component, OnInit } from '@angular/core';

import { UtilsService } from '../_services/index';

@Component({
  selector: 'app-students-root',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  constructor(private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.enableMenu();
  }
}
