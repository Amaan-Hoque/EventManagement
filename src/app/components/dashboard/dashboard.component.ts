import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { EventService } from '../../services/event.service';
import { FeedbackService } from '../../services/feedback.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Feedback, User, Event, Ticket } from '../../data/mock-data';
import { ProfileComponent } from '../profile/profile.component';
import { RouterLink, Router } from '@angular/router';

type EnrichedTicket = Ticket & {
  eventName: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventImage: string;
  displayStatus: string;
};

type EnrichedFeedback = Feedback & {
  eventName: string;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, ProfileComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  bookingService = inject(BookingService);
  eventService = inject(EventService);
  feedbackService = inject(FeedbackService);

  get user(): User | null {
    return this.authService.currentUserValue;
  }

  activeTab: 'bookings' | 'settings' | 'feedbacks' = 'bookings';

  deletingFeedbackId: string | null = null;
  cancelingTicketId: string | null = null;
  reviewingEventId: string | null = null;

  reviewModel = {
    rating: 5,
    comment: '',
  };

  constructor(private router: Router) {}
  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    //if no user exists kick them to explore
    if (!user) {
      this.router.navigate(['/']);
    }
  }

  get subtitle(): string {
    switch (this.activeTab) {
      case 'bookings':
        return 'View your upcoming events and manage your bookings.';
      case 'feedbacks':
        return 'Manage your submitted reviews and share your experiences.';
      case 'settings':
        return 'Update your personal information and account settings.';
      default:
        return 'Here is your event overview.';
    }
  }

  get myTickets(): EnrichedTicket[] {
    const u = this.user;
    if (!u) return [];
    //cast the result to the locally defined EnrichedTicket type
    return this.bookingService.getEnrichedUserTickets(
      u.userId,
      this.eventService.publicevents,
    ) as EnrichedTicket[];
  }

  get upcomingTickets(): EnrichedTicket[] {
    return this.myTickets
      .filter((t) => t.displayStatus === 'Confirmed')
      .sort((a, b) => {
        //gracefully handle missing dates keeping relative order if both missing(push to end)
        if (!a.eventDate && !b.eventDate) return 0;
        if (!a.eventDate) return 1;
        if (!b.eventDate) return -1;

        const timeA = a.eventTime || '00:00';
        const timeB = b.eventTime || '00:00';

        const dtA = this.eventService.getEventDateTime(a.eventDate, timeA);
        const dtB = this.eventService.getEventDateTime(b.eventDate, timeB);

        return dtA.getTime() - dtB.getTime();
      });
  }

  get myFeedbacks(): EnrichedFeedback[] {
    const u = this.user;
    if (!u) return [];
    return this.feedbackService.getEnrichedUserFeedbacks(
      u.userId,
      this.eventService.publicevents,
    ) as EnrichedFeedback[];
  }

  get pendingReviewEvents(): Event[] {
    const u = this.user;
    if (!u) return [];
    return this.feedbackService.getPendingReviewEvents(
      u.userId,
      this.eventService.publicevents,
      this.bookingService.tickets,
    );
  }

  get stats(): { totalBookings: number; upcoming: number } {
    const tickets = this.myTickets;
    return {
      totalBookings: tickets.length,
      upcoming: this.upcomingTickets.length,
    };
  }

  initiateCancelTicket(id: string) {
    this.cancelingTicketId = id;
  }

  abortCancelTicket() {
    this.cancelingTicketId = null;
  }

  confirmCancelTicket() {
    if (this.cancelingTicketId) {
      this.bookingService.cancelTicket(this.cancelingTicketId);
      this.cancelingTicketId = null;
      alert('Your refund will be processed and credited within 6-7 working days.');
    }
  }

  initiateDeleteFeedback(id: string) {
    this.deletingFeedbackId = id;
  }

  abortDeleteFeedback() {
    this.deletingFeedbackId = null;
  }

  confirmDeleteFeedback() {
    if (this.deletingFeedbackId) {
      this.feedbackService.deleteFeedback(this.deletingFeedbackId);
      this.deletingFeedbackId = null;
      alert('Feedback deleted successfully.');
    }
  }

  initiateReview(eventId: string) {
    this.reviewingEventId = eventId;
    this.reviewModel = { rating: 5, comment: '' };
  }

  cancelReview() {
    this.reviewingEventId = null;
  }

  submitReview(form: NgForm) {
    if (form.invalid || !this.reviewingEventId) return;

    const u = this.user;
    if (u) {
      const feedback: Feedback = {
        feedbackId: 'f' + crypto.randomUUID(),
        eventId: this.reviewingEventId,
        userId: u.userId,
        rating: Number(this.reviewModel.rating),
        comments: this.reviewModel.comment,
        submittedTimestamp: new Date().toISOString(),
      };

      this.feedbackService.addFeedback(feedback);
      this.reviewingEventId = null;
      alert('Review submitted successfully! Thank you for your feedback.');
    }
  }
}
