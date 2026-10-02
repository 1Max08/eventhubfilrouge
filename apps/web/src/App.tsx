import { useEffect, useState } from 'react';
import './App.css';
import { getEvents } from './services/event.service';
import type { Event } from './types/event';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch {
        setError('Impossible de charger les événements.');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (selectedEventId !== null) {
    return (
      <>
        {' '}
        <header className="header">
          {' '}
          <div className="container header-content">
            <button
              className="logo-button"
              onClick={() => setSelectedEventId(null)}
            >
              EventHub{' '}
            </button>

            <button className="login-button">Connexion</button>
          </div>
        </header>
        <EventDetails
          eventId={selectedEventId}
          onBack={() => setSelectedEventId(null)}
        />
      </>
    );
  }

  if (showLogin) {
    return (
      <>
        <header className="header">
          <div className="container header-content">
            <button className="logo-button" onClick={() => setShowLogin(false)}>
              EventHub
            </button>
          </div>
        </header>

        <Login
          onBack={() => setShowLogin(false)}
          onLogin={() => setShowLogin(false)}
        />
      </>
    );
  }

  return (
    <div className="app">
      {' '}
      <header className="header">
        {' '}
        <div className="container header-content">
          <button
            className="logo-button"
            onClick={() => setSelectedEventId(null)}
          >
            EventHub{' '}
          </button>

          <nav>
            <a href="#events">Événements</a>
            <button className="login-button" onClick={() => setShowLogin(true)}>
              Connexion
            </button>
          </nav>
        </div>
      </header>
      <main>
        <section className="hero-section">
          <div className="container">
            <p className="hero-label">EVENTHUB</p>

            <h2>
              Découvrez les événements
              <br />
              qui vous correspondent.
            </h2>

            <p className="hero-description">
              Trouvez votre prochain événement et réservez votre place
              simplement.
            </p>
          </div>
        </section>

        <section id="events" className="events-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-label">AGENDA</p>
                <h2>Prochains événements</h2>
              </div>

              <span>{events.length} événement(s)</span>
            </div>

            {loading && <p className="status">Chargement des événements...</p>}

            {error && <p className="status error">{error}</p>}

            {!loading && !error && events.length === 0 && (
              <p className="status">
                Aucun événement disponible pour le moment.
              </p>
            )}

            <div className="events-grid">
              {events.map((event) => (
                <article className="event-card" key={event.id}>
                  <div className="event-date">
                    {new Date(event.startDate).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>

                  <div className="event-content">
                    <p className="event-location">
                      {event.location ?? 'Lieu à définir'}
                    </p>

                    <h3>{event.title}</h3>

                    <p className="event-description">{event.description}</p>

                    <div className="event-footer">
                      <strong>{Number(event.price).toFixed(2)} €</strong>

                      <button onClick={() => setSelectedEventId(event.id)}>
                        Voir l'événement
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="container">
          <p>© 2026 EventHub — Plateforme de gestion d'événements</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
