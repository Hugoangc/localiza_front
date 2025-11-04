import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acessorieslist } from './acessorieslist';

describe('Acessorieslist', () => {
  let component: Acessorieslist;
  let fixture: ComponentFixture<Acessorieslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acessorieslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acessorieslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
