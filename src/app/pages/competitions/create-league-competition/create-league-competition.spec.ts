import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeagueCompetitionComponent } from './create-league-competition';

describe('CreateCompetitionComponent', () => {
  let component: CreateLeagueCompetitionComponent;
  let fixture: ComponentFixture<CreateLeagueCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLeagueCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeagueCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
