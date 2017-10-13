import { Component, OnInit, NgModule } from '@angular/core';
import { LoadingService } from '../services/index';

@Component({
  selector: 'app-loading',
  template: '<mat-progress-bar mode="indeterminate" color="warn" *ngIf="loading"></mat-progress-bar>'
})
export class LoadingComponent implements OnInit {

  public loading: Boolean;

  constructor(public loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.getLoading().subscribe(
      ((enable: Boolean) => {
        this.loading = enable;
      })
    );
  }
}
