console.log("Check Connection");

// We make sure all of our HTML code is loaded before reading this JavaScript code
// Actually it has the same effect to put <script src="xxx.js"></script> in the end of the HTML file
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  // * Create a Board
  function createBoard() {
    // * Get Shuffled Game Array with Random Bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("unopened");
    const gameArray = emptyArray.concat(bombsArray);
    console.log(gameArray);
    // The { Math.random() - 0.5 } here is the compare function
    // The array elements are sorted according to the return value of the compare function
    // If the return value > 0, then sort "a" after "b"
    // Else if the return value < 0, then sort "a" before "b"
    // Else if the return value === 0, then keep the original order of "a" and "b"
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    // * Use For Loop to Create the Game Board with Bombs
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // Normal Click Event Listener
      square.addEventListener("click", () => {
        // Trigger the other click() function
        click(square);
      });

      // The ".oncontextmenu" Event is Typically Triggered by a "right mouse click"
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    // * Set Up Game Board by Adding Numbers to Squares
    for (let i = 0; i < squares.length; i++) {
      // Total Number of Bomb around this Square
      let totalBombs = 0;
      // In this game board, the index of squares on left edge are 0, 10, 20 ... 90
      const isLeftEdge = i % width === 0;
      // In this game board, the index of squares on right edge are 9, 19, 29 ... 99
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("unopened")) {
        // Checking if the North-West Square Contains Bomb or not
        if (
          // When (i > width - 1) is true, that means not in the first row
          i > width - 1 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        ) {
          totalBombs++;
        }
        // Checking if the North Square Contains Bomb or not
        if (i > width - 1 && squares[i - width].classList.contains("bomb")) {
          totalBombs++;
        }
        // Checking if the North-East Square Contains Bomb or not
        if (
          i > width - 1 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        ) {
          totalBombs++;
        }
        // Checking if the South-West Square Contains Bomb or not
        if (
          // When (i < width * width - width) is true, that means not in the last row
          i < width * width - width &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        ) {
          totalBombs++;
        }
        // Checking if the South Square Contains Bomb or not
        if (
          i < width * width - width &&
          squares[i + width].classList.contains("bomb")
        ) {
          totalBombs++;
        }
        // Checking if the South-East Square Contains Bomb or not
        if (
          i < width * width - width &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        ) {
          totalBombs++;
        }
        // Checking if the West Square Contains Bomb or not
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) {
          totalBombs++;
        }
        // Checking if the East Square Contains Bomb or not
        if (
          // When (i < width * width - 1) is true, that means not in the last square
          i < width * width - 1 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        ) {
          totalBombs++;
        }

        // * Assign the totalBombs value to the [data] of the Square
        squares[i].setAttribute("data", totalBombs);
      }
    }
  }
  createBoard();

  // * Add Flag with Right Click
  function addFlag(square) {
    if (isGameOver) return;

    if (!square.classList.contains("opened") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        flags++;
        checkForWin();
      } else {
        square.classList.remove("flag");
        flags--;
      }
    }
  }

  // * Click on Square Function
  function click(square) {
    let currentId = square.id;

    if (isGameOver) return;
    if (
      square.classList.contains("opened") ||
      square.classList.contains("flag")
    )
      return;

    // When the Square is a "bomb"
    if (square.classList.contains("bomb")) {
      // Stop the Game
      gameOver(square);
    } else {
      // Access the Square "totalBombs" Value
      let totalBombs = square.getAttribute("data");
      // When the Square is a "mine-neighbor"
      if (totalBombs != 0) {
        square.classList.add(`mine-neighbour-${totalBombs}`);
        square.classList.remove("unopened");
        // * Make Sure We Stop the Recursion when the Square is a "mine-neighbor"
        return;
      }
      // When the Square is a "empty" Square, Run the Recursion
      checkSquare(square, currentId);
    }

    // Update the "empty" Square Class List in Reverse Order
    square.classList.add("opened");
    square.classList.remove("unopened");
  }

  // * Check Neighboring Squares once Square is Clicked
  function checkSquare(square, currentId) {
    // In this game board, the index of squares on left edge are 0, 10, 20 ... 90
    const isLeftEdge = currentId % width === 0;
    // In this game board, the index of squares on right edge are 9, 19, 29 ... 99
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      // Access the West Square and Call the "click()" on this West Square
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the East Square and Call the "click()" on this West Square
      if (currentId < width * width - 1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the North Square and Call the "click()" on this West Square
      if (currentId > width - 1) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the South Square and Call the "click()" on this West Square
      if (currentId < width * width - width) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the North-West Square and Call the "click()" on this West Square
      if (currentId > width - 1 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the North-East Square and Call the "click()" on this West Square
      if (currentId > width - 1 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the South-West Square and Call the "click()" on this West Square
      if (currentId < width * width - width && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      // Access the South-East Square and Call the "click()" on this West Square
      if (currentId < width * width - width && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  // * Game Over Function
  function gameOver(square) {
    alert("Boom! Game Over!");
    console.log("Boom! Game Over!");
    isGameOver = true;

    // * Show All Bombs Location
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.classList.add("bomb-show");
        square.classList.remove("bomb");
      }
      square.style.cursor = "auto";
    });
  }

  // * Check For Win
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        alert("You Win");
        console.log("Win!");
        isGameOver = true;
      }
    }
  }
});
