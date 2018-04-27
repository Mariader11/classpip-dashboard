import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneysTennisComponent } from './journeys-tennis';

describe('JourneysTennisComponent', () => {
  let component: JourneysTennisComponent;
  let fixture: ComponentFixture<JourneysTennisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneysTennisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneysTennisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
