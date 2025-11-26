export type MovementType = 'SALE' | 'CREDIT_SALE' | 'CREDIT_PAYMENT' | 'SUPPLIER_PAYMENT';

export interface Movement {
  id: string;
  date: string;
  type: MovementType;
  amount: number;
  customerName?: string;
  supplierName?: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  basePrice: number;
  markupPercent: number;
  salePrice: number;
  isActive: boolean;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalCreditSales: number;
  totalCreditPayments: number;
  totalSupplierPayments: number;
  estimatedProfit: number;
}

export interface CustomerCreditSummary {
  customerName: string;
  totalCredit: number;
  totalPayments: number;
  balance: number;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  basePrice: number; // precio de costo
  markupPercent: number; // % de ganancia
  salePrice: number; // precio de venta calculado
  isActive: boolean;
}

export interface Client {
  id: string;
  code: string; // número de cliente (puede ser 001, 002, etc)
  name: string;
  note?: string; // dirección / referencia / apodo / descripción
  isActive: boolean;
}
export interface MonthlySummary {
  year: number;
  month: number; // 1 - 12
  totalSales: number;
  totalCreditSales: number;
  totalCreditPayments: number;
  totalSupplierPayments: number;
  estimatedProfit: number;
}

export interface YearlySummary {
  year: number;
  totalSales: number;
  totalCreditSales: number;
  totalCreditPayments: number;
  totalSupplierPayments: number;
  estimatedProfit: number;
}

export type SearchItemId = string | number;

export interface SearchItem<T = any> {
  id: SearchItemId;
  label: string; // lo que se muestra en grande
  sublabel?: string; // info extra (nota, referencia, etc.)
  payload: T; // el objeto original (cliente, artículo, etc.)
}

export interface Supplier {
  id: string;
  name: string;
  contact: string; // teléfono, whatsapp, correo...
  description: string; // qué provee (ej: huevos, arroz, refrescos)
  note?: string; // nota opcional (paga tarde, trae fiado, etc.)
  isActive: boolean;
}
