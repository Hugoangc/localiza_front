import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cartsdetails } from './cartsdetails';

describe('Cartsdetails', () => {
  let component: Cartsdetails;
  let fixture: ComponentFixture<Cartsdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cartsdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cartsdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
