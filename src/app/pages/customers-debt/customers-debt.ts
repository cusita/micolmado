import { Component, OnInit } from "@angular/core";
import { CustomerCreditSummary } from "../../models/movement.model";
import { MovementsService } from "../../services/movements.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

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
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customers = this.movements.getCustomersWithDebt();
  }

  addPayment(customer: CustomerCreditSummary, rawAmount: string): void {
    const amount = Number(rawAmount);

    if (!amount || amount <= 0) {
      alert('Ingresa un monto válido para el abono.');
      return;
    }

    if (amount > customer.balance) {
      const confirmOver =
        confirm(
          `El abono (${amount}) es mayor que la deuda (${customer.balance}). ¿Deseas continuar igual?`
        );
      if (!confirmOver) {
        return;
      }
    }

    this.movements.addCreditPayment(
      amount,
      customer.customerName,
      'Abono de fiado'
    );

    alert('Abono registrado.');
    this.loadCustomers();
  }

  addFullPayment(customer: CustomerCreditSummary): void {
    if (customer.balance <= 0) {
      alert('Este cliente no tiene deuda pendiente.');
      return;
    }

    this.movements.addCreditPayment(
      customer.balance,
      customer.customerName,
      'Pago total de fiado'
    );

    alert('Pago total registrado.');
    this.loadCustomers();
  }
}
