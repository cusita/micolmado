import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchItem } from '../../../../models/movement.model';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox<T = any> {
  /** Texto del placeholder del input */
  @Input() placeholder = 'Buscar...';

  /** Mensaje cuando no hay resultados */
  @Input() noResultsText = 'No hay resultados';

  /** Lista completa de ítems para buscar */
  @Input() items: SearchItem<T>[] = [];

  /** Si se desea mostrar la lista aun con input vacío */
  @Input() showWhenEmpty = false;

  /** Emite el ítem seleccionado */
  @Output() selected = new EventEmitter<SearchItem<T>>();

  /** Emite el término de búsqueda en bruto (por si el padre quiere reaccionar) */
  @Output() searchChange = new EventEmitter<string>();

  searchTerm = '';
  filteredItems: SearchItem<T>[] = [];
  showSuggestions = false;

  ngOnInit(): void {
    this.filteredItems = this.items.slice();
  }

  ngOnChanges(): void {
    // si cambian items desde el padre, refrescamos el filtrado
    this.filterItems(this.searchTerm);
  }

  onInputChange(value: string): void {
    this.searchTerm = value;
    this.searchChange.emit(value);
    this.showSuggestions = true;
    this.filterItems(value);
  }

  private filterItems(term: string): void {
    const v = term.toLowerCase().trim();

    if (!v) {
      this.filteredItems = this.showWhenEmpty ? this.items.slice() : [];
      return;
    }

    this.filteredItems = this.items.filter((item) => {
      const label = item.label.toLowerCase();
      const sub = item.sublabel?.toLowerCase() ?? '';
      return label.includes(v) || sub.includes(v);
    });
  }

  onFocus(): void {
    this.showSuggestions = true;
    this.filterItems(this.searchTerm);
  }

  onBlur(): void {
    // dejamos un pequeño delay para que el click en una opción se procese
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }

  selectItem(item: SearchItem<T>): void {
    this.searchTerm = item.label;
    this.selected.emit(item);
    this.showSuggestions = false;
  }

  clear(): void {
    this.searchTerm = '';
    this.filterItems('');
    this.searchChange.emit('');
  }
}
