import type { Event } from '../types/event';

const API_URL = 'http://localhost:3001/api';

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
  organizerId: number;
}

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

export async function createEvent(data: CreateEventData): Promise<Event> {
  const token = localStorage.getItem('eventhub_token');

  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Impossible de créer l’événement');
  }

  return result;
}
