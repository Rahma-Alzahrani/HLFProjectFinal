import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendHistoricalRequestsComponent } from './send-historical-requests.component';

describe('SendHistoricalRequestsComponent', () => {
  let component: SendHistoricalRequestsComponent;
  let fixture: ComponentFixture<SendHistoricalRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendHistoricalRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendHistoricalRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
