import React from 'react';
import { Link } from 'react-router-dom';
import './Games.css';

const Games = () => {
  return (
    <div className="games-container">
      <h1 className="games-title">👾 ¡Elige tu juego!</h1>
      <div className="games-buttons">
        <Link to="/hangman">
          <button className="game-btn">🎯 Ahorcado</button>
        </Link>
        <Link to="/memorama">
          <button className="game-btn">🧠 Memorama</button>
        </Link>
      </div>
    </div>
  );
};

export default Games;