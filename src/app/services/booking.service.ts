import { Injectable, inject } from '@angular/core';
import { Ticket, MOCK_TICKETS, Event } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  public tickets: Ticket[] = [...MOCK_TICKETS];

  constructor() {
    console.log('[BookingService] Initialized.');
  }

  getAvailableTicketsCount(event: Event): number {
    const sold = this.tickets.filter(
      (t) => t.eventId === event.eventId && t.status === 'Confirmed',
    ).length;
    return Math.max(0, event.totalTickets - sold);
  }

  //payment process loop
  processBooking(userId: string, event: Event, quantity: number): boolean {
    console.log(`[BookingService] Processing booking of ${quantity} tickets for user ${userId}`);

    try {
      for (let i = 0; i < quantity; i++) {
        const ticket: Ticket = {
          ticketId: 't' + crypto.randomUUID(),
          eventId: event.eventId,
          userId: userId,
          bookingDate: new Date().toISOString(),
          status: 'Confirmed',
        };
        this.tickets.push(ticket);
        console.log(this.tickets);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  bookTicket(ticket: Ticket) {
    this.tickets.push(ticket);
  }

  cancelTicket(ticketId: string) {
    console.log(`[BookingService] Requesting cancellation for ticket: ${ticketId}`);
    this.tickets = this.tickets.map((t) =>
      t.ticketId === ticketId ? { ...t, status: 'Canceled' } : t,
    );
  }

  deleteTicketsForEvent(eventId: string) {
    this.tickets = this.tickets.filter((t) => t.eventId !== eventId);
  }

  getUserTickets(userId: string) {
    return this.tickets.filter((t) => t.userId === userId);
  }

  //data joining(events and tickets)
  getEnrichedUserTickets(userId: string, events: Event[]) {
    const now = new Date();
    return this.tickets
      .filter((t) => t.userId === userId)
      .map((t) => {
        const evt = events.find((e) => e.eventId === t.eventId);

        let displayStatus: string = t.status;
        if (t.status === 'Confirmed' && evt?.date) {
          //parse date and time for accurate "Attended" status
          const [year, month, day] = evt.date.split('-').map(Number);
          const [hours, minutes] = (evt.time || '00:00').split(':').map(Number);
          const eventDateTime = new Date(year, month - 1, day, hours, minutes);

          if (eventDateTime < now) {
            displayStatus = 'Attended';
          }
        }

        return {
          ...t,
          eventName: evt?.name || 'Unknown Event (Deleted)',
          eventDate: evt?.date,
          eventTime: evt?.time,
          eventLocation: evt?.location,
          eventImage: evt?.image || 'https://picsum.photos/id/1/200/200',
          displayStatus,
        };
      });
  }
}
