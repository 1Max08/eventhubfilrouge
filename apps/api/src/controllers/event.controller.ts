import type { Request, Response } from 'express';
import {
  createNewEvent,
  deleteExistingEvent,
  getAllEvents,
  getEventById,
  updateExistingEvent,
} from '../services/event.service.js';

export async function getEvents(_req: Request, res: Response): Promise<void> {
  try {
    const events = await getAllEvents();

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);

    res.status(500).json({
      message: 'Impossible de récupérer les événements',
    });
  }
}

export async function getEvent(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const event = await getEventById(id);

    if (!event) {
      res.status(404).json({
        message: 'Événement introuvable',
      });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);

    res.status(500).json({
      message: "Impossible de récupérer l'événement",
    });
  }
}

export async function createEventController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const event = await createNewEvent(req.body);

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);

    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Impossible de créer l'événement",
    });
  }
}

export async function updateEventController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const event = await updateExistingEvent(id, req.body);

    if (!event) {
      res.status(404).json({
        message: 'Événement introuvable',
      });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);

    res.status(400).json({
      message: "Impossible de modifier l'événement",
    });
  }
}

export async function deleteEventController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        message: 'ID invalide',
      });
      return;
    }

    const deleted = await deleteExistingEvent(id);

    if (!deleted) {
      res.status(404).json({
        message: 'Événement introuvable',
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);

    res.status(500).json({
      message: "Impossible de supprimer l'événement",
    });
  }
}
