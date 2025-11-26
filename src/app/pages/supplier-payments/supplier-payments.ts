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
import { Movement, SearchItem, Supplier } from '../../models/movement.model';
import { SuppliersService } from '../../services/suppliers.service';
import { SearchBox } from '../../shared/components/search-box/search-box/search-box';


@Component({
  selector: 'app-supplier-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SearchBox],
  templateUrl: './supplier-payments.html',
  styleUrl: './supplier-payments.scss',
})
export class SupplierPayments implements OnInit {
  form: FormGroup;
  recentPayments: Movement[] = [];

  suppliers: Supplier[] = [];
  supplierItems: SearchItem<Supplier>[] = [];
  selectedSupplier: Supplier | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly movements: MovementsService,
    private readonly suppliersService: SuppliersService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      supplierId: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1)]],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadRecentPayments();
  }

  get supplierInvalid(): boolean {
    const c = this.form.get('supplierId');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get amountInvalid(): boolean {
    const c = this.form.get('amount');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  private loadSuppliers(): void {
    this.suppliers = this.suppliersService
      .getAll()
      .filter((s) => s.isActive);

    this.supplierItems = this.suppliers.map((s) => ({
      id: s.id,
      label: s.name,
      sublabel: s.description || s.contact,
      payload: s,
    }));
  }

  private loadRecentPayments(): void {
    const all = this.movements.getAll();
    this.recentPayments = all
      .filter((m) => m.type === 'SUPPLIER_PAYMENT')
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10);
  }

  // cuando el usuario selecciona un proveedor en el autocomplete
  onSupplierSelected(item: SearchItem<Supplier>): void {
    this.selectedSupplier = item.payload;
    this.form.get('supplierId')?.setValue(item.payload.id);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { supplierId, amount, note } = this.form.getRawValue();
    const supplier = this.suppliers.find((s) => s.id === supplierId);

    if (!supplier) {
      alert('Selecciona un proveedor válido de la lista.');
      return;
    }

    this.movements.addSupplierPayment(
      Number(amount),
      supplier.name, // 👈 ahora el nombre siempre viene de la lista
      note || undefined
    );

    alert('Pago a proveedor registrado.');

    this.form.reset({
      supplierId: '',
      amount: 0,
      note: '',
    });
    this.selectedSupplier = null;

    this.loadRecentPayments();
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}
