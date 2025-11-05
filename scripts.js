
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
 
    const isValidPlace = (coordinates) => {
        // console.log(board[coordinates.row][coordinates.col].getValue())
        return board[coordinates.row][coordinates.col].getValue() === 'empty';
    }
    const placePiece = (Player, coordinates) => {
        //coordinates row col
        if (!coordinates || !Player) return;
        board[coordinates.row][coordinates.col].setValue(Player.getPiece());
    }
    const clearBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].setValue(null);
            }
        } 
    }
    const getRow = (num) => board[num];
    const getCol = (num) => {
        return [board[0][num], board[1][num], board[2][num]];
    }
    const getCell = (row, col) => board[row][col];
    const getCellValue = (row, col) => getCell(row,col).getValue();

    const isBoardFull = () => board.every((row) => row.every((cell) => cell.getValue() !== 'empty'));
    
    const logCells = (arrOfCells) => {
        let str = "";
        for (let cell of arrOfCells) {
            str += cell.getValue() + " "
        }
        console.log(str);
    }
    const winningTestSetup = () => {
        const combinations = [
            [0,0], 
            //[0,1], [0,2],
            [1,1], [2,1],
            [2,2]
        ]
        for (let [row,col] of combinations) {
            board[row][col].setValue('X');
        }
    }
    return {
        placePiece,
        clearBoard,
        getCellValue,
        isValidPlace,
        isBoardFull,
        printBoard,
        
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
    const getPiece = () => playerPiece;
    const setName = (newName) => playerName = newName;
    const setPiece = (newPiece) => playerPiece = newPiece;
    return {
        getName,
        getPiece,
        setName,
        setPiece
    }
}

function GameController ( ) {

    const Board = GameBoard();
    const players = [];
    // createPlayer(playerOneName, 'X'),
    // createPlayer(playerTwoName, 'O')

    let activePlayer = null;
    let winner = null;

    const setPlayers = (player1, player2) => {
        players[0] = createPlayer(player1.name || 'Player 1', player1.piece ?? 'X');
        players[1] = createPlayer(player2.name || 'Player 2', player2.piece ?? 'O');
        activePlayer = players[0];
    }
    const getActivePlayer = () => activePlayer;
    const changeActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const isGameOver = () => winner !== null;

    const logNewRound = () => {
        // Board.printBoard();
        Board.printBoard();
        console.log(`${getActivePlayer().getName()}'s turn.`);
    }

    const getPlayerInput = () => {
        let input = prompt(`${getActivePlayer().getName()}, enter input in \"[row] [col]\" format:`)
        let inputArr = input.split(' ').map( (num) => parseInt(num) );
       
        if (inputArr.length !== 2 || inputArr[0] < 0 || inputArr[0] > 2 || inputArr[1] < 0 || inputArr[1] > 2) { return -1;}

        let coords = {
            row: inputArr[0],
            col: inputArr[1]
        }
        return coords;
    }

    const checkWinningCondition = () => {
        // let board = Board.getBoard();
        //board[row][col]
        let activePlayerPiece = activePlayer.getPiece();
        const winPatterns = [
            [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]] , [[2,0], [2,1], [2,2]], //rows
            [[0,0], [1,0], [2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]], //cols
            [[0,0],[1,1],[2,2]], [[2,0],[1,1],[0,2]] //diag
        ]
        let winningCombination = winPatterns.filter( (pattern) => pattern.every( ([row,col]) => Board.getCellValue(row,col) === activePlayerPiece));
        if (winningCombination.length !== 0) {
            winner = activePlayer;
            return winningCombination[0];
        }
        
    }

    const playRound = (input) => {
        // logNewRound();
        // let input = getPlayerInput();
        // if (input === -1 || !Board.isValidPlace(input)) {
        //     alert('invalid place');
        //     return;
        // }
        Board.placePiece(getActivePlayer(), input);
        //check winning condition here;
        let result = checkWinningCondition();
        if (result) {
            return result;
        }
        changeActivePlayer();
    }

    const playGame = () => {
        while (!isGameOver() && !Board.isBoardFull()){
            playRound();
        }
        if (Board.isBoardFull()) {
            //tie
        }
    }  

    const reset = () => {
        Board.clearBoard();
        winner = null;
    }

    const winTest =  () => {
        Board.winningTestSetup();
        Board.printBoard();
        checkWinningCondition();
    }
    return {
        getCellValue: Board.getCellValue,
        isBoardFull: Board.isBoardFull,
        isGameOver,
        setPlayers,
        getActivePlayer,
        playRound,
        reset
    }
    
}

