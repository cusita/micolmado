import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersDebt } from './customers-debt';

describe('CustomersDebt', () => {
  let component: CustomersDebt;
  let fixture: ComponentFixture<CustomersDebt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersDebt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersDebt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
