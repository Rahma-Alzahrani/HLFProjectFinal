import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalRequestsComponent } from './historical-requests.component';

describe('HistoricalRequestsComponent', () => {
  let component: HistoricalRequestsComponent;
  let fixture: ComponentFixture<HistoricalRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
