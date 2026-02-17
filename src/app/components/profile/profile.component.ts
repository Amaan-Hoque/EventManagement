import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);

  //getter to always have fresh user data
  get user() {
    return this.authService.currentUserValue;
  }

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

  model = {
    contact: '',
    location: '',
  };

  ngOnInit() {
    if (this.user) {
      this.model = {
        contact: this.user.contactNumber,
        location: this.user.location || '',
      };
    }
  }

  updateProfile(form: NgForm) {
    if (form.invalid) return;

    if (this.user) {
      const { contact, location } = this.model;

      this.authService.updateProfile({
        ...this.user,
        contactNumber: contact,
        location: location,
      });

      alert('Profile updated successfully!');

      //reset pristine state so button disables again
      form.form.markAsPristine();
    }
  }
}
