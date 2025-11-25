import { Injectable } from '@angular/core';

import {
  CustomerCreditSummary,
  DailySummary,
  Movement,
  MovementType,
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
      estimatedProfit: totals.totalSales - totals.totalSupplierPayments,
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
    return new Date().toISOString().slice(0, 10);
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
