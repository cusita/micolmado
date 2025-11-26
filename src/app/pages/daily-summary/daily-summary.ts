import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsService } from '../../services/movements.service';
import {
  DailySummary as DailySummaryModel,
  MonthlySummary,
  YearlySummary,
} from '../../models/movement.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-summary.html',
  styleUrl: './daily-summary.scss',
})
export class DailySummary implements OnInit {
  todaySummary!: DailySummaryModel;

  selectedYear!: number;
  availableYears: number[] = [];
  monthlySummaries: MonthlySummary[] = [];
  yearlySummaries: YearlySummary[] = [];
  selectedMonthForDetails: MonthlySummary | null = null;
  dailySummariesForSelectedMonth: DailySummaryModel[] = [];

  constructor(private readonly movements: MovementsService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.todaySummary = this.movements.getDailySummary(today);

    this.availableYears = this.movements.getAvailableYears();
    // si no hay datos, no hacemos nada más
    if (this.availableYears.length === 0) {
      return;
    }

    // por defecto, el último año (normalmente el actual)
    this.selectedYear = this.availableYears[this.availableYears.length - 1];
    this.loadMonthlySummaries();
    this.yearlySummaries = this.movements.getYearlySummaries();
  }

  loadMonthlySummaries(): void {
    if (!this.selectedYear) {
      this.monthlySummaries = [];
      return;
    }
    this.monthlySummaries = this.movements.getMonthlySummariesForYear(this.selectedYear);
  }

  onYearChange(rawYear: string): void {
    const year = Number(rawYear);
    if (!year) return;
    this.selectedYear = year;
    this.loadMonthlySummaries();
  }

  getMonthName(month: number): string {
    const names = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return names[month - 1] ?? String(month);
  }

  showDailyDetailsForMonth(monthSummary: MonthlySummary): void {
    this.selectedMonthForDetails = monthSummary;
    this.dailySummariesForSelectedMonth = this.movements.getDailySummariesForMonth(
      monthSummary.year,
      monthSummary.month
    );
  }
}
