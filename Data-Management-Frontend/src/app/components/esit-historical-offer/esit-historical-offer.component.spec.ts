import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsitHistoricalOfferComponent } from './esit-historical-offer.component';

describe('EsitHistoricalOfferComponent', () => {
  let component: EsitHistoricalOfferComponent;
  let fixture: ComponentFixture<EsitHistoricalOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsitHistoricalOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsitHistoricalOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
