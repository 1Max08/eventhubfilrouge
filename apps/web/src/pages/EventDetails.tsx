import { useEffect, useState } from 'react';
import type { Event } from '../types/event';
import { getEventById } from '../services/event.service';

interface EventDetailsProps {
  eventId: number;
  onBack: () => void;
}

function EventDetails({ eventId, onBack }: EventDetailsProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getEventById(eventId);
        setEvent(data);
      } catch {
        setError("Impossible de récupérer l'événement.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <main className="details-page">
        {' '}
        <div className="container">
          {' '}
          <p className="status">Chargement...</p>{' '}
        </div>{' '}
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="details-page">
        {' '}
        <div className="container">
          {' '}
          <p className="status error">{error || 'Événement introuvable.'} </p>
          <button className="back-button" onClick={onBack}>
            ← Retour aux événements
          </button>
        </div>
      </main>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <main className="details-page">
      {' '}
      <div className="container">
        {' '}
        <button className="back-button" onClick={onBack}>
          ← Retour aux événements{' '}
        </button>
        <article className="event-details">
          <div className="event-details-header">
            <p className="section-label">ÉVÉNEMENT</p>

            <h1>{event.title}</h1>

            <p className="event-details-location">
              📍 {event.location ?? 'Lieu à définir'}
            </p>
          </div>

          <div className="event-details-grid">
            <section>
              <h2>Description</h2>

              <p className="event-details-description">{event.description}</p>
            </section>

            <aside className="event-info">
              <div>
                <span>Date</span>
                <strong>
                  {startDate.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </strong>
              </div>

              <div>
                <span>Horaire</span>
                <strong>
                  {startDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  →{' '}
                  {endDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </div>

              <div>
                <span>Capacité</span>
                <strong>{event.capacity} places</strong>
              </div>

              <div>
                <span>Prix</span>
                <strong>{Number(event.price).toFixed(2)} €</strong>
              </div>

              <button className="reserve-button">Réserver ma place</button>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}

export default EventDetails;
