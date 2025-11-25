export type MovementType =
	| 'SALE'
	| 'CREDIT_SALE'
	| 'CREDIT_PAYMENT'
	| 'SUPPLIER_PAYMENT';

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