function displayController() {
    const DOM = {
        menu: document.querySelector('div.menu'),
        p1Name: document.querySelector('#p1-name'),
        p1Piece: document.querySelector('#p1-piece'),
        p2Name: document.querySelector('#p2-name'),
        p2Piece: document.querySelector('#p2-piece'),
        startButton: document.querySelector('#start'),
        game: document.querySelector('div.game'),
        turnContainer: document.querySelector('.turn-container'),
        gameContainer: document.querySelector('.game-container'),
        buttons: document.querySelectorAll('.game-container button'),
        endDialog: document.querySelector('#end-dialog'),
        playAgainButton: document.querySelector('#again'),
    }

    let game = GameController();
    let [turnSVG, turnUse ]= createSVG('#alpha-x');
    const state = {
        result: null
    }
    const updateScreen = () => {
        const activePlayer = game.getActivePlayer();
        const boardDisplay = [
            [DOM.buttons[0], DOM.buttons[1], DOM.buttons[2] ],
            [DOM.buttons[3], DOM.buttons[4], DOM.buttons[5] ],
            [DOM.buttons[6], DOM.buttons[7], DOM.buttons[8]]
        ]
        //text content wipes children
        DOM.turnContainer.textContent = `${activePlayer.getName()}'s turn`
        DOM.turnContainer.appendChild(turnSVG);
        changeTurnDisplaySVG(activePlayer.getPiece());

        //draw board
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) { 
                let value = game.getCellValue(i,j);
                if (value !== 'empty') {
                    changeButtonSVG(boardDisplay[i][j], value);
                }
            }
        }

        //little winner stuff
        if (state.result) {
            if (state.result === 'win' && state.winningCombination) {
            state.winningCombination.map( ([row,col]) => {
                boardDisplay[row][col].classList.add('winner')
            });
            showGameResults();
            drawLine();
            }
        }
       
    }
    function drawLine(){
        let buttons = document.querySelectorAll('.winner');
        let start = buttons[0].getBoundingClientRect();
        let end = buttons[buttons.length-1].getBoundingClientRect();
        let container = DOM.gameContainer.getBoundingClientRect();

        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
    
        line.setAttribute('x1', start.x -container.x + start.width/2);
        line.setAttribute('y1', start.y -container.y + start.height/2);
        line.setAttribute('x2', end.x -container.x + end.width/2);
        line.setAttribute('y2', end.y - container.y + end.height/2);

        line.setAttribute('stroke', 'red');
        line.setAttribute('stroke-width', '5');
        svg.appendChild(line);
        DOM.gameContainer.appendChild(svg);
    }

    function showGameResults() {
        DOM.endDialog.querySelector('.result').textContent = (state.result === 'tie') ? 'Tie!' : `${game.getActivePlayer().getName()} is the Winner!`
        DOM.endDialog.showModal();
    }
    //event handlers
    function pieceInputHandler(e) {
        let switchInput = {'X': 'O', 'O': 'X'}
        let other = e.target === DOM.p1Piece ? DOM.p2Piece : DOM.p1Piece;
        other.value = switchInput[e.target.value];
    }
    function handleBoardClicked(e) {
        let button = e.target.closest('button');
        if (!button) return;
        let result = game.playRound(button.dataset);
        if (result || game.isBoardFull()) {
            state.result = (result ? 'win' : 'tie');
            if (result) state.winningCombination = result;
        }
        updateScreen();
    }
    //game entry point
    function clickStartHandler(e){
         //initializing svg
        DOM.buttons.forEach( (button) => {
            button.appendChild(createSVG()[0]);
        })
        game.setPlayers(
            {name: DOM.p1Name.value, piece: DOM.p1Piece.value},
            {name: DOM.p2Name.value, piece: DOM.p2Piece.value}
        );
        toggleHide(DOM.menu);
        toggleHide(DOM.game);
        //initial update screen
        updateScreen();
    }
    function refresh(e){
        location.reload();
    }
    DOM.startButton.addEventListener('click', clickStartHandler);
    DOM.p1Piece.addEventListener('change', pieceInputHandler);
    DOM.p2Piece.addEventListener('change', pieceInputHandler);
    DOM.gameContainer.addEventListener('click', handleBoardClicked);
    DOM.playAgainButton.addEventListener('click', refresh);
    //helpers
    function toggleHide(element) {
        element.classList.toggle('hidden');
    }
    function createSVG(id) {
        if (id === 'empty') return;
        let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        let use = document.createElementNS("http://www.w3.org/2000/svg",'use');
        svg.setAttribute("viewBox", "0 0 24 24");
        if (id) {
            use.setAttribute('href', id);
        }
        svg.appendChild(use);
        return [svg, use];
    }
    function changeTurnDisplaySVG(id){
        turnUse.setAttribute('href', (id === 'X' ? '#alpha-x' : '#alpha-o'));
    }
    function changeButtonSVG(button, id) {
        let use = button.querySelector('use');
        use.setAttribute('href', (id === 'X' ? '#alpha-x' : '#alpha-o'));
        //disable button? 
        button.setAttribute('disabled', true);
    }

}
displayController();

