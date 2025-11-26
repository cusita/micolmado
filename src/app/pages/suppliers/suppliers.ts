import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SuppliersService } from '../../services/suppliers.service';
import { Supplier } from '../../models/movement.model';
import { SearchFilter } from '../../shared/components/search-filter/search-filter';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SearchFilter],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss',
})
export class Suppliers implements OnInit {
  form: FormGroup;

  private allSuppliers: Supplier[] = [];
  suppliers: Supplier[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly suppliersService: SuppliersService
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.allSuppliers = this.suppliersService.getAll();
    this.suppliers = this.allSuppliers.slice();
  }

  get nameInvalid(): boolean {
    const c = this.form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get contactInvalid(): boolean {
    const c = this.form.get('contact');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get descriptionInvalid(): boolean {
    const c = this.form.get('description');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, contact, description, note } = this.form.getRawValue();

    try {
      this.suppliersService.addSupplier(
        name,
        contact,
        description,
        note || undefined
      );
      this.form.reset({
        name: '',
        contact: '',
        description: '',
        note: '',
      });
      this.loadSuppliers();
    } catch (error: any) {
      alert(error?.message ?? 'No se pudo guardar el proveedor.');
    }
  }

  toggleActive(supplier: Supplier): void {
    this.suppliersService.toggleActive(supplier.id);
    this.loadSuppliers();
  }

  onSearchSuppliers(term: string): void {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.suppliers = this.allSuppliers.slice();
      return;
    }

    this.suppliers = this.allSuppliers.filter((s) => {
      return (
        s.name.toLowerCase().includes(value) ||
        s.contact.toLowerCase().includes(value) ||
        s.description.toLowerCase().includes(value) ||
        (s.note?.toLowerCase().includes(value) ?? false)
      );
    });
  }
}
