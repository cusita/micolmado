import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { ClientsService } from '../../services/clients.service';
import { Client } from '../../models/movement.model';

@Component({
  selector: 'app-add-credit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-credit.html',
  styleUrl: './add-credit.scss',
})
export class AddCredit implements OnInit {
  @ViewChild('clientInput') clientInput?: ElementRef<HTMLInputElement>;

  clients: Client[] = [];
  filteredClients: Client[] = [];
  showSuggestions = false;

  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly movements: MovementsService,
    private readonly clientsService: ClientsService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
    clientSearch: [''],
    clientId: ['', [Validators.required]],
    amount: [0, [Validators.required, Validators.min(1)]],
    note: [''],
  });

  }

  ngOnInit(): void {
    this.clients = this.clientsService.getAll().filter((c) => c.isActive);
    this.filteredClients = this.clients;
  }

  get amountInvalid(): boolean {
    const control = this.form.controls['amount'];
    return control.invalid && (control.dirty || control.touched);
  }

  get clientInvalid(): boolean {
    const control = this.form.controls['clientId'];
    return control.invalid && (control.dirty || control.touched);
  }

  onClientSearchChange(term: string): void {
    const value = term.toLowerCase().trim();
    this.showSuggestions = true;

    if (!value) {
      this.filteredClients = this.clients;
      this.form.controls['clientId'].setValue('');
      return;
    }

    this.filteredClients = this.clients.filter((c) => {
      return (
        c.name.toLowerCase().includes(value) ||
        c.code.toLowerCase().includes(value) ||
        (c.note?.toLowerCase().includes(value) ?? false)
      );
    });

    this.form.controls['clientId'].setValue('');
  }

  selectClient(client: Client): void {
    const display = `#${client.code} - ${client.name}${
      client.note ? ' (' + client.note + ')' : ''
    }`;

    this.form.controls['clientSearch'].setValue(display);
    this.form.controls['clientId'].setValue(client.id);

    // cerramos el desplegable
    this.showSuggestions = false;

    // opcional: quitar foco del input
    this.clientInput?.nativeElement.blur();
  }

  onClientInputBlur(): void {
    // pequeño delay para dejar que el click en la opción se procese primero
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { clientId, amount, note } = this.form.getRawValue();
    const client = this.clients.find((c) => c.id === clientId);

    if (!client) {
      alert('Selecciona un cliente válido.');
      return;
    }

    this.movements.addCreditSale(
      Number(amount),
      client.name,
      note || undefined
    );

    alert('Fiado registrado correctamente');
    this.router.navigateByUrl('/');
  }

  cancel(): void {
    this.router.navigateByUrl('/');
  }
}
