import { Component, inject } from '@angular/core';
import { FormsModule, NgForm, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DomainValidatorDirective } from '../../validators/domain-validator.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, DomainValidatorDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router: Router = inject(Router);

  credentials = {
    email: '',
    password: '',
  };

  errorMsg = '';

  onSubmit(form: NgForm) {
    console.log('[LoginComponent] Submit button clicked.');

    if (form.invalid) {
      Object.values(form.controls).forEach((control: AbstractControl) => {
        control.markAsTouched();
      });
      return;
    }

    const { email, password } = this.credentials;
    console.log('[LoginComponent] Form valid.Calling AuthService.login');

    if (this.authService.login(email, password)) {
      alert('Login successful!');
      console.log('[LoginComponent] Redirecting to home.');
      this.router.navigate(['/']);
    } else {
      this.errorMsg = 'Invalid email or password';
    }
  }
}
