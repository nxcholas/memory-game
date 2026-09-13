import { useState, useEffect } from "react";
import { shuffle } from "lodash-es";

type MemoryGameProps = {
  images: string[];
};

type CardProps = {
  id: number;
  imgSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
};

function createInitialCards({ images }: MemoryGameProps) {
  const initialCards = [...images, ...images].map((imgSrc, index) => ({
    id: index,
    imgSrc: imgSrc,
    isFlipped: false,
    isMatched: false,
  }));

  return initialCards;
}

function MemoryGame({ images }: MemoryGameProps) {
  const [cards, setCards] = useState(() => createInitialCards({ images }));

  const [selected, setSelected] = useState<number[]>([]);

  // shuffle and reset
  const handleShuffle = () => {
    setCards(
      shuffle(
        cards.map((card) => ({
          ...card,
          isFlipped: false,
          isMatched: false,
        })),
      ),
    );

    setSelected([]);
  };
  const handleCardClick = (selectedCard: CardProps) => {
    if (selected.length < 2) {
      setSelected([...selected, selectedCard.id]);
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCard.id ? { ...card, isFlipped: true } : card,
        ),
      );
    } else {
      // when 3rd card clicked,
      // replace selected(2) to only third card, update cards[] to update DOM

      // store previous ID's
      const [firstId, secondId] = selected;
      // replaced selected
      setSelected([selectedCard.id]);
      // if the iterated card's id matches either of the stored id's
      setCards((prevCards) =>
        prevCards.map((card) => {
          // reset back to unflipped
          if (card.id === firstId || card.id === secondId) {
            return { ...card, isFlipped: false };
          }
          // if the card id matches the new 3rd selected card, set the third card to flipped
          if (card.id === selectedCard.id) {
            return { ...card, isFlipped: true };
          }
          return card;
        }),
      );

      setSelected([selectedCard.id]);
    }
  };

  // check for match
  useEffect(() => {
    // check if there are 2 cards selected
    if (selected.length === 2) {
      const [firstId, secondId] = selected;

      // find the card in cards that matches the first and second selected cards
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      // if the imgsrc of the first card matches the imgsrc of the second card (which should be the same) then set isMatched to true
      if (firstCard?.imgSrc === secondCard?.imgSrc) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card,
          ),
        );
      }
    }
  }, [selected]);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {cards.map((card, idx) => (
        <div key={idx} className="w-40 h-auto">
          {card.isFlipped || card.isMatched ? (
            <img
              src={card.imgSrc}
              alt={`Card ${idx + 1}`}
              className="aspect-square"
            />
          ) : (
            <div
              key={idx}
              onClick={() => handleCardClick(card)}
              className="bg-gray-300 w-40 h-40 hover:bg-gray-400 cursor-pointer"
            ></div>
          )}
        </div>
      ))}
      {/* button to shuffle */}
      <button
        onClick={() => {
          handleShuffle();
        }}
        className="border cursor-pointer rounded-sm bg-gray-100 hover:bg-white"
      >
        shuffle
      </button>
    </div>
  );
}

export default MemoryGame;
