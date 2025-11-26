import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientsService } from '../../services/clients.service';
import { Client } from '../../models/movement.model';
import { SearchFilter } from '../../shared/components/search-filter/search-filter';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SearchFilter],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients implements OnInit {
  form: FormGroup;
  private allClients: Client[] = [];
  clients: Client[] = [];

  constructor(private readonly fb: FormBuilder, private readonly clientsService: ClientsService) {
    this.form = this.fb.nonNullable.group({
      code: ['', [Validators.required, Validators.minLength(1)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.allClients = this.clientsService.getAll();
    this.clients = this.clientsService.getAll();
  }

  get codeInvalid(): boolean {
    const c = this.form.get('code');
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  get nameInvalid(): boolean {
    const c = this.form.get('name');
    return !!c && c.invalid && (c.dirty || c.touched);
  }
  
  onSearchClients(term: string): void {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.clients = this.allClients.slice();
      return;
    }

    this.clients = this.allClients.filter((c) => {
      return (
        c.code.toLowerCase().includes(value) ||
        c.name.toLowerCase().includes(value) ||
        (c.note?.toLowerCase().includes(value) ?? false)
      );
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { code, name, note } = this.form.getRawValue();

    try {
      this.clientsService.addClient(code, name, note || undefined);
      this.form.reset({ code: '', name: '', note: '' });
      this.loadClients();
    } catch (error: any) {
      alert(error?.message ?? 'No se pudo guardar el cliente');
    }
  }

  toggleActive(client: Client): void {
    this.clientsService.toggleActive(client.id);
    this.loadClients();
  }
}
