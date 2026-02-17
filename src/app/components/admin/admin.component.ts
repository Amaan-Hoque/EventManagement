import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { EventService } from '../../services/event.service';
import { FeedbackService } from '../../services/feedback.service';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { Event, Ticket, Feedback } from '../../data/mock-data';
import { CommonModule } from '@angular/common';
import { futureDateValidator, futureDateTimeValidator } from '../../validators/custom-validators';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface Attendee extends Ticket {
  userName: string;
  displayStatus: string;
}

interface BookingSummary {
  event: Event;
  bookingCount: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit, OnDestroy {
  eventService = inject(EventService);
  feedbackService = inject(FeedbackService);
  bookingService = inject(BookingService);
  authService = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  activeTab: 'events' | 'feedbacks' | 'bookings' = 'events';
  showForm: boolean = false;
  editing: boolean = false;

  feedbackFilterEventId: string = '';
  bookingFilterCategory: string = '';
  eventFilterCategory: string = '';

  currentEventId: string | null = null;

  //for bookings modal
  selectedEventForBookings: Event | null = null;
  attendeesForSelectedEvent: Attendee[] = [];

  //for deletion confirmations
  feedbackToDeleteId: string | null = null;
  eventToDeleteId: string | null = null;

  categories: string[] = [
    'Technology',
    'Arts',
    'Music',
    'Business',
    'Science',
    'Lifestyle',
    'Sports',
    'Education',
    'Food & Drink',
  ];
  locations: string[] = [
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
    'Denver',
    'CO',
    'Washington, D.C.',
    'Boston, MA',
    'Nashville, TN',
    'Las Vegas, NV',
    'Portland, OR',
    'Atlanta, GA',
    'Miami, FL',
    'New Orleans, LA',
  ];

  minDate: string = new Date().toISOString().split('T')[0];
  minTime: string | null = null;

  private dateSubscription: Subscription | undefined;

  eventForm: FormGroup = this.fb.group(
    {
      name: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', [Validators.required, futureDateValidator]],
      time: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      totalTickets: [100, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    },
    { validators: futureDateTimeValidator },
  );

  constructor(private router: Router) {}
  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    //if no user exists kick them to explore
    if (!user) {
      this.router.navigate(['/']);
    }
    this.dateSubscription = this.eventForm
      .get('date')
      ?.valueChanges.subscribe((selectedDate: string) => {
        this.updateMinTime(selectedDate);
      });
  }

  ngOnDestroy(): void {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  private updateMinTime(selectedDate: string): void {
    if (selectedDate === this.minDate) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.minTime = `${hours}:${minutes}`;

      const timeControl = this.eventForm.get('time');
      if (timeControl?.value && timeControl.value < this.minTime) {
        timeControl.setValue(this.minTime);
      }
    } else {
      this.minTime = null;
    }
  }

  addNew(): void {
    this.editing = false;
    this.currentEventId = null;
    this.eventForm.reset({
      price: 0,
      totalTickets: 100,
      category: '',
      location: '',
      time: '09:00',
    });
    this.updateMinTime(this.eventForm.get('date')?.value);

    this.eventForm.get('name')?.enable();
    this.eventForm.get('category')?.enable();
    this.eventForm.get('location')?.enable();

    this.showForm = true;
  }

  edit(event: Event): void {
    this.editing = true;
    this.currentEventId = event.eventId;
    this.eventForm.patchValue({ ...event });
    this.updateMinTime(event.date);

    this.eventForm.get('name')?.disable();
    this.eventForm.get('category')?.disable();
    this.eventForm.get('location')?.disable();

    this.eventForm.markAsPristine();
    this.showForm = true;
  }

  //for deleting event
  initiateDeleteEvent(id: string): void {
    this.eventToDeleteId = id;
  }

  cancelDeleteEvent(): void {
    this.eventToDeleteId = null;
  }

  confirmDeleteEvent(): void {
    if (this.eventToDeleteId) {
      const id = this.eventToDeleteId;
      this.eventService.deleteEvent(id);
      this.bookingService.deleteTicketsForEvent(id);
      this.feedbackService.deleteFeedbacksForEvent(id);

      if (this.selectedEventForBookings?.eventId === id) {
        this.closeBookingsModal();
      }

      this.eventToDeleteId = null;
    }
  }

  //for deleting feedback
  initiateDeleteFeedback(id: string): void {
    this.feedbackToDeleteId = id;
  }

  cancelDeleteFeedback(): void {
    this.feedbackToDeleteId = null;
  }

  confirmDeleteFeedback(): void {
    if (this.feedbackToDeleteId) {
      this.feedbackService.deleteFeedback(this.feedbackToDeleteId);
      this.feedbackToDeleteId = null;
    }
  }

  save(): void {
    if (this.eventForm.invalid) return;

    const formVal = this.eventForm.getRawValue();
    const currentUser = this.authService.currentUserValue;

    if (this.editing && this.currentEventId) {
      const originalEvent = this.eventService.getEvent(this.currentEventId);
      this.eventService.updateEventDetails(this.currentEventId, formVal, originalEvent);
      alert('Event updated successfully.');
    } else {
      this.eventService.createEvent(formVal, currentUser?.userId || '');
      alert('Event created successfully.');
    }
    this.showForm = false;
  }

  cancel(): void {
    this.showForm = false;
  }

  getEventName(eventId: string): string {
    const evt = this.eventService.getEvent(eventId);
    return evt ? evt.name : 'Unknown Event';
  }

  getUserName(userId: string): string {
    return this.authService.getUserName(userId);
  }

  get filteredEvents(): Event[] {
    return this.eventService.publicevents.filter((event) => {
      return this.eventFilterCategory ? event.category === this.eventFilterCategory : true;
    });
  }

  get filteredFeedbacks(): Feedback[] {
    if (!this.feedbackFilterEventId) {
      return this.feedbackService.feedbacks;
    }
    return this.feedbackService.getFeedbackForEvent(this.feedbackFilterEventId);
  }

  get eventsWithBookingCounts(): BookingSummary[] {
    return this.eventService.publicevents
      .filter((event) => {
        return this.bookingFilterCategory ? event.category === this.bookingFilterCategory : true;
      })
      .map((event) => {
        const bookings = this.bookingService.tickets.filter(
          (t) => t.eventId === event.eventId && t.status === 'Confirmed',
        );
        return {
          event: event,
          bookingCount: bookings.length,
        };
      })
      .sort(
        (a, b) =>
          this.eventService.getEventDateTime(b.event.date, b.event.time).getTime() -
          this.eventService.getEventDateTime(a.event.date, a.event.time).getTime(),
      );
  }

  viewBookingsForEvent(event: Event): void {
    const bookingsForEvent = this.bookingService.tickets.filter((t) => t.eventId === event.eventId);

    this.selectedEventForBookings = event;

    this.attendeesForSelectedEvent = bookingsForEvent
      .map((ticket) => {
        let displayStatus: string = ticket.status;
        if (ticket.status === 'Confirmed') {
          const eventIsOver = this.eventService.isEventEnded(event.date, event.time);
          if (eventIsOver) {
            displayStatus = 'Attended';
          }
        }

        return {
          ...ticket,
          userName: this.authService.getUserName(ticket.userId),
          displayStatus: displayStatus || 'No Available Status',
        };
      })
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }

  closeBookingsModal(): void {
    this.selectedEventForBookings = null;
    this.attendeesForSelectedEvent = [];
  }
}
