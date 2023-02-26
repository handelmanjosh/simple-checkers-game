
const root = $("#root")[0];
let gameStarted = false;
let somethingSelected = false;
let turn = 0;
const elementList = []

   

function retrieveRowCol(elem) {
    let id = elem.id;
    return [Number(id[0]), Number(id[1])];
}
function getFromRowCol(row, col) {
    let elem = $(`#${row}${col}`)[0]
    return elem;
}
function getFromNumber(n) {
    let str = (n < 10) ? "0" + n : "" + n;
    let elem = $("#" + str)[0];
    return elem;
}
function checkCanSelect(elem) {
    if (somethingSelected) return false;
    if (turn == 1) {
        if (elem.firstChild.classList.contains("blue-checker")) {
            return false;
        }
    } else {
        if (elem.firstChild.classList.contains("black-checker")) {
            return false;
        }
    }
    return true;
}

function moveChecker(oldPos, newPos, unselected, newPosFunc, unselectedFunc) {    
    console.log("called");
    let checker = oldPos.firstChild;

    oldPos.removeChild(checker);
    newPos.appendChild(checker);

    newPos.classList.remove("potential");
    if (unselected) unselected.classList.remove("potential");
    oldPos.classList.remove("selected");

    oldPos.removeEventListener("click", setSelected);
    newPos.removeEventListener("click", newPosFunc);
    if (unselected) unselected.removeEventListener("click", unselectedFunc);

    newPos.addEventListener("click", setSelected);

    somethingSelected = false;
    turn = (turn == 0) ? 1 : 0;
}
function setSelected() {
    console.log(this, "called");
    console.log(somethingSelected);
    if (this.classList.contains("selected")) {
        this.classList.remove("selected");
        somethingSelected = false;
    } else {
        if (checkCanSelect(this) == false) {console.log("cant select"); return;}
        this.classList.add("selected");

        let [row, col] = retrieveRowCol(this);
        let oldReference = this;
        let newRow;
        let elem1;
        let elem2;

        if (turn == 0) {
            let inc = 1;
            newRow = row + inc;

        } else {
            let inc = -1;
            newRow = row + inc;
        }
        
        somethingSelected = true;
        if (col - 1 > 0) {
            elem1 = getFromRowCol(newRow, col - 1);
        }
        if (col + 1 < 8) {
            elem2 = getFromRowCol(newRow, col + 1);
        }
        var func1 = function() { moveChecker(oldReference, elem1, elem2, func1, func2) };
        var func2 = function() { moveChecker(oldReference, elem2, elem1, func2, func1) }
        if (elem1 && elem1.childElementCount == 0) {
            elem1.classList.add("potential");
            elem1.addEventListener("click", func1)
        }
        if (elem2 && elem2.childElementCount == 0) {
            elem2.classList.add("potential");
            elem2.addEventListener("click", func2)
        }
    }
}
function genBoard() {
    let n = 1;
    for (let row = 0; row < 8; row++) {
        let tempRow = [];
        let elem = document.createElement("div");
        elem.classList.add("flex-row")
        for (let col = 0; col < 8; col++) {
            let currentSquare = document.createElement("div");
            currentSquare.setAttribute("id", row.toString() + col.toString())
            currentSquare.classList.add("square");
            if (col % 2 == n) {
                currentSquare.classList.add("red");
            } else {
                currentSquare.classList.add("white");
            }
            elem.appendChild(currentSquare);
            tempRow.push(currentSquare)
        }
        elementList.push(tempRow);
        root.appendChild(elem);
        n = (n == 0) ? 1 : 0;
    }
}

function genCheckers(color) {
    if (color === "blue") {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                let elem = elementList[row][col];
                if (elem.classList.contains("white")) {
                    let checker = document.createElement("div");
                    checker.classList.add("blue-checker");
                    checker.classList.add("circular");
                    elem.appendChild(checker);
                    elem.addEventListener("click", setSelected);
                }
            }
        }
    } else {
        for (let row = 7; row > 4; row--) {
            for (let col = 0; col < 8; col++) {
                let elem = elementList[row][col];
                if (elem.classList.contains("white")) {
                    let checker = document.createElement("div");
                    checker.classList.add("black-checker");
                    checker.classList.add("circular");
                    elem.appendChild(checker);
                    elem.addEventListener("click", setSelected);
                }
            }
        }
    }
}

function startGame() {
    if (gameStarted) return;
    genBoard();
    genCheckers("blue");
    genCheckers("black")
    gameStarted = true;
    let button = $("#start-button")[0];
    button.innerHTML = "Game Started";
}