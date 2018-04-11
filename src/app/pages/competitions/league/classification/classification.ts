import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.html',
  styleUrls: ['./classification.css']
})
export class ClassificationComponent implements OnInit {

  even: boolean;

  constructor() { }

  ngOnInit() {

    if (3 % 2 === 0 ) {
      this.even = true;
     } else {
      this.even = false;
    }
    // tslint:disable-next-line:no-console
    console.log(this.even);
  }



}
