let model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: ["06", "16", "26"], hits: ["", "", ""] },
    { locations: ["24", "34", "44"], hits: ["", "", ""] },
    { locations: ["10", "11", "12"], hits: ["", "", ""] },
  ],

  fire(guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      let index = ship.locations.indexOf(guess);

      if (index >= 0) {
        ship.hits[index] = "hits";
        view.displayHit(guess);
        view.displayMessage("HIT!");

        if (this.isSunk(ship)) {
          this.shipsSunk++;
          view.displayMessage("You sank my battleship!");
        }

        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("MISS!");
    return false;
  },
  isSunk(ship) {
    return !ship.hits.includes("");
  },
};

let view = {
  displayMessage(msg) {
    let messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss(location) {
    let cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
};

let controller = {
  guesses: 0,

  processGuess(guess) {
    let location = parseGuess(guess);
    if (location) {
      this.guesses++;

      let hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          `You sank all my battleships, in ${this.guesses} guesses`
        );
      }
    }
  },
};

function parseGuess(guess) {
  const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    let firstChar = guess.charAt(0);
    let row = alphabet.indexOf(firstChar);
    let column = guess.charAt(1);

    if (isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }

  return null;
}
