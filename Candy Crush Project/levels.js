var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;
var move = 0;
const mainsound=new Audio('Background Levels Music.mp3');
mainsound.loop=true;
mainsound.play();

var currTile;
var otherTile;


window.onload = function() {
    startGame();
    // 1/10th of a second
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
        
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; 
}


function startGame() {
    score = 0;
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";
            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    crushMusic();
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }
    console.log("currTile : ",currTile);
    console.log("otherTile : ",otherTile);

    let currCoords = currTile.id.split("-"); 
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
      if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;
        
         let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
           
            otherTile.src = currImg; }
    }
}

function crushCandy() {

    var level = 1;
var targetScore = 200;
    crushFour();
    crushThree();
    move--;
    document.getElementById("score").innerText = score;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          if (board[r][c].src.includes("blank")) {
            board[r][c].classList.add("crush-animation"); // Add crushing animation class
          }
        }
      }
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            const isStripCandyExists = hasStripedCandy(candy1, candy2, candy3); // return true is there is any strip candy
            const hasAllCandiesSameColor = checkCandiesColor(candy1,candy2,candy3); // return true if all have same color
            if(hasAllCandiesSameColor){
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")){
                        candy1.src = "./images/blank.png";
                        candy2.src = "./images/blank.png";
                        candy3.src = "./images/blank.png";
                        score += 10;
                }
                else if(isStripCandyExists){
                    const stripCandyObj = getStripedCandy(candy1,candy2,candy3)
                    activateStripedCandy(stripCandyObj);
                }
            }
        }
    }
    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            const isStripCandyExists = hasStripedCandy(candy1, candy2, candy3); // return true is there is any strip candy
            const hasAllCandiesSameColor = checkCandiesColor(candy1,candy2,candy3); // return true if all have same color
            if(hasAllCandiesSameColor){
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    
                        candy1.src = "./images/blank.png";
                        candy2.src = "./images/blank.png";
                        candy3.src = "./images/blank.png";
                        score += 10;
                }
                else if(isStripCandyExists){
                    const stripCandyObj = getStripedCandy(candy1,candy2,candy3)
                    activateStripedCandy(stripCandyObj);
                        
                }
            }
        }
    }
}
    
function hasStripedCandy(candy1, candy2, candy3) {
    return candy1.src.includes("Striped") || candy2.src.includes("Striped") || candy3.src.includes("Striped");
}

function checkCandiesColor(...args){
    let colorsArr = [];
    for(let i=0; i<args.length; i++){
        let candyColor = args[i].src.split("/").pop().split(".")[0];
        if(candyColor.includes("Striped")) {
            const stripCandyColor = candyColor.split("-");
            candyColor = stripCandyColor[0];
        } 
        colorsArr.push(candyColor);
    }
    return colorsArr.every(v => v === colorsArr[0]);
}

function getStripedCandy(candy1, candy2, candy3) {
    if (candy1.src.includes("Striped")) {
      return candy1;
    } else if (candy2.src.includes("Striped")) {
      return candy2;
    } else {
      return candy3;
    }
  }



function crushFour() {
// check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")
            ) {

                let color = candy1.src.split("/").pop().split(".")[0];
                let stripedCandy;
                if (Math.random() < 0.5) {
                    stripedCandy = color + "-Striped-Horizontal.png";
                } else {
                    stripedCandy = color + "-Striped-Vertical.png";
                }
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                candy2.name = candy3.name = candy4.name = "";
                candy1.src= "./images/" + stripedCandy;
                score += 10;
            }
        }
    }
// check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")
            ) {
                
                let color = candy1.src.split("/").pop().split(".")[0];
                if (Math.random() < 0.5) {
                    stripedCandy = color + "-Striped-Horizontal.png";
                } else {
                    stripedCandy = color + "-Striped-Vertical.png";
                }
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                candy1.src= "./images/" + stripedCandy;
                score += 10;
            }
        }
    }
}

function activateStripedCandy(obj = this) {
    // Check if the candy is a striped candy
    if (obj.src.includes("Striped")) {
        let coords = obj.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        let isHorizontal = obj.src.includes("Horizontal");

        if (isHorizontal) {
            crushRow(r);
        } else {
            crushColumn(c);
        }
        obj.src = "./images/blank.png";
    }
}

function crushRow(rowIndex) {
    for (let c = 0; c < columns; c++) {
        let candy = board[rowIndex][c];
        if (!candy.src.includes("blank")) {
            candy.src = "./images/blank.png";
        }
    }
score+=20;
}

function crushColumn(colIndex) {
    for (let r = 0; r < rows; r++) {
        let candy = board[r][colIndex];
        if (!candy.src.includes("blank")) {
            candy.src = "./images/blank.png";
        }
    }
score+=20;
}

 
function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            const isStripCandyExists = hasStripedCandy(candy1, candy2, candy3); // return true is there is any strip candy
            const hasAllCandiesSameColor = checkCandiesColor(candy1,candy2,candy3); // return true if all have same color
            if(hasAllCandiesSameColor){
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    return true;
                }else if(isStripCandyExists){
                    return true;
                }
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            const isStripCandyExists = hasStripedCandy(candy1, candy2, candy3); // return true is there is any strip candy
            const hasAllCandiesSameColor = checkCandiesColor(candy1,candy2,candy3); // return true if all have same color
            if(hasAllCandiesSameColor){

                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    return true;
                }else if(isStripCandyExists){
                    return true;
                }
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];
            let candy4 = board[r][c + 3];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")
            ) {
                return true;
            }
        }
    }

    // check columns for four candies
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];
            let candy4 = board[r + 3][c];
            if (
                candy1.src == candy2.src &&
                candy2.src == candy3.src &&
                candy3.src == candy4.src &&
                !candy1.src.includes("blank")
            ) {
                return true;
            }
        }
    }
    return false;
}



function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
            board[r][c].classList.remove("slide-animation"); // Remove animation class after sliding
        }
    }
}


function generateCandy() {
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            if (board[r][c].src.includes("blank")) {
                board[r][c].src = "./images/" + randomCandy() + ".png";
            }
        }
    }
}

function crushMusic(){
    var crushsound=new Audio('SFX - Candy Land4.mp3');
    crushsound.play();
        }
    