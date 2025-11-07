import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cartslist } from './cartslist';

describe('Cartslist', () => {
  let component: Cartslist;
  let fixture: ComponentFixture<Cartslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cartslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cartslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
