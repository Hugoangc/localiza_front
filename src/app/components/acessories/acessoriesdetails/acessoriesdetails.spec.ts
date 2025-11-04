import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acessoriesdetails } from './acessoriesdetails';

describe('Acessoriesdetails', () => {
  let component: Acessoriesdetails;
  let fixture: ComponentFixture<Acessoriesdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acessoriesdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acessoriesdetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
