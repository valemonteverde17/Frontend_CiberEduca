import { useState, useEffect } from 'react';
import './HangmanDisplay.css';

const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

export default function HangmanDisplay({ word, onRestart }) {
  const [guessed, setGuessed] = useState([]);
  const maxFails = 6;

  useEffect(() => {
    const saved = localStorage.getItem('hangman_game');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.word === word) {
        setGuessed(parsed.guessed || []);
      } else {
        // Si la palabra cambió, limpiar el estado
        setGuessed([]);
        localStorage.removeItem('hangman_game');
      }
    } else {
      // Si no hay guardado, asegurar que el estado esté limpio
      setGuessed([]);
    }
  }, [word]);

  useEffect(() => {
    localStorage.setItem(
      'hangman_game',
      JSON.stringify({ word, guessed })
    );
  }, [guessed, word]);

  const fails = guessed.filter(l => !word.includes(l)).length;
  const won = word.split('').every(c => guessed.includes(c));
  const lost = fails >= maxFails;

  const handleClick = (letter) => {
    if (!guessed.includes(letter)) {
      setGuessed([...guessed, letter]);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('hangman_game');
    onRestart();
  };

  return (
    <div className="hangman-container">
      <div className="hangman-drawing">
        <svg height="250" width="200" className="hangman-figure">
          {/* horca permanente */}
          <line x1="10" y1="240" x2="150" y2="240" />
          <line x1="80" y1="20" x2="80" y2="240" />
          <line x1="80" y1="20" x2="140" y2="20" />
          <line x1="140" y1="20" x2="140" y2="50" />

          {/* muñeco progresivo */}
          {fails > 0 && <circle cx="140" cy="70" r="20" className="fade-in" />}
          {fails > 1 && <line x1="140" y1="90" x2="140" y2="150" className="fade-in" />}
          {fails > 2 && <line x1="140" y1="110" x2="120" y2="130" className="fade-in" />}
          {fails > 3 && <line x1="140" y1="110" x2="160" y2="130" className="fade-in" />}
          {fails > 4 && <line x1="140" y1="150" x2="120" y2="180" className="fade-in" />}
          {fails > 5 && <line x1="140" y1="150" x2="160" y2="180" className="fade-in" />}
        </svg>
      </div>

      <div className="word-display">
        {word.split('').map((char, i) => (
          <span key={i} className="letter">
            {guessed.includes(char) || lost ? char : '_'}
          </span>
        ))}
      </div>

      <div className="keyboard">
        {ABC.map((l) => (
          <button
            key={l}
            className="key"
            onClick={() => handleClick(l)}
            disabled={guessed.includes(l) || won || lost}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="status">
        <p>Errores: {fails} / {maxFails}</p>
        {lost && <p className="message lose">¡Perdiste! La palabra era: {word}</p>}
        {won && <p className="message win">¡Ganaste!</p>}
      </div>

      <div className="control-buttons">
        <button className="control-button primary" onClick={handleReset}>
          🔄 Otra Palabra
        </button>
        {!lost && !won && (
          <button
            className="control-button secondary"
            onClick={() => {
                const allWrong = ABC.filter(l => !word.includes(l));
                setGuessed([...guessed, ...allWrong]);
            }}
          >
            🏳️ Rendirse
          </button>
        )}
      </div>
    </div>
  );
}
