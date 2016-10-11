function TicTacToe(game) {
  this.init(game);
}

TicTacToe.prototype.getCurrentState = function() {
  // return the current state of the application
  return this.state[this.state.length - 1];
}

TicTacToe.prototype.reset = function(type) {
  this.init({
    marker: null,
    player: null,
    reset: true
  });
  this.showBoard(false);
}

TicTacToe.prototype.init = function(game) {
  this.state = [];
  this.squares = elsByClass('square');
  this.startForm = elById('startForm');
  this.game = elById('game');
  this.title = elById('title');
  this.computerDelay = 750;
  this.playerTab = elById('playerTab');
  this.computerTab = elById('computerTab');
  this.winOrDrawTab = elById('winOrDrawTab');

  var row1 = Array.prototype.slice.call(this.squares, 0, 3);
  var row2 = Array.prototype.slice.call(this.squares, 3, 6);
  var row3 = Array.prototype.slice.call(this.squares, 6);

  this.rows = [row1, row2, row3];
  // setting initial state
  var initialState = {
    activePlayer: game.player,
    playerMarker: game.marker,
    currentBoard: this.freshBoard(),
    winningMove: false,
    draw: false,
    winner: null,
    playerWinCount: parseInt(localStorage.getItem('playerWinCount')),
    computerWinCount: parseInt(localStorage.getItem('computerWinCount')),
    reset: game.reset
  };
  this.updateState({
    type: 'add',
    newState: initialState
  });
}

TicTacToe.prototype.nextGame = function() {
  var state = this.getCurrentState();
  var newState = Object.assign({}, state, {
    winner: null,
    winningMove: false,
    draw: false,
    currentBoard: this.freshBoard(),
    playerWinCount: parseInt(localStorage.getItem('playerWinCount')),
    computerWinCount: parseInt(localStorage.getItem('computerWinCount'))
  });

  this.updateState({
    type: 'add',
    newState: newState
  });
}

TicTacToe.prototype.updateState = function(action) {
  switch (action.type) {
    case 'add':
      this.state.push(action.newState);
      break;
  }
  this.notify();
}

TicTacToe.prototype.notify = function() {
  this.notifySquares();
  this.notifyTurn();
  this.notifyWinCounts();
}

TicTacToe.prototype.notifySquares = function() {
  var state = this.getCurrentState();
  var board = state.currentBoard;
  var winningMove = state.winningMove;

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      this.rows[i][j].innerHTML = board[i][j];
    }
  }
}

TicTacToe.prototype.notifyTurn = function() {
  var state = this.getCurrentState();

  if (state.activePlayer === 'Computer' && !state.winningMove && !state.draw) {
    this.updateHandlers(false);
    this.computerTurn();
    this.computerTab.className = '';
    this.playerTab.className = 'hide-edge';
  }
  else if (state.winningMove || state.draw || state.reset) {
    this.updateHandlers(false);
    this.computerTab.className = 'hide-edge';
    this.playerTab.className = 'hide-edge';

    if (state.winningMove) {
      this.updateWinOrDraw(state.winner + ' wins!');
    }
    else if (state.draw) {
      this.updateWinOrDraw('It\'s a draw!');
    }
    else if (state.reset) {
      this.updateWinOrDraw();
    }
  }
  else {
    this.updateHandlers(true);
    this.computerTab.className = 'hide-edge';
    this.playerTab.className = '';
  }
}

TicTacToe.prototype.notifyWinCounts = function() {
  var state = this.getCurrentState();
  var winner = state.winner;

  if (winner === 'Player') {
    var playerWins = state.playerWinCount + 1;
    return localStorage.setItem('playerWinCount', playerWins);
  }
  if (winner === 'Computer') {
    var computerWins = state.computerWinCount + 1;
    return localStorage.setItem('computerWinCount', computerWins);
  }
}

TicTacToe.prototype.updateWinOrDraw = function(message) {
  var self = this;

  if (message) {
    this.winOrDrawTab.innerHTML = message;
    this.winOrDrawTab.className = '';

    setTimeout(function() {
      self.winOrDrawTab.className = 'hide-win-draw';
      self.winOrDrawTab.innerHTML = '';
      // self.reset();
      self.nextGame();
    }, 2000);
  }
  else {
    this.winOrDrawTab.innerHTML = '';
    this.winOrDrawTab.className = 'hide-win-draw';
  }
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

TicTacToe.prototype.computerScan = function() {
  var mark = this.getCurrentState().playerMarker;
  var win = this.lookForWin(mark);
  if (win) {
    return this.computerTakeTurn(win[0], win[1]);
  }
  
  var block = this.lookForBlock();
  if (block) {
    return this.computerTakeTurn(block[0], block[1]);
  }

  var otherwise = this.otherwiseChoose();
  return this.computerTakeTurn(otherwise[0], otherwise[1]);
}

TicTacToe.prototype.lookForWin = function(mark) {
  var state = this.getCurrentState();
  var board = state.currentBoard;
  var x, y;

  // Check each row
  for (var i = 0; i < 3; i++) {
    var count = 0;
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === mark) {
        count++;
      }
    }
    if (count === 2 && board[i].indexOf(null) > -1) {
      x = i;
      y = board[i].indexOf(null);
      return [x, y];
    }
  }

  // Check each column
  for (var i = 0; i < 3; i++) {
    var count = 0;
    for (var j = 0; j < 3; j++) {
      if (board[j][i] === mark) {
        count++;
      }
    }
    if (count === 2) {
      y = i;
      for (var j = 0; j < 3; j++) {
        if (board[j][i] === null) {
          x = j;
          break;
        }
      }
      if (x > -1) {
        return [x, y];
      }
    }
  }

  // Check both diagonals
  if (board[1][1] === null) {
    if ((board[0][0] === mark && board[2][2] === mark) ||
    (board[0][2] === mark && board[2][0] === mark)) {
      return [1, 1];
    }
  }
  if (board[1][1] === mark) {
    if (board[0][0] === null && board[2][2] === mark) {
      return [0, 0];
    }
    else if (board[0][0] === mark && board[2][2] === null) {
      return [2, 2];
    }
    else if (board[0][2] === null && board[2][0] === mark) {
      return [0, 2];
    }
    else if (board[0][2] === mark && board[2][0] === null) {
      return [2, 0];
    }
  }

  return false;
}

