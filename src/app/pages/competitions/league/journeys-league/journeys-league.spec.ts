import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneysLeagueComponent } from './journeys-league';

describe('JourneysLeagueComponent', () => {
  let component: JourneysLeagueComponent;
  let fixture: ComponentFixture<JourneysLeagueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneysLeagueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneysLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
