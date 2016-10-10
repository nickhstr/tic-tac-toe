function TicTacToe(game) {
  this.init(game);
}

TicTacToe.prototype.getCurrentState = function() {
  // return the current state of the application
  return this.state[this.state.length - 1];
}

TicTacToe.prototype.reset = function() {
  this.init({
    marker: null,
    player: null
  });
  this.showBoard(false);
}

TicTacToe.prototype.init = function(game) {
  this.state = [];
  this.squares = elsByClass('square');
  this.undoButton = elById('undo');
  this.startForm = elById('startForm');
  this.game = elById('game');
  this.title = elById('title');

  var row1 = Array.prototype.slice.call(this.squares, 0, 3);
  var row2 = Array.prototype.slice.call(this.squares, 3, 6);
  var row3 = Array.prototype.slice.call(this.squares, 6);

  this.rows = [row1, row2, row3];
  // setting initial state
  var initialState = {
    activePlayer: game.player,
    playerMarker: game.marker,
    currentBoard: this.freshBoard()
  };
  this.updateState({
    type: 'add',
    newState: initialState
  });
  this.updateHandlers(true);
}

TicTacToe.prototype.updateState = function(action) {
  switch (action.type) {
    case 'add':
      this.state.push(action.newState);
      break;
    case 'undo':
      this.state.pop();
      break;
  }
  this.notify();
  console.log(this.getCurrentState());
}

TicTacToe.prototype.notify = function() {
  this.notifySquares();
  this.notifyControlPanel();
}

TicTacToe.prototype.notifySquares = function() {
  var board = this.getCurrentState().currentBoard;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      this.rows[i][j].innerHTML = board[i][j];
    }
  }
}

TicTacToe.prototype.notifyControlPanel = function() {
  this.undoButton.disabled = this.state.length <= 1;
}

TicTacToe.prototype.updatedBoard = function(x,y) {
  var state = this.getCurrentState();
  var playerMarker = state.playerMarker;
  var currentBoard = state.currentBoard;
  var newBoard = [];
  for (var i = 0; i < currentBoard.length; i++) {
    newBoard.push(currentBoard[i].concat());
  }
  newBoard[x][y] = playerMarker;
  return newBoard;
}

TicTacToe.prototype.freshBoard = function() {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
}

TicTacToe.prototype.undo = function() {
//go back to the previous state
  this.updateState({
    type: 'undo'
  });
}

TicTacToe.prototype.isValidTurn = function(x, y) {
    // 0,0 is the upper left.. 2,2 is the lower right.
    // return if x,y are valid as a boolean
  if (x >= 0 && x <= 2 && y >= 0 && y <= 2) {
    var state = this.getCurrentState();
    var recentState = state;
    var square = recentState['currentBoard'][x][y];
    if (square === null) {
        return true;
    }
  }
  return false;
}

TicTacToe.prototype.isWinningTurn = function(playerMarker, updatedBoard) {
  var checkVertical = function () {
    for (var i = 0; i < 3; i++) {
      // For each array in updatedBoard, check the square in each
      // column for activePlayer's mark
      var column = updatedBoard.filter(function(row) {
          return row[i] === playerMarker;
      });
      // If a column has three activePlayer marks, activePlayer has
      // won the game
      if (column.length === 3) {
          return true;
      }
    }
    return false;
  };
  var checkHorizontal = function () {
    // Same as checkVertical, only checking each row's items instead
    for (var i = 0; i < 3; i++) {
      var row = updatedBoard[i].filter(function(square){
          return square === playerMarker;
      });
      if (row.length === 3) {
          return true;
      }
    }
    return false;
  };
  var checkDiagonal = function () {
    if (updatedBoard[1][1] === playerMarker) {
      if ((updatedBoard[0][0] === playerMarker &&
      updatedBoard[2][2]=== playerMarker) ||
      (updatedBoard[2][0] === playerMarker &&
      updatedBoard[0][2] === playerMarker)) {
          return true;
      }
    }
    return false;
  };

  if (checkDiagonal() || checkHorizontal() || checkVertical()) {
    return true;
  }
  return false;
}

TicTacToe.prototype.takeTurn = function(x, y, el) {
  var state = this.getCurrentState();
  var valid = false;
  var winning = false;
  if (this.isValidTurn(x, y)) {
    var newState = {
            activePlayer: (state.activePlayer === 'computer') ? 'player' : 'computer',
            playerMarker: (state.playerMarker === 'x') ? 'o' : 'x'
    };
    valid = true;
    newState.currentBoard = this.updatedBoard(x, y);
    newState.winningMove = winning = this.isWinningTurn(state.playerMarker, newState.currentBoard);
    this.updateState({
      type: 'add',
      newState: newState
    });

    if (winning) {
      console.log(state.activePlayer + ' won!');
      this.updateHandlers(false);
    }
  }
  else {
    console.log('That space is taken already!');
  }
}

TicTacToe.prototype.updateHandlers = function(bool) {
  if (bool) {
    Array.prototype.forEach.call(this.squares, function(square) {
      square.onclick = function(e) {
        var cords = JSON.parse(this.dataset.cords);
        var x = cords[0];
        var y = cords[1];
        tictactoe.takeTurn(x, y, this);
      };
    });
  }
  else {
    Array.prototype.forEach.call(this.squares, function(square) {
      square.onclick = null;
    });
  }
}

TicTacToe.prototype.showBoard = function(bool) {
  if (bool) {
    this.startForm.className += ' hide-shrink';
    this.game.className = this.game.className.replace(/\s?(hide-down)\s?/, '');
    this.title.className = '';
  }
  else {
    this.startForm.className = this.startForm.className.replace(/\s?(hide-shrink)\s?/, '');
    this.game.className += ' hide-down';
    this.title.className = 'title-intro';
  }
}

function playerOrComputerFirst() {
  var random = Math.round(Math.random());
  return random === 0 ? 'player' : 'computer';
}

function startGame(game) {
  window.tictactoe = new TicTacToe(game);
  tictactoe.showBoard(true);
}

window.onload = function(e) {
  elById('startForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var marker = this.elements.marker.value;
    var player = playerOrComputerFirst();
    startGame({
      marker: marker,
      player: player
    });
  });
}