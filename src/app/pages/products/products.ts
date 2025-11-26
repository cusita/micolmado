import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/movement.model';
import { SearchFilter } from '../../shared/components/search-filter/search-filter';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SearchFilter],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  products: Product[] = [];
  form: FormGroup;
  private allProducts: Product[] = [];

  constructor(private readonly fb: FormBuilder, private readonly productsService: ProductsService) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: [''],
      basePrice: [0, [Validators.required, Validators.min(1)]],
      markupPercent: [30, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  get basePriceInvalid(): boolean {
    const control = this.form.get('basePrice');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get nameInvalid(): boolean {
    const control = this.form.get('name');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  loadProducts(): void {
    this.allProducts = this.productsService.getAll();
    this.products = this.productsService.getAll();
  }

  addProduct(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, category, basePrice, markupPercent } = this.form.getRawValue();

    this.productsService.addProduct(
      name,
      Number(basePrice),
      Number(markupPercent),
      category || undefined
    );

    this.form.reset({
      name: '',
      category: '',
      basePrice: 0,
      markupPercent: 30,
    });

    this.loadProducts();
  }

  updateProduct(product: Product, field: 'basePrice' | 'markupPercent', value: string): void {
    const num = Number(value);
    if (Number.isNaN(num) || num < 0) {
      return;
    }

    const updated: Product = {
      ...product,
      [field]: num,
    };

    this.productsService.updateProduct(updated);
    this.loadProducts();
  }

  toggleActive(product: Product): void {
    this.productsService.toggleActive(product.id);
    this.loadProducts();
  }

  onSearchProducts(term: string): void {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.products = this.allProducts.slice();
      return;
    }

    this.products = this.allProducts.filter((p) => {
      return (
        p.name.toLowerCase().includes(value) || (p.category?.toLowerCase().includes(value) ?? false)
      );
    });
  }
}
