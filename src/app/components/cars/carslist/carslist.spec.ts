import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carslist } from './carslist';

describe('Carslist', () => {
  let component: Carslist;
  let fixture: ComponentFixture<Carslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
