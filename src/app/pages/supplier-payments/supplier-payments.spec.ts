import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPayments } from './supplier-payments';

describe('SupplierPayments', () => {
  let component: SupplierPayments;
  let fixture: ComponentFixture<SupplierPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
