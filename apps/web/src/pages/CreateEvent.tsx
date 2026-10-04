import { useState, type FormEvent } from 'react';
import { createEvent } from '../services/event.service';

interface CreateEventProps {
  onBack: () => void;
  onCreated: () => void;
}

function CreateEvent({ onBack, onCreated }: CreateEventProps) {
  const user = JSON.parse(localStorage.getItem('eventhub_user') || 'null');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await createEvent({
        title,
        description,
        location,
        startDate,
        endDate,
        capacity: Number(capacity),
        price: Number(price),
        organizerId: user.id,
      });

      onCreated();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : 'Impossible de créer l’événement',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <button className="back-button" onClick={onBack}>
          ← Retour
        </button>

        <p className="section-label">EVENTHUB</p>

        <h1>Créer un événement</h1>

        <p className="auth-description">
          Ajoutez un nouvel événement à EventHub.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Nom de l'événement"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Décrivez votre événement"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Lieu</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Paris, France"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Date de début</label>
            <input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Date de fin</label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacité</label>
            <input
              id="capacity"
              type="number"
              min="1"
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Prix (€)</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer l’événement'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateEvent;
