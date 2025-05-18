import React from 'react';
import { Link } from 'react-router-dom';
import './games.css';

const Games = () => {
  return (
    <div className="games-container">
      <h1 className="games-title">👾 ¡Elige tu juego!</h1>
      <div className="games-buttons">
        <Link to="/games/hangman">
          <button className="game-btn">Ahorcado</button>
        </Link>
        <Link to="/games/memorama">
          <button className="game-btn">Memorama</button>
        </Link>
      </div>
    </div>
  );
};

export default Games;