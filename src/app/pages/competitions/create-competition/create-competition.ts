import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-create-competition',
  templateUrl: './create-competition.html',
  styleUrls: ['./create-competition.css']
})
export class CreateCompetitionComponent implements OnInit {

  groups = [
    {id: '1', sound: '1'},
    {id: '2', sound: '2'},
    {id: '3', sound: '3'},
    {id: '4', sound: '3'}
  ];

  competitions = [
    {id: '1', type: 'Liga'}

  ];

  constructor() { }

  ngOnInit() {

  }

}
