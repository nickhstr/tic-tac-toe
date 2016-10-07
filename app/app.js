function TicTacToe() {
  this.init();
}

TicTacToe.prototype.getCurrentState = function() {
  // return the current state of the application
  return this.state[this.state.length - 1];
}

TicTacToe.prototype.reset = function() {
  this.init();
}

TicTacToe.prototype.init = function() {
  this.state = [];
 // setting initial state
  this.state.push({
    activePlayer: 'x',
    currentBoard: this.freshBoard()
  });
}

TicTacToe.prototype.updatedBoard = function(x,y) {
  var state = this.getCurrentState();
  var activePlayer = state.activePlayer;
  var currentBoard = state.currentBoard;
  var newBoard = [];
  for (var i = 0; i < currentBoard.length; i++) {
    newBoard.push(currentBoard[i].concat());
  }
  newBoard[x][y] = activePlayer;
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
  this.state.pop();
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

TicTacToe.prototype.isWinningTurn = function(activePlayer, updatedBoard) {
  var checkVertical = function () {
    for (var i = 0; i < 3; i++) {
      // For each array in updatedBoard, check the square in each
      // column for activePlayer's mark
      var column = updatedBoard.filter(function(row) {
          return row[i] === activePlayer;
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
          return square === activePlayer;
      });
      if (row.length === 3) {
          return true;
      }
    }
    return false;
  };
  var checkDiagonal = function () {
    if (updatedBoard[1][1] === activePlayer) {
      if ((updatedBoard[0][0] === activePlayer &&
      updatedBoard[2][2]=== activePlayer) ||
      (updatedBoard[2][0] === activePlayer &&
      updatedBoard[0][2] === activePlayer)) {
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

TicTacToe.prototype.takeTurn = function(x, y) {
  var state = this.getCurrentState();
  var valid = false;
  var winning = false;
  if(this.isValidTurn(x, y)) {
    var newState = {
            activePlayer: (state.activePlayer === 'x') ? 'o' : 'x'
    };
    valid = true;
    newState.currentBoard = this.updatedBoard(x, y);
    newState.winningMove = winning = this.isWinningTurn(state.activePlayer, newState.currentBoard);
    this.state.push(newState);
  }
  else {
    var newState = {
        activePlayer: state.activePlayer,
        currentBoard: state.currentBoard,
        valid: false,
        winning: false
    };
    this.state.push(newState);
  }
  console.log(this.getCurrentState());
  return this.getCurrentState();
}

var tictactoe = new TicTacToe();

tictactoe.reset();

tictactoe.takeTurn(0, 0);
tictactoe.takeTurn(1, 0);
tictactoe.takeTurn(1, 1);
tictactoe.takeTurn(1, 2);
tictactoe.takeTurn(2, 2);