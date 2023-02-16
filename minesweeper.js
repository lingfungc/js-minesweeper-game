console.log("Check Connection");

// We make sure all of our HTML code is loaded before reading this JavaScript code
// Actually it has the same effect to put <script src="xxx.js"></script> in the end of the HTML file
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombAmount = 20;
  let squares = [];
  let isGameOver = false;

  // * Create a Board
  function createBoard() {
    // * Get Shuffled Game Array with Random Bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("unopened");
    const gameArray = emptyArray.concat(bombsArray);
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
    }

    // * Add Numbers to Squares
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

  // Click on Square Function
  function click(square) {
    if (isGameOver) return;
    if (
      square.classList.contains("opened") ||
      square.classList.contains("flagged")
    )
      return;

    if (square.classList.contains("bomb")) {
      // alert("Game Over");
      console.log("Game Over");
      isGameOver = true;
    } else {
      let totalBombs = square.getAttribute("data");
      if (totalBombs != 0) {
        square.classList.add(`mine-neighbour-${totalBombs}`);
      }
      square.classList.add("opened");
    }
  }
});
