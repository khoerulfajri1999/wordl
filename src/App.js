import { createContext, useEffect, useState } from "react";
import "./App.css";
import { Board } from "./components/Board";
import { Keyboard } from "./components/Keyboard";
import { boardDefault, generateWordSet } from "./Words";
import GameOver from "./components/GameOver";
import backgroundAudio from "./sound/background.mp3";
import kalah from "./sound/kalah.mp3";
import menang from "./sound/menang.mp3";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [correctWord, setCorrectWord] = useState("");
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [audioStarted, setAudioStarted] = useState(false);
  const [suaraKalah, setSuaraKalah] = useState(false);
  const [suaraMenang, setSuaraMenang] = useState(false);

  console.log(wordSet);
  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord);
    });
  }, []);

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letterPos > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
  };
  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord)) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      alert("Kata tidak ditemukan");
    }
    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      setSuaraMenang(true);
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      setSuaraKalah(true);
      return;
    }
  };
  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });
  };

  useEffect(() => {
    if (suaraKalah) {
      const audio = new Audio(kalah);
      audio.play();

      // Mengatur ulang state playSound setelah sound effect selesai diputar
      audio.onended = () => {
        setSuaraKalah(false);
      };
    }
  }, [suaraKalah]);

  useEffect(() => {
    if (suaraMenang) {
      const audio = new Audio(menang);
      audio.play();

      // Mengatur ulang state playSound setelah sound effect selesai diputar
      audio.onended = () => {
        setSuaraMenang(false);
      };
    }
  }, [suaraMenang]);

  useEffect(() => {
    const startAudio = () => {
      const audio = new Audio(backgroundAudio);
      audio.loop = true;
      audio.play();
      setAudioStarted(true);
    };

    if (!audioStarted) {
      window.addEventListener("click", startAudio);
      window.addEventListener("keydown", startAudio);
      // Anda juga bisa menambahkan event listener untuk event lainnya di sini
    }

    return () => {
      window.removeEventListener("click", startAudio);
      window.removeEventListener("keydown", startAudio);
      // Jangan lupa untuk menghapus event listener ketika komponen di-unmount
    };
  }, [audioStarted]);

  return (
    <div className="App">
      <nav>
        <h1>Wordl</h1> <span>versi Indonesia By Khoerul Fajri</span>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setCurrAttempt,
          onDelete,
          onEnter,
          onSelectLetter,
          correctWord,
          disabledLetters,
          setDisabledLetters,
          gameOver,
          setGameOver,
        }}
      >
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
