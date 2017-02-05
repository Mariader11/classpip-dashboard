import { Component, OnInit } from '@angular/core';

import { AngularService } from '../_services/index';

@Component({
  selector: 'app-students-root',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  constructor(public angularService: AngularService) { }

  ngOnInit() {
    this.angularService.enableMenu();
  }
}
