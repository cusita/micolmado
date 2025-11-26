import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AddSale } from './pages/add-sale/add-sale';
import { AddCredit } from './pages/add-credit/add-credit';
import { DailySummary } from './pages/daily-summary/daily-summary';
import { CustomersDebt } from './pages/customers-debt/customers-debt';
import { Products } from './pages/products/products';
import { Clients } from './pages/clients/clients';
import { SupplierPayments } from './pages/supplier-payments/supplier-payments';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'venta', component: AddSale },
  { path: 'fiado', component: AddCredit },
  { path: 'resumen', component: DailySummary },
  { path: 'clientes-fiados', component: CustomersDebt },
  { path: 'articulos', component: Products },
  { path: 'clientes', component: Clients },
  { path: 'pagos-proveedores', component: SupplierPayments },
];
