import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkoutsdetails } from './checkoutsdetails';

describe('Checkoutsdetails', () => {
  let component: Checkoutsdetails;
  let fixture: ComponentFixture<Checkoutsdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkoutsdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Checkoutsdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
