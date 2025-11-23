import React from 'react';
import { Link } from 'react-router-dom';
import './Games.css';

const Games = () => {
  return (
    <div className="games-page">
      <div className="games-container">
        <h1 className="games-title">¡Elige tu juego!</h1>
        <p className="games-subtitle">Aprende jugando con ciberseguridad</p>
        <div className="games-buttons">
          <Link to="/hangman" className="game-link">
            <button className="game-btn">Ahorcado</button>
          </Link>
          <Link to="/memorama" className="game-link">
            <button className="game-btn">Memorama</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Games;