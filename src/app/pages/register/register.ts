import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService, RegisterResponse } from '../../services/customer.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);

  loading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  registerForm = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12)]]
  });

  get f() {
    return this.registerForm.controls;
  }

  get passwordStrength(): {
    percent: number;
    label: string;
    level: '' | 'weak' | 'medium' | 'strong';
  } {
    const password = this.f.password.value;
    let score = 0;

    if (!password) {
      return { percent: 0, label: '', level: '' };
    }

    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { percent: 33, label: 'Faible', level: 'weak' };
    }

    if (score <= 4) {
      return { percent: 66, label: 'Moyen', level: 'medium' };
    }

    return { percent: 100, label: 'Fort', level: 'strong' };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.customerService
      .register(this.registerForm.getRawValue())
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: RegisterResponse) => {
          this.successMessage = `Compte créé avec succès pour ${response.data.displayName}`;
          this.errorMessage = '';
          this.registerForm.reset({
            displayName: '',
            email: '',
            password: ''
          });
          this.showPassword = false;
        },
        error: (error: HttpErrorResponse) => {
          console.log('Erreur inscription complète :', error);

          this.successMessage = '';

          const backendMessage = error?.error?.message;

          if (backendMessage) {
            this.errorMessage = backendMessage;
            return;
          }

          if (error.status === 409) {
            this.errorMessage = 'Un compte existe déjà avec cet email.';
            return;
          }

          if (error.status === 0) {
            this.errorMessage = 'Impossible de joindre le serveur.';
            return;
          }

          this.errorMessage = 'Erreur lors de la création du compte.';
        }
      });
  }
}