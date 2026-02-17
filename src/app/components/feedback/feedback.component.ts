import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FeedbackService } from '../../services/feedback.service';
import { BookingService } from '../../services/booking.service';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Feedback } from '../../data/mock-data';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent implements OnChanges {
  @Input() eventId!: string;
  @Input() eventDate!: string;
  @Input() eventTime: string = '00:00';

  feedbackService = inject(FeedbackService);
  bookingService = inject(BookingService);
  authService = inject(AuthService);
  eventService = inject(EventService);

  feedbacks: Feedback[] = [];

  feedbackModel = {
    rating: 5,
    comment: '',
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['eventId'] && this.eventId) {
      this.refreshFeedbacks();
    }
  }

  refreshFeedbacks() {
    console.log(`[FeedbackComponent] Refreshing feedback list for event: ${this.eventId}`);
    this.feedbacks = this.feedbackService.getFeedbackForEvent(this.eventId);
  }

  //determine the state of the review capability for the current user
  get reviewState(): string {
    const user = this.authService.currentUserValue;

    if (!user) return 'login_required';
    if (!this.eventId) return 'loading';

    //check if user has a confirmed ticket
    const tickets = this.bookingService.getUserTickets(user.userId);
    const hasConfirmedTicket = tickets.some(
      (t) => t.eventId === this.eventId && t.status === 'Confirmed',
    );

    if (!hasConfirmedTicket) return 'no_ticket';

    //check if event is in the past is completed helps to maintain the
    //consistency with Dashboard status and event lists
    if (!this.eventService.isEventEnded(this.eventDate, this.eventTime)) {
      return 'event_future';
    }

    return 'can_review';
  }

  submitFeedback(form: NgForm) {
    if (form.invalid) return;

    const user = this.authService.currentUserValue;
    const { rating, comment } = this.feedbackModel;

    if (user && this.eventId) {
      console.log('[FeedbackComponent] Submitting feedback');
      const feedback: Feedback = {
        feedbackId: 'f' + crypto.randomUUID(),
        eventId: this.eventId,
        userId: user.userId,
        rating: Number(rating),
        comments: comment!,
        submittedTimestamp: new Date().toISOString(),
      };
      this.feedbackService.addFeedback(feedback);
      this.refreshFeedbacks();
      alert('Feedback posted successfully! Thank you.');

      form.resetForm({ rating: 5, comment: '' });
      this.feedbackModel = { rating: 5, comment: '' };
    }
  }

  get averageRating() {
    if (this.feedbacks.length === 0) return 0;
    return this.feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / this.feedbacks.length;
  }
}
