import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalOffersComponent } from './historical-offers.component';

describe('HistoricalOffersComponent', () => {
  let component: HistoricalOffersComponent;
  let fixture: ComponentFixture<HistoricalOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
