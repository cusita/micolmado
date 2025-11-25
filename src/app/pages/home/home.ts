import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { DailySummary } from '../../models/movement.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  todaySummary!: DailySummary;

  constructor(private readonly movements: MovementsService) {}

  ngOnInit(): void {
    this.todaySummary = this.movements.getTodaySummary();
  }

  // estos métodos demo los puedes dejar si los usas o borrarlos
  addQuickSale() {
    const m = this.movements.addSale(100, 'Venta demo');
    console.log('Venta guardada:', m);
    this.todaySummary = this.movements.getTodaySummary();
  }

  addQuickCredit() {
    const m = this.movements.addCreditSale(50, 'Cliente demo', 'Fiado demo');
    console.log('Fiado guardado:', m);
    this.todaySummary = this.movements.getTodaySummary();
  }
}
