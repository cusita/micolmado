import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../services/movements.service';
import { DailySummary as DailySummaryModel } from '../../models/movement.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-summary.html',
  styleUrl: './daily-summary.scss',
})
export class DailySummary implements OnInit {
  summary!: DailySummaryModel;

  constructor(private readonly movements: MovementsService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.summary = this.movements.getDailySummary(today);
  }
}
