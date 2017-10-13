import { NgModule } from '@angular/core';
import {
  MatToolbarModule, MatInputModule, MatButtonModule, MatMenuModule,
  MatSelectModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule,
  MatProgressBarModule, MatSnackBarModule, MatListModule, MatIconModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    MatToolbarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    RouterModule,
    CommonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatListModule,
    MatIconModule
  ],
})
export class AppMaterialModule { }
