import { useState } from 'react';
import { login } from '../services/auth.service';

interface LoginProps {
  onBack: () => void;
  onLogin: () => void;
}

function Login({ onBack, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result = await login({
        email,
        password,
      });

      localStorage.setItem('eventhub_token', result.token);
      localStorage.setItem('eventhub_user', JSON.stringify(result.user));

      onLogin();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Connexion impossible',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      {' '}
      <div className="auth-card">
        {' '}
        <button className="back-button" onClick={onBack}>
          ← Retour{' '}
        </button>
        <p className="section-label">EVENTHUB</p>
        <h1>Connexion</h1>
        <p className="auth-description">
          Connectez-vous à votre compte EventHub.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="exemple@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Login;
