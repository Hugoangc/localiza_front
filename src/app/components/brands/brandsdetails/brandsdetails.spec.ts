import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brandsdetails } from './brandsdetails';

describe('Brandsdetails', () => {
  let component: Brandsdetails;
  let fixture: ComponentFixture<Brandsdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brandsdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brandsdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
