import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTennisCompetitionComponent } from './create-tennis-competition';

describe('CreateTennisComponent', () => {
  let component: CreateTennisCompetitionComponent;
  let fixture: ComponentFixture<CreateTennisCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTennisCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTennisCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
