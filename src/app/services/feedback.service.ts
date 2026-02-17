import { Injectable } from '@angular/core';
import { Feedback, MOCK_FEEDBACK, Event, Ticket } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  public feedbacks: Feedback[] = [...MOCK_FEEDBACK];

  constructor() {
    console.log('[FeedbackService] Initialized.');
  }

  getAllFeedbacks() {
    return this.feedbacks;
  }

  getFeedbackForEvent(eventId: string) {
    return this.feedbacks.filter((f) => f.eventId === eventId);
  }

  addFeedback(feedback: Feedback) {
    this.feedbacks.push(feedback);
    console.log(this.feedbacks);
  }

  deleteFeedback(id: string) {
    this.feedbacks = this.feedbacks.filter((f) => f.feedbackId !== id);
  }

  deleteFeedbacksForEvent(eventId: string) {
    this.feedbacks = this.feedbacks.filter((f) => f.eventId !== eventId);
  }

  //data joining (feedback data with event details)
  getEnrichedUserFeedbacks(userId: string, events: Event[]) {
    return this.feedbacks
      .filter((f) => f.userId === userId)
      .map((f) => {
        const evt = events.find((e) => e.eventId === f.eventId);
        return {
          ...f,
          eventName: evt?.name || 'Unknown Event (Deleted)',
        };
      })
      .sort(
        (a, b) =>
          new Date(b.submittedTimestamp).getTime() - new Date(a.submittedTimestamp).getTime(),
      );
  }

  getPendingReviewEvents(userId: string, events: Event[], tickets: Ticket[]): Event[] {
    const now = new Date();
    const userTickets = tickets.filter((t) => t.userId === userId && t.status === 'Confirmed');

    //get unique event IDs attended
    const attendedEventIds = [...new Set(userTickets.map((t) => t.eventId))];

    //find event objects and filter for past dates(including time check)
    const attendedEvents = attendedEventIds
      .map((id) => events.find((e) => e.eventId === id))
      .filter((e): e is Event => {
        if (!e) return false;
        const [year, month, day] = e.date.split('-').map(Number);
        const [hours, minutes] = (e.time || '00:00').split(':').map(Number);
        const eventDate = new Date(year, month - 1, day, hours, minutes);
        return eventDate < now;
      });

    //filter out events which already reviewed
    const userFeedbacks = this.feedbacks.filter((f) => f.userId === userId);
    const reviewedEventIds = new Set(userFeedbacks.map((f) => f.eventId));

    return attendedEvents.filter((e) => !reviewedEventIds.has(e.eventId));
  }
}
