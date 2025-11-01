import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brandslist } from './brandslist';

describe('Brandslist', () => {
  let component: Brandslist;
  let fixture: ComponentFixture<Brandslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brandslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brandslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
