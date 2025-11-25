import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../services/movements.service';
import { CustomerCreditSummary } from '../../models/movement.model';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-customers-debt',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './customers-debt.html',
	styleUrl: './customers-debt.scss',
})
export class CustomersDebt implements OnInit {
	customers: CustomerCreditSummary[] = [];

	constructor(private readonly movements: MovementsService) {}

	ngOnInit(): void {
		this.customers = this.movements.getCustomersWithDebt();
	}
}
