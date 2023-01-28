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
  rollDice: document.querySelector(".rolldice-btn"),
  themeColor: document.querySelectorAll(".theme-color"),
  gameContainer: document.querySelector(".game-container"),
  currentScoreContainers: document.querySelectorAll(".current-rolls-container"),
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
let isGameOver = false;
const startGameSound = new Audio("../assets/audio/RoundOneFight.mp3");
const gameOverSound = new Audio("../assets/audio/Fatality.mp3");
const tenseGameMusic = new Audio("../assets/audio/TenseMusic.mp3");
const player1 = new Player(true, "player1", playerOneUiSelectors);
const player2 = new Player(false, "player2", playerTwoUiSelectors);

// #########################################################################################################################
// #                                             FUNCTIONS                                                                 #
// #########################################################################################################################
const main = () => {
  changeTheme(1);
  removeWinsUI();
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
  setTimeout(() => {
    gameSelectors.gameSetupWindow.style.display = "none";
  }, 500);
  startGameSound.play()
  tenseGameMusic.loop = true;
  tenseGameMusic.play();
};

const resetGame = () => {
  tenseGameMusic.pause();
  tenseGameMusic.currentTime = 0;
  removeWinsUI();
  gameSelectors.gameSetupWindow.style.display = "flex";
  isGameOver = false;
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
    if (isGameOver) {
      return;
    }
    const playerWon = getWinner();
    if (!playerWon) {
      return;
    }
    gameOverSound.play();
    isGameOver = true;
    if (playerWon === 1) {
      setWinning(playerOneUiSelectors, playerTwoUiSelectors);
    } else {
      setWinning(playerTwoUiSelectors, playerOneUiSelectors);
    }
  });

  for (let i = 0; i < gameSelectors.themeColor.length; i++) {
    gameSelectors.themeColor[i].addEventListener("click", () => {
      changeTheme(i + 1);
    });
  }
};

// #########################################################################################################################
// #                                       Winner Display LOGIC                                                            #
// #########################################################################################################################

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
  player1.isGameOver = isGameOver;
  player2.isGameOver = isGameOver;
  //winner-setup
  winner.winLossText.style.display = "block";
  winner.winLossText.textContent = "YOU WIN!";
  winner.background.classList.add("back-win");
  winner.playersName.classList.remove('lose-text');
  //loser-setup
  loser.winLossText.style.display = "block";
  loser.winLossText.classList.add('lose-text');
  loser.winLossText.textContent = winningMessage;
};
// #########################################################################################################################
// #                                      Remove Added UI After Restarts                                                   #
// #########################################################################################################################

const removeWinsUI = () => {
  playerOneUiSelectors.playersName.classList.add('lose-text');
  playerTwoUiSelectors.playersName.classList.add('lose-text');
  playerOneUiSelectors.winLossText.classList.remove(`lose-text`);
  playerTwoUiSelectors.winLossText.classList.remove(`lose-text`);
  playerOneUiSelectors.background.classList.remove("back-win");
  playerTwoUiSelectors.playersName.classList.remove("winning-player-text");
  playerTwoUiSelectors.background.classList.remove("back-win");
  playerTwoUiSelectors.playersName.classList.remove("winning-player-text");
  playerOneUiSelectors.winLossText.style.display = "none";
  playerTwoUiSelectors.winLossText.style.display = "none";
};



// #########################################################################################################################
// #                                      THEME CHANGE LOGIC                                                               #
// #########################################################################################################################


const changeTheme = (themeId) => {
  for (let i = 0; i < gameSelectors.themeColor.length; i++) {
    gameSelectors.gameContainer.classList.remove(`color-${i + 1}`);
    gameSelectors.gameSetupWindow.classList.remove(`color-${i + 1}-menu`);
    gameSelectors.currentScoreContainers[0].classList.remove(
      `background-theme-${i + 1}`
    );
    gameSelectors.currentScoreContainers[1].classList.remove(
      `background-theme-${i + 1}`
    );
    playerOneUiSelectors.winLossText.classList.remove(`winning-player-text-${i+1}`);
    playerTwoUiSelectors.winLossText.classList.remove(`winning-player-text-${i+1}`);
    playerOneUiSelectors.playersName.classList.remove(`winning-player-text-${i+1}`);
    playerTwoUiSelectors.playersName.classList.remove(`winning-player-text-${i+1}`);
    playerOneUiSelectors.playersScore.classList.remove(`winning-player-text-${i+1}`);
    playerTwoUiSelectors.playersScore.classList.remove(`winning-player-text-${i+1}`);

  }
  gameSelectors.gameContainer.classList.add(`color-${themeId}`);
  gameSelectors.gameSetupWindow.classList.add(`color-${themeId}-menu`);
  gameSelectors.currentScoreContainers[0].classList.add(
    `background-theme-${themeId}`
  );

  gameSelectors.currentScoreContainers[1].classList.add(`background-theme-${themeId}`);
  playerOneUiSelectors.winLossText.classList.add(`winning-player-text-${themeId}`);
  playerTwoUiSelectors.winLossText.classList.add(`winning-player-text-${themeId}`);
  playerOneUiSelectors.playersName.classList.add(`winning-player-text-${themeId}`);
  playerTwoUiSelectors.playersName.classList.add(`winning-player-text-${themeId}`);
  playerOneUiSelectors.playersScore.classList.add(`winning-player-text-${themeId}`);
  playerTwoUiSelectors.playersScore.classList.add(`winning-player-text-${themeId}`);
};


//TODO: replace this with none promise delay
const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

window.onload = () => {
  main();
};
