import { Injectable } from '@angular/core';
import { Supplier } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private readonly STORAGE_KEY = 'micolmado_suppliers';

  getAll(): Supplier[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];

    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(this.isSupplierCandidate);
    } catch (error) {
      console.error('Failed to parse suppliers from storage', error);
      return [];
    }
  }

  saveAll(suppliers: Supplier[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(suppliers));
  }

  addSupplier(
    name: string,
    contact: string,
    description: string,
    note?: string
  ): Supplier {
    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanDescription = description.trim();

    if (!cleanName || !cleanContact || !cleanDescription) {
      throw new Error('Nombre, contacto y descripción son obligatorios.');
    }

    const suppliers = this.getAll();

    const supplier: Supplier = {
      id: Date.now().toString(),
      name: cleanName,
      contact: cleanContact,
      description: cleanDescription,
      note: note?.trim() || undefined,
      isActive: true,
    };

    suppliers.push(supplier);
    this.saveAll(suppliers);
    return supplier;
  }

  updateSupplier(updated: Supplier): void {
    const suppliers = this.getAll();
    const index = suppliers.findIndex((s) => s.id === updated.id);
    if (index === -1) return;
    suppliers[index] = updated;
    this.saveAll(suppliers);
  }

  toggleActive(id: string): void {
    const suppliers = this.getAll();
    const index = suppliers.findIndex((s) => s.id === id);
    if (index === -1) return;
    suppliers[index].isActive = !suppliers[index].isActive;
    this.saveAll(suppliers);
  }

  private isSupplierCandidate(value: unknown): value is Supplier {
    if (!value || typeof value !== 'object') return false;
    const s = value as Partial<Supplier>;

    return (
      typeof s.id === 'string' &&
      typeof s.name === 'string' &&
      typeof s.contact === 'string' &&
      typeof s.description === 'string' &&
      typeof s.isActive === 'boolean'
    );
  }
}
