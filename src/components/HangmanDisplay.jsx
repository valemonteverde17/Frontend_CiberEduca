import { useState, useEffect } from 'react';
import './HangmanDisplay.css';

// Teclado QWERTY layout
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
];

const ALL_VALID_CHARS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789'.split('');
const SPECIAL_CHARS = [' ', '-', '_', '.', ',', '!', '?', ':', ';'];

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
        // Si la palabra cambió, limpiar el estado y revelar caracteres especiales
        const autoReveal = SPECIAL_CHARS.filter(char => word.includes(char));
        setGuessed(autoReveal);
        localStorage.removeItem('hangman_game');
      }
    } else {
      // Revelar automáticamente espacios y caracteres especiales
      const autoReveal = SPECIAL_CHARS.filter(char => word.includes(char));
      setGuessed(autoReveal);
    }
  }, [word]);

  useEffect(() => {
    localStorage.setItem(
      'hangman_game',
      JSON.stringify({ word, guessed })
    );
  }, [guessed, word]);

  // Filtrar solo letras y números para contar fallos (ignorar espacios y caracteres especiales)
  const fails = guessed.filter(l => !word.includes(l) && !SPECIAL_CHARS.includes(l)).length;
  
  // Verificar victoria: todas las letras y números adivinados (espacios y caracteres especiales no cuentan)
  const won = word.split('').every(c => 
    guessed.includes(c) || SPECIAL_CHARS.includes(c)
  );
  
  const lost = fails >= maxFails;

  // Soporte para teclado físico
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (won || lost) return;
      
      const key = e.key.toUpperCase();
      
      // Verificar si es una letra, número o Ñ
      if (ALL_VALID_CHARS.includes(key) && !guessed.includes(key)) {
        setGuessed([...guessed, key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [guessed, won, lost]);

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
        {word.split('').map((char, i) => {
          const isSpecial = SPECIAL_CHARS.includes(char);
          const isRevealed = guessed.includes(char) || lost || isSpecial;
          
          return (
            <span 
              key={i} 
              className={`letter ${char === ' ' ? 'space' : ''} ${isSpecial ? 'special-char' : ''}`}
            >
              {isRevealed ? (char === ' ' ? '\u00A0' : char) : '_'}
            </span>
          );
        })}
      </div>

      <div className="keyboard">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((char) => {
              const isNumber = !isNaN(char);
              return (
                <button
                  key={char}
                  className={`key ${isNumber ? 'number-key' : ''}`}
                  onClick={() => handleClick(char)}
                  disabled={guessed.includes(char) || won || lost}
                >
                  {char}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="status">
        <p>Errores: {fails} / {maxFails}</p>
        {lost && <p className="message lose">¡Perdiste! La palabra era: {word}</p>}
        {won && <p className="message win">¡Ganaste!</p>}
      </div>

      <div className="control-buttons">
        <button className="control-button primary" onClick={handleReset}>
          Otra Palabra
        </button>
        {!lost && !won && (
          <button
            className="control-button secondary"
            onClick={() => {
                const allWrong = ALL_VALID_CHARS.filter(l => !word.includes(l));
                setGuessed([...guessed, ...allWrong]);
            }}
          >
            Rendirse
          </button>
        )}
      </div>
    </div>
  );
}
