import './Memorama.css';
import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export default function Memorama() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [wrongMatch, setWrongMatch] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const animales = [
      { id: 1, emoji: "Contraseña", name: "Llave secreta para tus cuentas." },
      { id: 2, emoji: "Phishing", name: "Estafa digital con correos falsos." },
      { id: 3, emoji: "Malware", name: "Software dañino que roba datos." },
      { id: 4, emoji: "Antivirus", name: "Protección contra amenazas digitales." },
      { id: 5, emoji: "VPN", name: "Oculta tu ubicación y protege conexión." },
    ];

    const pairs = animales.flatMap(animal => [
      { id: animal.id, content: animal.emoji, type: "emoji" },
      { id: animal.id, content: animal.name, type: "name" }
    ]);

    const shuffledCards = [...pairs].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);

    setTimeout(() => setShowAll(false), 2000);
  }, []);

  const handleFlip = (index) => {
    if (flippedCards.includes(index) || matchedPairs.includes(cards[index].id) || flippedCards.length === 2) return;

    setFlippedCards([...flippedCards, index]);

    if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      if (cards[firstIndex].id === cards[index].id && cards[firstIndex].type !== cards[index].type) {
        setMatchedPairs([...matchedPairs, cards[firstIndex].id]);
      } else {
        setWrongMatch(true);
        setTimeout(() => {
          setWrongMatch(false);
          setFlippedCards([]);
        }, 800);
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }

    if (matchedPairs.length + 1 === cards.length / 2) {
      setGameWon(true);
    }
  };

  return (
    <div className="memorama-page">
      <h1>Memorama</h1>
      <div className="memorama-grid">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`card ${flippedCards.includes(index) || matchedPairs.includes(card.id) || showAll ? 'flipped' : ''} ${wrongMatch && flippedCards.includes(index) ? 'shake' : ''}`}
            onClick={() => handleFlip(index)}
            style={{ backgroundColor: matchedPairs.includes(card.id) ? '#FFF3C6' : '#318b85' }}
          >
            <span className="card-text">
              {matchedPairs.includes(card.id) ? card.content : (flippedCards.includes(index) || showAll ? card.content : "?")}
            </span>
          </div>
        ))}
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 ¡Has completado el memorama! 🎉
          <button className="next-level-button" onClick={() => alert("Accediendo al siguiente nivel...")}>
            Ir al siguiente nivel
          </button>
        </div>
      )}
    </div>
  );
}
