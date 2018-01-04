import { NgModule } from '@angular/core';
import {
  MatToolbarModule, MatInputModule, MatButtonModule, MatMenuModule,
  MatSelectModule, MatCardModule, MatGridListModule, MatProgressSpinnerModule,
  MatProgressBarModule, MatSnackBarModule, MatListModule, MatIconModule, MatDatepickerModule,
  MatFormFieldModule, MatNativeDateModule, MatDialogModule, MatExpansionModule,
  MatRadioModule, MatStepperModule} from '@angular/material';
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
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatStepperModule
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
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDialogModule,
    MatExpansionModule,
    MatRadioModule,
    MatStepperModule
  ],
})
export class AppMaterialModule { }
