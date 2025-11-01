import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carsdetails } from './carsdetails';

describe('Carsdetails', () => {
  let component: Carsdetails;
  let fixture: ComponentFixture<Carsdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carsdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carsdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
