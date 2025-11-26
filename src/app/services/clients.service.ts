import { Injectable } from '@angular/core';
import { Client } from '../models/movement.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly STORAGE_KEY = 'micolmado_clients';

  getAll(): Client[] {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return [];

    try {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(this.isClientCandidate);
    } catch (error) {
      console.error('Failed to parse clients from storage', error);
      return [];
    }
  }

  saveAll(clients: Client[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(clients));
  }

  addClient(code: string, name: string, note?: string): Client {
    const trimmedCode = code.trim();
    const trimmedName = name.trim();

    if (!trimmedCode || !trimmedName) {
      throw new Error('Code and name are required');
    }

    const clients = this.getAll();

    // opcional: evitar códigos duplicados
    const exists = clients.some((c) => c.code === trimmedCode);
    if (exists) {
      throw new Error('Ya existe un cliente con ese número');
    }

    const client: Client = {
      id: Date.now().toString(),
      code: trimmedCode,
      name: trimmedName,
      note: note?.trim() || undefined,
      isActive: true,
    };

    clients.push(client);
    this.saveAll(clients);
    return client;
  }

  updateClient(updated: Client): void {
    const clients = this.getAll();
    const index = clients.findIndex((c) => c.id === updated.id);
    if (index === -1) return;
    clients[index] = updated;
    this.saveAll(clients);
  }

  toggleActive(id: string): void {
    const clients = this.getAll();
    const index = clients.findIndex((c) => c.id === id);
    if (index === -1) return;
    clients[index].isActive = !clients[index].isActive;
    this.saveAll(clients);
  }

  deleteClient(id: string): void {
    const clients = this.getAll();
    const next = clients.filter((client) => client.id !== id);
    if (next.length === clients.length) {
      return;
    }
    this.saveAll(next);
  }

  private isClientCandidate(value: unknown): value is Client {
    if (!value || typeof value !== 'object') return false;
    const c = value as Partial<Client>;
    return (
      typeof c.id === 'string' &&
      typeof c.code === 'string' &&
      typeof c.name === 'string' &&
      typeof c.isActive === 'boolean'
    );
  }
}
