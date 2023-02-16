console.log("Check Connection");

// We make sure all of our HTML code is loaded before reading this JavaScript code
// Actually it has the same effect to put <script src="xxx.js"></script> in the end of the HTML file
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombAmount = 20;
  let squares = [];

  // Create a Board
  function createBoard() {
    // Get Shuffled Game Array with Random Bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");

    const gameArray = emptyArray.concat(bombsArray);
    // The { Math.random() - 0.5 } here is the compare function
    // The array elements are sorted according to the return value of the compare function
    // If the return value > 0, then sort "a" after "b"
    // Else if the return value < 0, then sort "a" before "b"
    // Else if the return value === 0, then keep the original order of "a" and "b"
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();
});
