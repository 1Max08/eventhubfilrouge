import {
  createEvent,
  deleteEvent,
  findAllEvents,
  findEventById,
  updateEvent,
  type CreateEventData,
  type Event,
  type UpdateEventData,
} from '../repositories/event.repository.js';

export async function getAllEvents(): Promise<Event[]> {
  return findAllEvents();
}

export async function getEventById(id: number): Promise<Event | null> {
  return findEventById(id);
}

export async function createNewEvent(data: CreateEventData): Promise<Event> {
  if (data.capacity <= 0) {
    throw new Error('La capacité doit être supérieure à 0');
  }

  if (data.price < 0) {
    throw new Error('Le prix ne peut pas être négatif');
  }

  if (new Date(data.endDate) <= new Date(data.startDate)) {
    throw new Error('La date de fin doit être après la date de début');
  }

  return createEvent(data);
}

export async function updateExistingEvent(
  id: number,
  data: UpdateEventData,
): Promise<Event | null> {
  return updateEvent(id, data);
}

export async function deleteExistingEvent(id: number): Promise<boolean> {
  return deleteEvent(id);
}
