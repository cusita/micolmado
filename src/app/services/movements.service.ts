import { Injectable } from '@angular/core';

import {
  CustomerCreditSummary,
  DailySummary,
  MonthlySummary,
  Movement,
  MovementType,
  YearlySummary,
} from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class MovementsService {
  private readonly STORAGE_KEY = 'micolmado_movements';

  getAll(): Movement[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data.filter(this.isMovementCandidate) : [];
    } catch (error) {
      console.error('Failed to parse movements from storage', error);
      return [];
    }
  }

  saveAll(movements: Movement[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(movements));
  }

  addSale(amount: number, note?: string): Movement {
    return this.persistMovement({
      type: 'SALE',
      amount,
      note,
    });
  }

  addCreditSale(amount: number, customerName: string, note?: string): Movement {
    return this.persistMovement({
      type: 'CREDIT_SALE',
      amount,
      customerName,
      note,
    });
  }

  addCreditPayment(amount: number, customerName: string, note?: string): Movement {
    return this.persistMovement({
      type: 'CREDIT_PAYMENT',
      amount,
      customerName,
      note,
    });
  }

  addSupplierPayment(amount: number, supplierName: string, note?: string): Movement {
    return this.persistMovement({
      type: 'SUPPLIER_PAYMENT',
      amount,
      supplierName,
      note,
    });
  }

  getDailySummary(date: string): DailySummary {
    const movements = this.getAll().filter((movement) => movement.date === date);
    const totals = movements.reduce(
      (acc, movement) => {
        switch (movement.type) {
          case 'SALE':
            acc.totalSales += movement.amount;
            break;
          case 'CREDIT_SALE':
            acc.totalCreditSales += movement.amount;
            break;
          case 'CREDIT_PAYMENT':
            acc.totalCreditPayments += movement.amount;
            break;
          case 'SUPPLIER_PAYMENT':
            acc.totalSupplierPayments += movement.amount;
            break;
        }
        return acc;
      },
      {
        totalSales: 0,
        totalCreditSales: 0,
        totalCreditPayments: 0,
        totalSupplierPayments: 0,
      }
    );

    return {
      date,
      ...totals,
      estimatedProfit:
        totals.totalSales + totals.totalCreditPayments - totals.totalSupplierPayments,
    };
  }

  getCustomersWithDebt(): CustomerCreditSummary[] {
    const movements = this.getAll();

    const map = new Map<string, { totalCredit: number; totalPayments: number }>();

    for (const movement of movements) {
      // solo nos interesan movimientos con cliente
      if (!movement.customerName) {
        continue;
      }

      if (!map.has(movement.customerName)) {
        map.set(movement.customerName, { totalCredit: 0, totalPayments: 0 });
      }

      const entry = map.get(movement.customerName)!;

      switch (movement.type) {
        case 'CREDIT_SALE':
          entry.totalCredit += movement.amount;
          break;
        case 'CREDIT_PAYMENT':
          entry.totalPayments += movement.amount;
          break;
      }
    }

    // convertir el mapa a arreglo y calcular balance
    const result: CustomerCreditSummary[] = [];

    for (const [customerName, { totalCredit, totalPayments }] of map.entries()) {
      const balance = totalCredit - totalPayments;

      // solo mostrar clientes que aún deben algo
      if (balance > 0) {
        result.push({
          customerName,
          totalCredit,
          totalPayments,
          balance,
        });
      }
    }

    // opcional: ordenar de mayor a menor deuda
    result.sort((a, b) => b.balance - a.balance);

    return result;
  }

  getTodaySummary(): DailySummary {
    return this.getDailySummary(this.getToday());
  }

  getMonthlySummariesForYear(year: number): MonthlySummary[] {
    const movements = this.getAll().filter((m) => {
      const movementYear = Number(m.date.slice(0, 4));
      return movementYear === year;
    });

    const map = new Map<
      number,
      {
        totalSales: number;
        totalCreditSales: number;
        totalCreditPayments: number;
        totalSupplierPayments: number;
      }
    >();

    for (const m of movements) {
      const month = Number(m.date.slice(5, 7)); // 1-12

      if (!map.has(month)) {
        map.set(month, {
          totalSales: 0,
          totalCreditSales: 0,
          totalCreditPayments: 0,
          totalSupplierPayments: 0,
        });
      }

      const acc = map.get(month)!;

      switch (m.type) {
        case 'SALE':
          acc.totalSales += m.amount;
          break;
        case 'CREDIT_SALE':
          acc.totalCreditSales += m.amount;
          break;
        case 'CREDIT_PAYMENT':
          acc.totalCreditPayments += m.amount;
          break;
        case 'SUPPLIER_PAYMENT':
          acc.totalSupplierPayments += m.amount;
          break;
      }
    }

    const result: MonthlySummary[] = [];

    for (const [month, totals] of map.entries()) {
      result.push({
        year,
        month,
        ...totals,
        estimatedProfit:
          totals.totalSales + totals.totalCreditPayments - totals.totalSupplierPayments,
      });
    }

    // ordenar por mes
    result.sort((a, b) => a.month - b.month);

    return result;
  }

  getYearlySummaries(): YearlySummary[] {
    const movements = this.getAll();

    const map = new Map<
      number,
      {
        totalSales: number;
        totalCreditSales: number;
        totalCreditPayments: number;
        totalSupplierPayments: number;
      }
    >();

    for (const m of movements) {
      const year = Number(m.date.slice(0, 4));

      if (!map.has(year)) {
        map.set(year, {
          totalSales: 0,
          totalCreditSales: 0,
          totalCreditPayments: 0,
          totalSupplierPayments: 0,
        });
      }

      const acc = map.get(year)!;

      switch (m.type) {
        case 'SALE':
          acc.totalSales += m.amount;
          break;
        case 'CREDIT_SALE':
          acc.totalCreditSales += m.amount;
          break;
        case 'CREDIT_PAYMENT':
          acc.totalCreditPayments += m.amount;
          break;
        case 'SUPPLIER_PAYMENT':
          acc.totalSupplierPayments += m.amount;
          break;
      }
    }

    const result: YearlySummary[] = [];

    for (const [year, totals] of map.entries()) {
      result.push({
        year,
        ...totals,
        estimatedProfit:
          totals.totalSales + totals.totalCreditPayments - totals.totalSupplierPayments,
      });
    }

    // ordenar por año ascendente
    result.sort((a, b) => a.year - b.year);

    return result;
  }

  getAvailableYears(): number[] {
    const movements = this.getAll();
    const years = new Set<number>();

    for (const m of movements) {
      if (m.date && m.date.length >= 4) {
        years.add(Number(m.date.slice(0, 4)));
      }
    }

    return Array.from(years).sort((a, b) => a - b);
  }

  getDailySummariesForMonth(year: number, month: number): DailySummary[] {
    const movements = this.getAll().filter((m) => {
      if (!m.date) return false;
      const y = Number(m.date.slice(0, 4));
      const mo = Number(m.date.slice(5, 7)); // 1-12
      return y === year && mo === month;
    });

    const map = new Map<
      string,
      {
        totalSales: number;
        totalCreditSales: number;
        totalCreditPayments: number;
        totalSupplierPayments: number;
      }
    >();

    for (const m of movements) {
      const date = m.date; // 'YYYY-MM-DD'

      if (!map.has(date)) {
        map.set(date, {
          totalSales: 0,
          totalCreditSales: 0,
          totalCreditPayments: 0,
          totalSupplierPayments: 0,
        });
      }

      const acc = map.get(date)!;

      switch (m.type) {
        case 'SALE':
          acc.totalSales += m.amount;
          break;
        case 'CREDIT_SALE':
          acc.totalCreditSales += m.amount;
          break;
        case 'CREDIT_PAYMENT':
          acc.totalCreditPayments += m.amount;
          break;
        case 'SUPPLIER_PAYMENT':
          acc.totalSupplierPayments += m.amount;
          break;
      }
    }

    const result: DailySummary[] = [];

    for (const [date, totals] of map.entries()) {
      result.push({
        date,
        ...totals,
        // usa la misma fórmula que uses en getDailySummary
        estimatedProfit:
          totals.totalSales + totals.totalCreditPayments - totals.totalSupplierPayments,
      });
    }

    // ordenar por fecha ascendente
    result.sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  private persistMovement(data: Omit<Movement, 'id' | 'date'> & { type: MovementType }): Movement {
    const movement: Movement = {
      id: Date.now().toString(),
      date: this.getToday(),
      ...data,
    };
    const movements = this.getAll();
    movements.push(movement);
    this.saveAll(movements);
    return movement;
  }

  private getToday(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 01-12
    const day = String(d.getDate()).padStart(2, '0'); // 01-31
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }

  private isMovementCandidate(value: unknown): value is Movement {
    if (!value || typeof value !== 'object') {
      return false;
    }
    const candidate = value as Partial<Movement>;
    const hasRequiredFields =
      typeof candidate.id === 'string' &&
      typeof candidate.date === 'string' &&
      typeof candidate.type === 'string' &&
      typeof candidate.amount === 'number' &&
      Number.isFinite(candidate.amount);
    const validTypes: MovementType[] = [
      'SALE',
      'CREDIT_SALE',
      'CREDIT_PAYMENT',
      'SUPPLIER_PAYMENT',
    ];
    return hasRequiredFields && validTypes.includes(candidate.type as MovementType);
  }
}
