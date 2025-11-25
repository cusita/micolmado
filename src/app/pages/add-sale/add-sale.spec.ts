import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSale } from './add-sale';

describe('AddSale', () => {
  let component: AddSale;
  let fixture: ComponentFixture<AddSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
