import { Injectable } from '@angular/core';
import { Event as AppEvent, MOCK_EVENTS } from '../data/mock-data';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public publicevents: AppEvent[] = [...MOCK_EVENTS];

  constructor() {
    console.log('[EventService] Initialized.');
  }

  getEvent(id: string): AppEvent | undefined {
    return this.publicevents.find((e) => e.eventId === id);
  }

  createEvent(formData: any, organizerId: string): void {
    const newEvent: AppEvent = {
      ...formData,
      eventId: 'e' + Date.now(),
      organizerId: organizerId,
      image: 'https://picsum.photos/id/25/1000/600',
    };
    console.log('[EventService] Creating event:', newEvent);
    this.publicevents.push(newEvent);
  }

  updateEventDetails(eventId: string, formData: any, originalEvent: AppEvent | undefined): void {
    if (!originalEvent) return;
    const updatedEvent: AppEvent = {
      ...formData,
      eventId: eventId,
      organizerId: originalEvent.organizerId,
      image: originalEvent.image,
    };
    console.log('[EventService] Updating event:', updatedEvent);
    this.publicevents = this.publicevents.map((e) => (e.eventId === eventId ? updatedEvent : e));
  }

  addEvent(event: AppEvent) {
    this.publicevents.push(event);
  }

  deleteEvent(id: string) {
    console.log(`[EventService] Deleting event with ID: ${id}`);
    const initialCount = this.publicevents.length;
    this.publicevents = this.publicevents.filter((e) => e.eventId !== id);
    if (this.publicevents.length < initialCount) {
      console.log('[EventService] Event deleted.');
    }
  }

  updateEvent(updatedEvent: AppEvent) {
    this.publicevents = this.publicevents.map((e) =>
      e.eventId === updatedEvent.eventId ? updatedEvent : e,
    );
  }

  //helper for consistent date-time parsing
  getEventDateTime(dateStr: string, timeStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    //handle cases where split might result in NaN or empty
    const t = timeStr || '00:00';
    const [hours, minutes] = t.split(':').map(Number);
    return new Date(year, month - 1, day, hours || 0, minutes || 0);
  }

  isEventEnded(dateStr: string, timeStr: string = '23:59'): boolean {
    //ensure timeStr is valid and fallback if empty string
    const validTime = timeStr && timeStr.trim() !== '' ? timeStr : '23:59';
    const now = new Date();
    const eventDate = this.getEventDateTime(dateStr, validTime);
    return now > eventDate;
  }

  filterEvents(query: string, category: string): AppEvent[] {
    const q = query.toLowerCase();
    return this.publicevents.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      const matchesCategory = category ? e.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }

  getUpcomingEvents(events: AppEvent[]): AppEvent[] {
    return events
      .filter((e) => !this.isEventEnded(e.date, e.time))
      .sort(
        (a, b) =>
          this.getEventDateTime(a.date, a.time || '00:00').getTime() -
          this.getEventDateTime(b.date, b.time || '00:00').getTime(),
      );
  }

  getPastEvents(events: AppEvent[]): AppEvent[] {
    return events
      .filter((e) => this.isEventEnded(e.date, e.time))
      .sort(
        (a, b) =>
          this.getEventDateTime(b.date, b.time || '00:00').getTime() -
          this.getEventDateTime(a.date, a.time || '00:00').getTime(),
      );
  }

  getCategories(): string[] {
    return [...new Set(this.publicevents.map((e) => e.category))];
  }
}
