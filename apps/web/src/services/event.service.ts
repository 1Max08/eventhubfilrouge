import type { Event } from '../types/event';

const API_URL = 'http://localhost:3001/api';

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw new Error('Impossible de récupérer les événements');
  }

  return response.json();
}

export async function getEventById(id: number): Promise<Event> {
  const response = await fetch(`${API_URL}/events/${id}`);

  if (!response.ok) {
    throw new Error('Événement introuvable');
  }

  return response.json();
}
