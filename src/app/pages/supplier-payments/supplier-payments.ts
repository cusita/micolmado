import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { Movement } from '../../models/movement.model';

@Component({
  selector: 'app-supplier-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './supplier-payments.html',
  styleUrl: './supplier-payments.scss',
})
export class SupplierPayments implements OnInit {
  form: FormGroup;
  recentPayments: Movement[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly movements: MovementsService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      supplierName: ['', [Validators.required, Validators.minLength(2)]],
      amount: [0, [Validators.required, Validators.min(1)]],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.loadRecentPayments();
  }

  get supplierInvalid(): boolean {
    const c = this.form.get('supplierName');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get amountInvalid(): boolean {
    const c = this.form.get('amount');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { supplierName, amount, note } = this.form.getRawValue();

    this.movements.addSupplierPayment(
      Number(amount),
      supplierName.trim(),
      note || undefined
    );

    alert('Pago a proveedor registrado.');

    this.form.reset({
      supplierName: '',
      amount: 0,
      note: '',
    });

    this.loadRecentPayments();
  }

  loadRecentPayments(): void {
    const all = this.movements.getAll();
    this.recentPayments = all
      .filter((m) => m.type === 'SUPPLIER_PAYMENT')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10); // últimos 10 pagos
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
