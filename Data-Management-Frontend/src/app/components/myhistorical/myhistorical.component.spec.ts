import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyhistoricalComponent } from './myhistorical.component';

describe('MyhistoricalComponent', () => {
  let component: MyhistoricalComponent;
  let fixture: ComponentFixture<MyhistoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyhistoricalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyhistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
