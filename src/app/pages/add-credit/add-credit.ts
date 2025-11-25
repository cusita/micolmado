import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MovementsService } from '../../services/movements.service';

@Component({
  selector: 'app-add-credit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-credit.html',
  styleUrl: './add-credit.scss',
})
export class AddCredit {
  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly movements: MovementsService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      amount: [0, [Validators.required, Validators.min(1)]],
      note: [''],
    });
  }

  get amountInvalid(): boolean {
    const control = this.form.controls['amount'];
    return control.invalid && (control.dirty || control.touched);
  }

  get customerInvalid(): boolean {
    const control = this.form.controls['customerName'];
    return control.invalid && (control.dirty || control.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { customerName, amount, note } = this.form.getRawValue();
    this.movements.addCreditSale(amount, customerName, note || undefined);

    alert('Fiado registrado correctamente');
    this.router.navigateByUrl('/');
  }

  cancel(): void {
    this.router.navigateByUrl('/');
  }
}
