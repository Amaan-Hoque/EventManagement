import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
//aliased the imported "Event" model to "AppEvent" to resolve name collision with the DOM's built-in "Event" type which was causing a compile error in "formatExpiry"
import { Event as AppEvent } from '../../data/mock-data';
import { CommonModule } from '@angular/common';
import { expiryDateValidator, noAlphabetsValidator } from '../../validators/custom-validators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit, OnDestroy {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  eventService = inject(EventService);
  bookingService = inject(BookingService);
  authService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  event: AppEvent | null = null;

  quantity = 1;
  availableTickets = 0;
  private routeSubscription: Subscription | undefined;

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern('^\\d{16}$')]],
    cardHolder: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z\\s]*$')],
    ],
    expiry: [
      '',
      [
        Validators.required,
        noAlphabetsValidator,
        Validators.pattern('^(0[1-9]|1[0-2])\\/?([0-9]{2})$'),
        expiryDateValidator,
      ],
    ],
    cvv: ['', [Validators.required, Validators.pattern('^\\d{3,4}$')]],
  });

  processing = false;

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const eventId = params.get('id');
      if (eventId) {
        this.event = this.eventService.getEvent(eventId) || null;
        this.updateAvailability();
        this.checkEligibility(eventId);
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  updateAvailability(): void {
    if (!this.event) return;
    this.availableTickets = this.bookingService.getAvailableTicketsCount(this.event);
    if (this.availableTickets === 0) {
      this.quantity = 0;
    } else {
      this.quantity = 1;
    }
  }

  incrementQty(): void {
    if (this.quantity < this.availableTickets && this.quantity < 10) {
      this.quantity++;
    }
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  checkEligibility(eventId: string): void {
    if (!this.event) return;

    if (this.eventService.isEventEnded(this.event.date, this.event.time)) {
      alert('This event has ended and cannot be booked.');
      this.router.navigate(['/event', eventId]);
      return;
    }

    if (this.availableTickets === 0) {
      alert('Sorry, this event is sold out.');
      this.router.navigate(['/event', eventId]);
      return;
    }

    const user = this.authService.currentUserValue;
    if (user && user.role === 'admin') {
      alert('Administrators cannot book events.');
      this.router.navigate(['/admin']);
      return;
    }
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); //it removes all nondigit characters

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    //it update the form control value without emitting a valueChanges event to avoid infinite loops
    this.paymentForm.controls.expiry.setValue(value, { emitEvent: false });
  }

  processPayment(): void {
    if (this.paymentForm.invalid) return;

    const user = this.authService.currentUserValue;
    if (!user) {
      alert('Please log in to complete your booking.');
      this.router.navigate(['/login']);
      return;
    }

    if (user.role === 'admin') {
      alert('Administrators cannot book events.');
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    this.processing = true;

    if (this.event) {
      const success = this.bookingService.processBooking(user.userId, this.event, this.quantity);

      this.processing = false;
      if (success) {
        alert('Booking confirmed! Thank you for your purchase.');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Payment failed. Please try again.');
      }
    } else {
      this.processing = false;
    }
  }

  getEventDate(event: AppEvent): Date {
    return this.eventService.getEventDateTime(event.date, event.time);
  }
}
