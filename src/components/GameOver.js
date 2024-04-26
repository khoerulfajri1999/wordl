import React, { useContext } from "react";
import { AppContext } from "../App";

function GameOver() {
  const { currAttempt, gameOver, correctWord } = useContext(AppContext);

  const handleRefresh = () => {
    window.location.reload();
  };
  return (
    <div className="gameOver">
      <h3>
        {gameOver.guessedWord
          ? "Kamu benar menebak kata"
          : "Kamu gagal menebak kata"}
      </h3>
      <h1>Kata yang benar: {correctWord}</h1>
      {gameOver.guessedWord && (
        <h3>Kamu menebaknya hingga {currAttempt.attempt} kali</h3>
      )}
      <button className="coba-lagi" onClick={handleRefresh}>
        Coba lagi
      </button>
    </div>
  );
}

export default GameOver;