TicTacToe.prototype.lookForBlock = function() {
  var state = this.getCurrentState();
  var opponent = (state.playerMarker === 'x') ? 'o' : 'x';

  return this.lookForWin(opponent);
}

TicTacToe.prototype.otherwiseChoose = function() {
  var state = this.getCurrentState();
  var board = state.currentBoard;
  var mark = state.playerMarker;
  var opponent = (state.playerMarker === 'x') ? 'o' : 'x';

  // Check rows
  for (var i = 0; i < 3; i++) {
    var markCount = 0;
    var opponentCount = 0;
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === mark) {
        markCount++;
      }
      else if (board[i][j] === opponent) {
        opponentCount++;
      }
    }
    if (markCount === 1 && opponentCount === 0) {
      x = i;
      y = board[i].indexOf(null);
      return [x, y];
    }
  }

  // Check columns
  for (var i = 0; i < 3; i++) {
    var markCount = 0;
    var opponentCount = 0;
    for (var j = 0; j < 3; j++) {
      if (board[j][i] === mark) {
        markCount++;
      }
      else if (board[j][i] === opponent) {
        opponentCount++;
      }
    }
    if (markCount === 1 && opponentCount === 0) {
      y = i;
      for (var j = 0; j < 3; j++) {
        if (board[j][i] === null) {
          x = j;
          break;
        }
      }
      if (x > -1) {
        return [x, y];
      }
    }
  }

  // If all else fails
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; i++) {
      if (board[i][j] === null) {
        return [i, j];
      }
    }
  }
}

TicTacToe.prototype.computerTakeTurn = function(x, y) {
  var self = this;

  setTimeout(function() {
    self.takeTurn(x, y);
  }, this.computerDelay);
}

TicTacToe.prototype.computerTurn = function() {
  var state = this.getCurrentState();

  if (this.state.length === 1 || this.isValidTurn(1, 1)) {
    this.computerTakeTurn(1, 1);
  }
  else {
    this.computerScan();
  }
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

TicTacToe.prototype.isDraw = function(board) {
  for (var i = 0; i < 3; i++) {
    if (board[i].indexOf(null) > -1) {
      return false;
    }
  }
  return true;
}

TicTacToe.prototype.takeTurn = function(x, y) {
  var state = this.getCurrentState();
  var winning = false;
  if (this.isValidTurn(x, y)) {
    var newState = {
      activePlayer: (state.activePlayer === 'Computer') ? 'Player' : 'Computer',
      playerMarker: (state.playerMarker === 'x') ? 'o' : 'x',
      computerWinCount: state.computerWinCount,
      playerWinCount: state.playerWinCount,
      reset: state.reset
    };
    newState.currentBoard = this.updatedBoard(x, y);
    newState.winningMove = winning = this.isWinningTurn(state.playerMarker, newState.currentBoard);
    newState.draw = winning ? false : this.isDraw(newState.currentBoard);
    newState.winner = winning ? state.activePlayer : null
    this.updateState({
      type: 'add',
      newState: newState
    });
  }
}

TicTacToe.prototype.updateHandlers = function(bool) {
  if (bool) {
    Array.prototype.forEach.call(this.squares, function(square) {
      square.onclick = function(e) {
        var cords = JSON.parse(this.dataset.cords);
        var x = cords[0];
        var y = cords[1];
        tictactoe.takeTurn(x, y);
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
  return random === 0 ? 'Player' : 'Computer';
}

function startGame(game) {
  window.tictactoe = new TicTacToe(game);
  tictactoe.showBoard(true);
}

window.onload = function(e) {
  elById('startForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var player = playerOrComputerFirst();
    var marker = this.elements.marker.value;

    if (player === 'Computer') {
      marker = (marker === 'x') ? 'o' : 'x'
    }

    if (!localStorage.getItem('playerWinCount')) {
      localStorage.setItem('playerWinCount', '0');
      localStorage.setItem('computerWinCount', '0');
    }

    startGame({
      marker: marker,
      player: player,
      reset: false
    });
  });
}