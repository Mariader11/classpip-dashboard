import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from 'ng2-translate';

@Injectable()
export class AlertService {

  constructor(
    public snackBar: MatSnackBar,
    public translateService: TranslateService) { }

  public show(message: string): void {
    this.snackBar.open(message, this.translateService.instant('APP.CANCEL'), {
      duration: 3000,
    });
  }
}
