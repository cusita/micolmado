import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.scss',
})
export class SearchFilter {
  /** Placeholder del input */
  @Input() placeholder = 'Buscar...';

  /** Etiqueta opcional arriba del buscador */
  @Input() label?: string;

  /** Emite el término de búsqueda cada vez que cambia */
  @Output() search = new EventEmitter<string>();

  term = '';

  onInput(value: string): void {
    this.term = value;
    this.search.emit(value);
  }

  clear(): void {
    this.term = '';
    this.search.emit('');
  }
}
