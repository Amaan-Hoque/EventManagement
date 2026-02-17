import { Component, inject } from '@angular/core';
import { FormsModule, NgForm, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DomainValidatorDirective } from '../../validators/domain-validator.directive';
import { PasswordMatchDirective } from '../../validators/password-match.directive';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    DomainValidatorDirective,
    PasswordMatchDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router: Router = inject(Router);

  locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA',
    'Austin, TX',
    'Jacksonville, FL',
    'San Francisco, CA',
    'Indianapolis, IN',
    'Seattle, WA',
    'Denver, CO',
    'Washington, D.C.',
    'Boston, MA',
    'Nashville, TN',
    'Las Vegas, NV',
    'Portland, OR',
    'Atlanta, GA',
    'Miami, FL',
    'New Orleans, LA',
  ];

  //template-driven
  user = {
    name: '',
    email: '',
    contact: '',
    location: '',
    password: '',
    confirmPassword: '',
  };

  errorMsg = '';

  onSubmit(form: NgForm) {
    if (form.invalid) {
      //mark all controls as touched to trigger error messages
      Object.values(form.controls).forEach((control: AbstractControl) => control.markAsTouched());
      return;
    }

    //map form values to service interface
    const formValues = {
      name: this.user.name,
      email: this.user.email,
      contactNumber: this.user.contact,
      location: this.user.location,
      password: this.user.password,
    };

    if (this.authService.register(formValues)) {
      alert('Registration successful! Welcome to EventHorizon.');
      this.router.navigate(['/login']);
    } else {
      this.errorMsg = 'User with this email already exists.';
    }
  }
}
