import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { Event } from '../../data/mock-data';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FeedbackComponent } from '../feedback/feedback.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FeedbackComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css',
})
export class EventDetailComponent implements OnInit, OnDestroy {
  eventService = inject(EventService);
  bookingService = inject(BookingService);
  authService = inject(AuthService);

  route: ActivatedRoute = inject(ActivatedRoute);

  event: Event | null = null;
  errorMessage: string = '';
  private routeSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const eventId = params.get('id');
      console.log(`[EventDetailComponent] View initialized for event ID: ${eventId}`);

      this.errorMessage = '';
      this.event = null;

      if (eventId) {
        this.event = this.eventService.getEvent(eventId) || null;
        if (!this.event) {
          this.errorMessage = 'Event not found';
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  get bookingState(): 'bookable' | 'booked' | 'ended' | 'admin' | 'guest' {
    const user = this.authService.currentUserValue;
    const evt = this.event;

    if (!evt) return 'ended';

    //checks if event is in the past (date + time check)
    if (this.eventService.isEventEnded(evt.date, evt.time)) {
      return 'ended';
    }

    if (!user) return 'guest';
    if (user.role === 'admin') return 'admin';

    //does not return "booked" state even if they have tickets basically allow multiple bookings
    return 'bookable';
  }

  getEventDate(event: Event): Date {
    return this.eventService.getEventDateTime(event.date, event.time);
  }
}
