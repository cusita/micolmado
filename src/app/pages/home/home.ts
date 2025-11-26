import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovementsService } from '../../services/movements.service';
import { DailySummary } from '../../models/movement.model';

type HomeMetricCard = {
  label: string;
  value: number;
  icon: string;
  accent: 'sales' | 'credit' | 'profit';
  note?: string;
};

type HomeInsightCard = {
  title: string;
  value: number;
  caption: string;
  icon: string;
  accent: 'success' | 'warning' | 'neutral';
  format?: 'currency' | 'count';
};

type HomeActivityItem = {
  title: string;
  description: string;
  timeAgo: string;
  icon: string;
  accent: 'positive' | 'notice' | 'neutral';
  amount?: number;
};

type HomeWeeklyGoal = {
  title: string;
  targetLabel: string;
  progress: number;
  icon: string;
};

type HomeTaskReminder = {
  title: string;
  description: string;
  icon: string;
  actionLabel?: string;
  route?: string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  todaySummary!: DailySummary;
  summaryCards: HomeMetricCard[] = [];
  insightCards: HomeInsightCard[] = [];
  recentActivity: HomeActivityItem[] = [];
  weeklyGoals: HomeWeeklyGoal[] = [];
  taskReminders: HomeTaskReminder[] = [];
  private debtorsCount = 0;

  constructor(private readonly movements: MovementsService) {}

  ngOnInit(): void {
    this.refreshTodaySnapshot();
    this.seedPanels();
  }
 
  private refreshTodaySnapshot(): void {
    this.todaySummary = this.movements.getTodaySummary();
    this.debtorsCount = this.movements.getCustomersWithDebt().length;

    const summary = this.todaySummary;
    const salesValue = summary?.totalSales ?? 0;
    const creditValue = summary?.totalCreditSales ?? 0;
    const profitValue = summary?.estimatedProfit ?? 0;

    this.summaryCards = [
      {
        label: 'Vendido hoy',
        value: salesValue,
        icon: '💵',
        accent: 'sales',
        note: 'Meta diaria: RD$ 15,000',
      },
      {
        label: 'Fiado hoy',
        value: creditValue,
        icon: '📝',
        accent: 'credit',
        note: 'Controla los cobros pendientes',
      },
      {
        label: 'Ganancia estimada',
        value: profitValue,
        icon: '📈',
        accent: 'profit',
        note: 'Incluye cobros y egresos',
      },
    ];

    this.insightCards = [
      {
        title: 'Cobros a crédito',
        value: summary?.totalCreditPayments ?? 0,
        caption: 'Pagos recibidos durante el día',
        icon: '✅',
        accent: 'success',
        format: 'currency',
      },
      {
        title: 'Pagos a proveedores',
        value: summary?.totalSupplierPayments ?? 0,
        caption: 'Salidas programadas y registradas',
        icon: '💸',
        accent: 'warning',
        format: 'currency',
      },
      {
        title: 'Clientes con deuda activa',
        value: this.debtorsCount,
        caption: 'Personas que aún deben algo',
        icon: '👥',
        accent: 'neutral',
        format: 'count',
      },
    ];
  }

  private seedPanels(): void {
    this.recentActivity = [
      {
        title: 'Cobro de fiado',
        description: 'Ana Martínez abonó RD$ 350 al balance pendiente.',
        timeAgo: 'hace 1 hora',
        icon: '✅',
        accent: 'positive',
        amount: 350,
      },
      {
        title: 'Venta registrada',
        description: 'Venta al contado del turno matutino.',
        timeAgo: 'hace 3 horas',
        icon: '💵',
        accent: 'neutral',
        amount: 1200,
      },
      {
        title: 'Pago a proveedor',
        description: 'Pago parcial a Distribuidora Gómez.',
        timeAgo: 'ayer',
        icon: '📦',
        accent: 'notice',
        amount: 800,
      },
    ];

    this.weeklyGoals = [
      {
        title: 'Alcanzar ventas de la semana',
        targetLabel: 'Meta: RD$ 85,000',
        progress: 62,
        icon: '🎯',
      },
      {
        title: 'Cobrar cuentas pendientes',
        targetLabel: 'Meta: RD$ 15,000 en cobros',
        progress: 48,
        icon: '📅',
      },
      {
        title: 'Reducir pagos atrasados',
        targetLabel: 'Meta: 0 facturas vencidas',
        progress: 75,
        icon: '⚖️',
      },
    ];

    this.taskReminders = [
      {
        title: 'Revisar inventario de lácteos',
        description: 'Quedan menos de 10 unidades de productos clave.',
        icon: '🧾',
        actionLabel: 'Ver artículos',
        route: '/articulos',
      },
      {
        title: 'Confirmar pagos a proveedores',
        description: 'Dos pagos siguen pendientes de confirmación.',
        icon: '💸',
        actionLabel: 'Ir a pagos',
        route: '/pagos-proveedores',
      },
      {
        title: 'Actualizar datos de clientes fiados',
        description: 'Registrar nuevos acuerdos y plazos de cobro.',
        icon: '🧍',
        actionLabel: 'Gestionar clientes',
        route: '/clientes-fiados',
      },
    ];
  }
}
