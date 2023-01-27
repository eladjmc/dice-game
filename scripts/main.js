// #########################################################################################################################
// #                                               IMPORTS                                                                 #
// #########################################################################################################################
import { Player } from "./player.js";

// #########################################################################################################################
// #                                              SELECTORS                                                                #
// #########################################################################################################################

const gameSelectors = {
  startGameBtn: document.querySelector(".start-game-btn"),
  scoreToWinInput: document.querySelector(".score-to-win-input"),
  errorInput: document.querySelector(".error-input"),
  gameSetupWindow: document.querySelector(".setup-game"),
  gameRestartBtn: document.querySelector(".new-game-btn"),
  holdButton: document.querySelector(".hold-btn"),
};

const playerOneUiSelectors = {
  background: document.querySelector(".left-background"),
  playersName: document.querySelector(".left .player-name"),
  playersScore: document.querySelector(".left .player-score"),
  playersCurrentScoreContainer: document.querySelector(
    ".left .current-rolls-container"
  ),
  playersCurrentScore: document.querySelector(".left .current-roll-score"),
  winLossText: document.querySelectorAll(".win-loss ")[0],
};

const playerTwoUiSelectors = {
  background: document.querySelector(".right-background"),
  playersName: document.querySelector(".right .player-name"),
  playersScore: document.querySelector(".right .player-score"),
  playersCurrentScoreContainer: document.querySelector(
    ".right .current-rolls-container"
  ),
  playersCurrentScore: document.querySelector(".right .current-roll-score"),
  winLossText: document.querySelectorAll(".win-loss ")[1],
};

// #########################################################################################################################
// #                                        GLOBAL VARIABLES                                                               #
// #########################################################################################################################

let scoreToWin = 50;
let winningMessage = "";
const startGameSound = new Audio("../assets/audio/RoundOneFight.mp3");
const player1 = new Player(true, "player1", playerOneUiSelectors);
const player2 = new Player(false, "player2", playerTwoUiSelectors);

// #########################################################################################################################
// #                                             FUNCTIONS                                                                 #
// #########################################################################################################################
const main = () => {
  evenListeners();
};

const startGame = () => {
  const currentInput = parseInt(gameSelectors.scoreToWinInput.value);
  if (!currentInput || currentInput < 50) {
    gameSelectors.errorInput.style.opacity = "1";
    return;
  }
  gameSelectors.errorInput.style.opacity = "0";
  scoreToWin = currentInput;
  gameSelectors.gameSetupWindow.style.opacity = "0";

  gameSelectors.scoreToWinInput.value = "50";
  delay(1000).then(
    () => (gameSelectors.gameSetupWindow.style.display = "none"),
    startGameSound.play()
  );
};

const resetGame = () => {
  gameSelectors.gameSetupWindow.style.display = "flex";

  delay(100).then(() => (gameSelectors.gameSetupWindow.style.opacity = "1"));
};

const evenListeners = () => {
  gameSelectors.startGameBtn.addEventListener("click", () => {
    player1.reset(true, scoreToWin);
    player2.reset(false, scoreToWin);
    startGame();
  });

  gameSelectors.gameRestartBtn.addEventListener("click", () => {
    resetGame();
  });

  gameSelectors.holdButton.addEventListener("click", () => {
    const playerWon = getWinner();
    if (!playerWon) {
      return;
    }
    if (playerWon === 1) {
      setWinning(playerOneUiSelectors, playerTwoUiSelectors);
    } else {
      setWinning(playerTwoUiSelectors, playerOneUiSelectors);
    }
  });
};

const getWinner = () => {
  const playerOneScore = Number(playerOneUiSelectors.playersScore.textContent);
  const playerTwoScore = Number(playerTwoUiSelectors.playersScore.textContent);
  if (playerOneScore >= scoreToWin) {
    if (playerOneScore === scoreToWin) {
      winningMessage = `Player1 got ${scoreToWin} score`;
      return 1;
    }
    winningMessage = `Passed the target score`;
    return 2;
  }
  if (playerTwoScore >= scoreToWin) {
    if (playerTwoScore === scoreToWin) {
      winningMessage = `Player2 got ${scoreToWin} score`;
      return 2;
    }
    winningMessage = `Passed the target score`;
    return 1;
  }
  return 0; // returns that no one win
};

const setWinning = (winner, loser) => {
  player1.endTurn();
  player2.endTurn();
  winner.winLossText.style.display = "block";
  winner.winLossText.textContent = "YOU WIN!";
  winner.winLossText.style.color = "#9a1246";
  winner.background.classList.add("back-win");
  winner.playersName.classList.add('winning-player-text');

  loser.winLossText.style.display = "block";
  loser.winLossText.textContent = winningMessage;
  loser.winLossText.style.color = "#2f2f2f";
};

const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

window.onload = () => {
  main();
};
