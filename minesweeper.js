console.log("Check Connection");

// We make sure all of our HTML code is loaded before reading this JavaScript code
// Actually it has the same effect to put <script src="xxx.js"></script> in the end of the HTML file
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let squares = [];

  // Create a Board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();
});
