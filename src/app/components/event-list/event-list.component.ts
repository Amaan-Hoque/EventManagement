import { Component, inject } from '@angular/core';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Event } from '../../data/mock-data';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  eventService = inject(EventService);
  bookingService = inject(BookingService);

  searchQuery = '';
  categoryFilter = '';

  get categories() {
    return this.eventService.getCategories();
  }

  get filteredEvents() {
    return this.eventService.filterEvents(this.searchQuery, this.categoryFilter);
  }

  get upcomingFilteredEvents() {
    return this.eventService.getUpcomingEvents(this.filteredEvents);
  }

  get pastFilteredEvents() {
    return this.eventService.getPastEvents(this.filteredEvents);
  }

  get hasEvents(): boolean {
    return this.eventService.publicevents.length > 0;
  }

  getAvailability(event: Event): number {
    return this.bookingService.getAvailableTicketsCount(event);
  }

  getEventDate(event: Event): Date {
    return this.eventService.getEventDateTime(event.date, event.time);
  }
}
