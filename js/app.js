// ./node_modules/.bin/webpack js/app.js js/out.js
// ./node_modules/.bin/webpack --watch js/app.js js/out.js

document.addEventListener("DOMContentLoaded", function(event) {

    console.clear();

    var boardWidth = prompt("Input board width. Preferably > 10", "20");
    if (boardWidth == null || boardWidth < 10) {
        document.getElementById("demo").innerHTML =
            "Board width and height need to be a number higher than 10 so now you see the deafult size";
        boardWidth = 10;
    }
    var boardHeight = prompt("Input board height. Preferably > 10", "20");
    if (boardHeight == null || boardHeight < 10) {
        document.getElementById("demo").innerHTML =
            "Board width and height need to be a number higher than 10 so now you see the deafult size";
        boardHeight = 10;
    }
    alert("Press 'PLAY' to start!");


    const CELL_SIZE = 10;   // px
    const INTERVAL_TIME = 250;  // ms
    function GameOfLife(boardWidth, boardHeight) {
        this.width = boardWidth;
        this.height = boardHeight;
        this.board = document.querySelector("#board");
        this.cells = [];
        this.createBoard = function () {
            this.div = document.querySelector("#board div");
            // this.board.style.width = (this.width * 10) + "px";
            // this.board.style.height = (this.height * 10) + "px";
            this.board.style.width = (this.width * CELL_SIZE) + "px";
            this.board.style.height = (this.height * CELL_SIZE) + "px";
            // this.board.style.width = (this.width * this.div.style.width) + "px";    // board width * div width
            // this.board.style.height = this.height * this.div.style.height; // board height * div height
            var numberOfCells = boardWidth * boardHeight;    // total sum of cells
            for (var i = 0; i < numberOfCells; i++) {
                var newDiv = document.createElement("div");     // creates a new cell
                this.board.appendChild(newDiv);     // signs cell divs to the board
                this.cells.push(newDiv);        // pushes cells into aa array

            }
            for (var j = 0; j < this.cells.length; j++) {
                this.cells[j].addEventListener("mouseover", function () {   // adds listener to each cell
                    this.classList.toggle("live");
                })
            }
        };
        this.index = function(x, y) {
            return x + y * this.width;
        };

        this.setCellState = function(x, y, state) {
            var index = this.index(x, y);
            if (state !== "live") {
                this.cells[index].classList.remove("live");
            } else {
                this.cells[index].classList.add("live");
            }
        };
        this.firstGlider = function() {        // starting glider, typical shape
            this.setCellState(5, 3, "live");
            this.setCellState(4, 4, "live");
            this.setCellState(4, 5, "live");
            this.setCellState(5, 5, "live");
            this.setCellState(6, 5, "live");
        };
        this.computeCellNextState = function(x, y) {
            var mainCellIndex = this.index(x, y);   //creates a one number index of the main cell that is being checked
            var mainCell = this.cells[mainCellIndex];   // exact value of the checked cell
            if (!mainCell) {    // to eliminate undefined
                return;
            }

            var lifeCounter = 0;
            var neighbourCells = [      // 8 cell neighbours
                this.cells[this.index(x-1, y-1)],
                this.cells[this.index(x, y-1)],
                this.cells[this.index(x+1, y-1)],
                this.cells[this.index(x-1, y)],
                this.cells[this.index(x+1, y)],
                this.cells[this.index(x-1, y+1)],
                this.cells[this.index(x, y+1)],
                this.cells[this.index(x+1, y+1)]
            ];
            // console.log(neighbourCells);
            for (var i = 0; i < neighbourCells.length; i++) {
                // console.log(neighbourCells);
                if (neighbourCells[i] !== undefined) {  // to eliminate undefined
                    // console.log(neighbourCells);
                    if (neighbourCells[i].classList.contains("live")) { // if cell is alive
                        // console.log(neighbourCells);
                        lifeCounter++;  // counts alive cells
                    }
                }
            }

            // checks what to do with the cell - to kill or not to kill
            if ((mainCell.classList.contains("live") && lifeCounter === 2) || (mainCell.classList.contains("live") && lifeCounter === 3)) {
                return 1;      // means the cell stays alive
            }
            else if (!mainCell.classList.contains("live") && lifeCounter === 3) {
                return 1;      // means the cell becomes alive
            }
            else {
                return 0;      // the cell stays or becomes dead :(
            }
        };
        var nextGenerationBoard;
        this.computeNextGeneration = function() {
            nextGenerationBoard = [];   // to clean up the board each time
            for (var y = 0; y < this.width; y++) {
                for (var x = 0; x < this.height; x++) {
                    nextGenerationBoard.push(this.computeCellNextState(x, y));  // pushes results of the previos function into an array
                }
            }
            return nextGenerationBoard;
        };
        this.printNextGeneration = function() {
            this.computeNextGeneration();
            for (var i = 0; i < this.cells.length; i++) {
                if (nextGenerationBoard[i] === 1) {
                    this.cells[i].classList.add("live");
                }
                else {
                    this.cells[i].classList.remove("live");
                }
            }
        };
        var self = this;
        var gameInterval;
        var playBtn = document.querySelector("#play");
        playBtn.addEventListener("click", function() {
            gameInterval = setInterval(function(){ self.printNextGeneration(); }, INTERVAL_TIME);
        });
        var pauseBtn = document.querySelector("#pause");
        pauseBtn.addEventListener("click", function() {
            clearInterval(gameInterval);
        });
    }

    var game = new GameOfLife(boardWidth, boardHeight);
    game.createBoard();
    game.firstGlider();
});