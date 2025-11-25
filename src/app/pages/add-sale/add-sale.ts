import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MovementsService } from '../../services/movements.service';

@Component({
  selector: 'app-add-sale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-sale.html',
  styleUrl: './add-sale.scss',
})
export class AddSale {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly movements: MovementsService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      note: [''],
    });
  }

  get amountInvalid(): boolean {
    const control = this.form.controls['amount'];
    return control.invalid && (control.dirty || control.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { amount, note } = this.form.getRawValue();
    this.movements.addSale(amount, note || undefined);

    alert('Venta registrada correctamente');
    this.router.navigateByUrl('/');
  }

  cancel(): void {
    this.router.navigateByUrl('/');
  }
}
