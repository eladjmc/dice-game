const selectors = {
  diceOne: document.querySelector(".dice-one"),
  diceTwo: document.querySelector(".dice-two"),
  input: {
    holdButton: document.querySelector(".hold-btn"),
    rollDice: document.querySelector(".rolldice-btn"),
  },
};
const switchTurnSound = new Audio("../assets/audio/turnEnd.mp3");
const rollDiceSound = new Audio("../assets/audio/RollingDice.mp3");
export class Player {
  constructor(start, name = "PLAYER 1", uiSelectors) {
    this.uiSelectors = uiSelectors;
    this.turn = start;
    this.totalScore = 0;
    this.currentScore = 0;
    this.dice1 = 1;
    this.dice2 = 1;
    this.scoreToWin = 0;
    this.isGameOver = false;

    this.name = name.toUpperCase();
    this.eventListeners();
  }

  hold() {
    if (!this.turn) {
      return;
    }
    this.totalScore += this.currentScore;
    this.currentScore = 0;
  }

  changeTurns() {
    this.uiSelectors.background.classList.toggle("not-my-turn-background");
    this.uiSelectors.playersCurrentScoreContainer.classList.toggle(
      "not-my-turn-score-container"
    );
    this.uiSelectors.background.classList.toggle("my-turn-background");
    this.uiSelectors.playersCurrentScoreContainer.classList.toggle(
      "my-turn-score-container"
    );
    this.turn = !this.turn;
  }

  resetPlayerUI() {
    if (this.turn) {
      this.uiSelectors.background.classList.remove("not-my-turn-background");
      this.uiSelectors.playersCurrentScoreContainer.classList.remove(
        "not-my-turn-score-container"
      );
      this.uiSelectors.background.classList.add("my-turn-background");
      this.uiSelectors.playersCurrentScoreContainer.classList.add(
        "my-turn-score-container"
      );
    } else {
      this.uiSelectors.background.classList.remove("my-turn-background");
      this.uiSelectors.playersCurrentScoreContainer.classList.remove(
        "my-turn-score-container"
      );
      this.uiSelectors.background.classList.add("not-my-turn-background");
      this.uiSelectors.playersCurrentScoreContainer.classList.add(
        "not-my-turn-score-container"
      );
    }
  }

  updateUI() {
    this.uiSelectors.playersScore.textContent = this.totalScore.toString();
    this.uiSelectors.playersCurrentScore.textContent =
      this.currentScore.toString();
  }

  endTurn(isGameOver = false) {
    switchTurnSound.pause();
    switchTurnSound.currentTime = 0.3;
    switchTurnSound.play();
    this.hold();
    this.changeTurns();
    this.updateUI();
  }

  eventListeners() {
    selectors.input.holdButton.addEventListener("click", () => {
      if (this.isGameOver) {
        return;
      }
      this.endTurn();
    });

    selectors.input.rollDice.addEventListener("click", () => {
      if (this.isGameOver) {
        return;
      }
      rollDiceSound.pause();
      rollDiceSound.currentTime = 0;
      rollDiceSound.play();
      this.playerRolled();
    });
  }

  playerRolled() {
    if (this.turn) {
      this.dice1 = this.diceRoll();
      this.dice2 = this.diceRoll();
      localStorage.setItem("dice1", this.dice1);
      localStorage.setItem("dice2", this.dice2);
      selectors.diceOne.style = `background: url('./assets/images/dice-${this.dice1}.png') no-repeat center center/cover;`;
      selectors.diceTwo.style = `background: url('./assets/images/dice-${this.dice2}.png') no-repeat center center/cover;`;
    }
    setTimeout(() => {
      this.dice1 = parseInt(localStorage.getItem("dice1"));
      this.dice2 = parseInt(localStorage.getItem("dice2"));
      this.makeAMove(this.dice1, this.dice2);
    }, 300);
  }

  makeAMove(dice1, dice2) {
    if (dice1 + dice2 === 12) {
      this.currentScore = 0;
      this.endTurn();
      return;
    }
    if (!this.turn) {
      return;
    }
    this.currentScore += dice1 + dice2;
    this.updateUI();
  }

  diceRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  reset(isTurn, scoreToWin) {
    this.isGameOver = false;
    this.scoreToWin = scoreToWin;
    this.totalScore = 0;
    this.currentScore = 0;
    this.turn = isTurn;
    this.resetPlayerUI();
    this.updateUI();
  }
}
