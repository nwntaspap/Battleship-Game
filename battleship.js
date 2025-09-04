let model = {
  sizeBoard: 7,
  numShips: 3,
  shipLength: 3,
  shipSunk: 0,

  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],
  fire(guess) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      // We can grab the index of guess,
      // instead of looping through locations,
      // to find the if guess was a hit
      let index = ship.locations.indexOf(guess);

      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipSunk++;
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
  generateShipLocations() {
    let locations;
    for (let i = 0; i < this.numShips; i++) {
      do {
        // generate a new set of locations.
        locations = this.generateShip();
      } while (this.collision(locations));
      {
        this.ships[i].locations = locations;
      }
    }
  },
  generateShip() {
    let direction = Math.floor(Math.random() * 2);
    let row;
    let col;
    if (direction === 1) {
      // Generate a starting location for a horizontal ship
      row = Math.floor(Math.random() * this.sizeBoard);
      col = Math.floor(Math.random() * (this.sizeBoard - this.shipLength) + 1);
    } else {
      // Generate a starting location for a vertical ship
      row = Math.floor(Math.random() * (this.sizeBoard - this.shipLength) + 1);
      col = Math.floor(Math.random() * this.sizeBoard);
    }
    let newShipLocations = [];
    for (let i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // add location to array for new horizontal ship
        newShipLocations.push(`${row}${col + i}`);
      } else {
        // add location to array for new vertical ship
        newShipLocations.push(`${row + i}${col}`);
      }
    }

    return newShipLocations;
  },
  collision(locations) {
    for (let i = 0; i < this.numShips; i++) {
      let ship = this.ships[i];
      // check to see if any of the locations
      // in the new ship’s locations array are in
      // an existing ship’s locations array
      for (let j = 0; j < locations.length; j++) {
        if (ship.locations.includes(locations[j])) {
          return true;
        }
      }
    }

    return false;
  },
};

let view = {
  // this method takes a string message and displays it
  // in the message display area
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
    // validating user guess
    let location = this.parseGuess(guess);
    if (location) {
      this.guesses++;
      let hit = model.fire(location);
      // If hit is true and shipSunk is equal to the num of ships
      if (hit && model.shipSunk === model.numShips) {
        view.displayMessage(
          `You sank all my battleships, in ${this.guesses} guesses`
        );
      }
    }
  },

  parseGuess(guess) {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
      alert("Oops, please enter a letter and a number on the board.");
    } else {
      let firstChar = guess.charAt(0);
      let row = alphabet.indexOf(firstChar);
      let collumn = guess.charAt(1);

      if (isNaN(collumn)) {
        alert("Oops, that isn't on the board.");
      } else if (
        row < 0 ||
        row >= model.sizeBoard ||
        collumn < 0 ||
        collumn >= model.sizeBoard
      ) {
        alert("Oops, that's off the board!");
      } else {
        return row + collumn;
      }
    }
    // We return null if any of the checks failed
    return null;
  },
};

function init() {
  let fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  let guessInput = document.getElementById("guessInput");
  guessInput.onkeydown = handleKeyDown;

  // so it happens right when you load
  // the game before you start playing
  model.generateShipLocations();
}

function handleFireButton() {
  let guessInput = document.getElementById("guessInput");
  let guess = guessInput.value;
  // We pass player guess to the controller
  controller.processGuess(guess);

  guessInput.value = "";
}

function handleKeyDown(e) {
  let fireButton = document.getElementById("fireButton");
  // If key pressed was Enter
  if (e.keyCode === 13) {
    fireButton.click(); // make button click
    // we return false so the form doesn't do anything
    // else (like try to submit itself)
    return false;
  }
}

// run the init function after all DOM is loaded
window.onload = init;
