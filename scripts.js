
// factory function
// function createUser (name) {
//   const discordName = "@" + name;

//   let reputation = 0;
//   const getReputation = () => reputation;
//   const giveReputation = () => reputation++;

//   return { name, discordName, getReputation, giveReputation };
// }
// factory function wrapped in immediately invoked function expression
// const calculator = (function () {
//   const add = (a, b) => a + b;
//   const sub = (a, b) => a - b;
//   const mul = (a, b) => a * b;
//   const div = (a, b) => a / b;
//   return { add, sub, mul, div };
// })();

// calculator.add(3,5); // 8
// calculator.sub(6,2); // 4
// calculator.mul(14,5534); // 77476

function GameBoard () {
    const board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    } 
    const getBoard = () => board;

    const printBoard = () => {
        const boardWithValues = board.map( (row) => row.map((cell) => cell.getValue()))
        console.log(boardWithValues);
    }
    const displayGameBoard =  ()  => {
        let row = '';
        for (let i = 0; i < rows; i++) {
            row = '';
            for (let j = 0; j < columns; j++){
                row += `[ ${board[i][j].getValue()} ]`
            }
            console.log(row);
        }
    }

    const isValidPlace = (coordinates) => {
        console.log(board[coordinates.row][coordinates.col].getValue())
        return board[coordinates.row][coordinates.col].getValue() === 'empty';
    }
    const placePiece = (Player, coordinates) => {
        //coordinates row col
        if (!coordinates || !Player) return;
        board[coordinates.row][coordinates.col].setValue(Player.getPiece());
    }
    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
        board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
                console.log(board[i]);
            }
        } 
    }
    return {
        getBoard,
        printBoard,
        displayGameBoard,
        isValidPlace,
        placePiece,
        clearBoard,
    }
}

function Cell() {
    let value = null;
    const setValue = function (token) {
        value = token;
    }
    const getValue = function() { return (value !== null ? value: 'empty'); }
    return {
        setValue,
        getValue
    }
}

function createPlayer (name, piece) {
    const playerName = name;
    let playerPiece = piece;

    const getName = () => playerName;
    const getPiece = () => piece;
    const setName = (newName) => playerName = newName;
    const setPiece = (newPiece) => playerPiece = piece;

    return {
        getName,
        getPiece,
        setName,
        setPiece
    }
}

function GameController ( playerOneName = "P1", playerTwoName = "P2") {

    const Board = GameBoard();
    const players = [
        createPlayer(playerOneName, 'X'),
        createPlayer(playerTwoName, 'O')
    ]
    let activePlayer = players[0];
    let winner = null;

    const getActivePlayer = () => activePlayer;
    const changeActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const isGameOver = () => winner !== null;

    const logNewRound = () => {
        // Board.printBoard();
        Board.displayGameBoard();
        console.log(`${getActivePlayer().getName()}'s turn.`);
    }

    const getPlayerInput = () => {
        let input = prompt(`${getActivePlayer().getName()}, enter input in \"[row] [col]\" format:`)
        let inputArr = input.split(' ').map( (num) => parseInt(num) );
        // console.log(inputArr);
        if (inputArr.length !== 2 || inputArr[0] < 0 || inputArr[0] > 2 || inputArr[1] < 0 || inputArr[1] > 2) { return -1;}

        let coords = {
            row: inputArr[0],
            col: inputArr[1]
        }
        return coords;
    }

    const playRound = () => {
        logNewRound();
        let input = getPlayerInput();
        
        if (input === -1 || !Board.isValidPlace(input)) {
            alert('invalid place');
            return;
        }
        Board.placePiece(getActivePlayer(), input);
        //check winning condition here;
        changeActivePlayer();
    }

    const playGame = () => {

        //for loop for now just a couple of rounds
        for (let i = 0; i < 9; i++) {
            playRound();
        }
    }

    return {
        // debug
        isGameOver,
        playRound,
        playGame,

    }
    
}

const game = GameController();