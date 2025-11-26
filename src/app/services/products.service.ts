import { Injectable } from '@angular/core';
import { Product } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
	private readonly STORAGE_KEY = 'micolmado_products';

	getAll(): Product[] {
		const raw = localStorage.getItem(this.STORAGE_KEY);
		if (!raw) {
			return [];
		}

		try {
			const data = JSON.parse(raw);
			if (!Array.isArray(data)) {
				return [];
			}
			return data.filter(this.isProductCandidate);
		} catch (error) {
			console.error('Failed to parse products from storage', error);
			return [];
		}
	}

	saveAll(products: Product[]): void {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
	}

	addProduct(
		name: string,
		basePrice: number,
		markupPercent: number,
		category?: string
	): Product {
		const salePrice = this.calculateSalePrice(basePrice, markupPercent);

		const product: Product = {
			id: Date.now().toString(),
			name: name.trim(),
			category: category?.trim() || undefined,
			basePrice,
			markupPercent,
			salePrice,
			isActive: true,
		};

		const products = this.getAll();
		products.push(product);
		this.saveAll(products);

		return product;
	}

	updateProduct(updated: Product): void {
		const products = this.getAll();
		const index = products.findIndex((p) => p.id === updated.id);
		if (index === -1) return;

		products[index] = {
			...updated,
			salePrice: this.calculateSalePrice(
				updated.basePrice,
				updated.markupPercent
			),
		};
		this.saveAll(products);
	}

	toggleActive(id: string): void {
		const products = this.getAll();
		const index = products.findIndex((p) => p.id === id);
		if (index === -1) return;

		products[index].isActive = !products[index].isActive;
		this.saveAll(products);
	}

	private calculateSalePrice(basePrice: number, markupPercent: number): number {
		return Math.round(basePrice * (1 + markupPercent / 100));
	}

	private isProductCandidate(value: unknown): value is Product {
		if (!value || typeof value !== 'object') {
			return false;
		}
		const candidate = value as Partial<Product>;

		const hasRequired =
			typeof candidate.id === 'string' &&
			typeof candidate.name === 'string' &&
			typeof candidate.basePrice === 'number' &&
			typeof candidate.markupPercent === 'number' &&
			typeof candidate.salePrice === 'number' &&
			typeof candidate.isActive === 'boolean';

		return hasRequired;
	}
}
