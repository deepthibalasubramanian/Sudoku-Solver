"use strict";

var EASY_PUZZLE =
  "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
var MEDIUM_PUZZLE =
  "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
var HARD_PUZZLE =
  "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";

// Set this variable to true to publicly expose otherwise private functions inside of SudokuSolver
var TESTABLE = true;

var SudokuSolver = (function (testable) {
  var solver;

  // PUBLIC FUNCTIONS
  function solve(boardString) {
    var boardArray = boardString.split("");
    if (boardIsInvalid(boardArray)) {
      return false;
    }
    return recursiveSolve(boardString);
  }

  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString);
    console.log(toString(solvedBoard.split("")));
    return solvedBoard;
  }

  // PRIVATE FUNCTIONS
  function recursiveSolve(boardString) {
    var boardArray = boardString.split("");
    if (boardIsSolved(boardArray)) {
      return boardArray.join("");
    }
    var cellPossibilities = getNextCellAndPossibilities(boardArray);
    var nextUnsolvedCellIndex = cellPossibilities.index;
    var possibilities = cellPossibilities.choices;
    for (var i = 0; i < possibilities.length; i++) {
      boardArray[nextUnsolvedCellIndex] = possibilities[i];
      var solvedBoard = recursiveSolve(boardArray.join(""));
      if (solvedBoard) {
        return solvedBoard;
      }
    }
    return false;
  }

  function boardIsInvalid(boardArray) {
    return !boardIsValid(boardArray);
  }

  function boardIsValid(boardArray) {
    return (
      allRowsValid(boardArray) &&
      allColumnsValid(boardArray) &&
      allBoxesValid(boardArray)
    );
  }

  function boardIsSolved(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        return false;
      }
    }
    return true;
  }

  function getNextCellAndPossibilities(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        var existingValues = getAllIntersections(boardArray, i);
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(
          function (num) {
            return existingValues.indexOf(num) < 0;
          }
        );
        return { index: i, choices: choices };
      }
    }
  }

  function getAllIntersections(boardArray, i) {
    return getRow(boardArray, i)
      .concat(getColumn(boardArray, i))
      .concat(getBox(boardArray, i));
  }

  function allRowsValid(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72]
      .map(function (i) {
        return getRow(boardArray, i);
      })
      .reduce(function (validity, row) {
        return collectionIsValid(row) && validity;
      }, true);
  }

  function getRow(boardArray, i) {
    var startingEl = Math.floor(i / 9) * 9;
    return boardArray.slice(startingEl, startingEl + 9);
  }

  function allColumnsValid(boardArray) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8]
      .map(function (i) {
        return getColumn(boardArray, i);
      })
      .reduce(function (validity, row) {
        return collectionIsValid(row) && validity;
      }, true);
  }

  function getColumn(boardArray, i) {
    var startingEl = Math.floor(i % 9);
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return boardArray[startingEl + num * 9];
    });
  }

  function allBoxesValid(boardArray) {
    return [0, 3, 6, 27, 30, 33, 54, 57, 60]
      .map(function (i) {
        return getBox(boardArray, i);
      })
      .reduce(function (validity, row) {
        return collectionIsValid(row) && validity;
      }, true);
  }

  function getBox(boardArray, i) {
    var boxCol = Math.floor(i / 3) % 3;
    var boxRow = Math.floor(i / 27);
    var startingIndex = boxCol * 3 + boxRow * 27;
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) {
      return boardArray[startingIndex + num];
    });
  }

  function collectionIsValid(collection) {
    var numCounts = {};
    for (var i = 0; i < collection.length; i++) {
      if (collection[i] != "-") {
        if (numCounts[collection[i]] === undefined) {
          numCounts[collection[i]] = 1;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  function toString(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72]
      .map(function (i) {
        return getRow(boardArray, i).join(" ");
      })
      .join("\n");
  }

  function getSymbols(size) {
    if (size === 4) return ["1", "2", "3", "4"];
    if (size === 6) return ["1", "2", "3", "4", "5", "6"];
    // default 9x9
    return ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  }

  function getBoxSize(size) {
    if (size === 4) return { rows: 2, cols: 2 };
    if (size === 6) return { rows: 2, cols: 3 };
    // default 9x9
    return { rows: 3, cols: 3 };
  }

  function solve(boardString, size) {
    var N = size;
    var symbols = getSymbols(N);
    var box = getBoxSize(N);
    var board = [];
    var cells = boardString.split("");
    for (var i = 0; i < N; i++) {
      board.push([]);
      for (var j = 0; j < N; j++) {
        var val = cells[i * N + j];
        board[i][j] = symbols.includes(val) ? val : null;
      }
    }

    function isValid(row, col, val) {
      // Row and column check
      for (var i = 0; i < N; i++) {
        if (board[row][i] === val) return false;
        if (board[i][col] === val) return false;
      }
      // Box check
      var startRow = Math.floor(row / box.rows) * box.rows;
      var startCol = Math.floor(col / box.cols) * box.cols;
      for (var i = 0; i < box.rows; i++) {
        for (var j = 0; j < box.cols; j++) {
          if (board[startRow + i][startCol + j] === val) return false;
        }
      }
      return true;
    }

    function backtrack(r, c) {
      if (r === N) return true;
      var nextR = c === N - 1 ? r + 1 : r;
      var nextC = c === N - 1 ? 0 : c + 1;
      if (board[r][c]) return backtrack(nextR, nextC);
      for (var k = 0; k < symbols.length; k++) {
        var val = symbols[k];
        if (isValid(r, c, val)) {
          board[r][c] = val;
          if (backtrack(nextR, nextC)) return true;
          board[r][c] = null;
        }
      }
      return false;
    }

    if (backtrack(0, 0)) {
      // Flatten board to string
      return board.flat().join("");
    }
    return null;
  }

  if (testable) {
    // These methods will be exposed publicly when testing is on.
    solver = {
      solve: solve,
      solveAndPrint: solveAndPrint,
      recursiveSolve: recursiveSolve,
      boardIsInvalid: boardIsInvalid,
      boardIsValid: boardIsValid,
      boardIsSolved: boardIsSolved,
      getNextCellAndPossibilities: getNextCellAndPossibilities,
      getAllIntersections: getAllIntersections,
      allRowsValid: allRowsValid,
      getRow: getRow,
      allColumnsValid: allColumnsValid,
      getColumn: getColumn,
      allBoxesValid: allBoxesValid,
      getBox: getBox,
      collectionIsValid: collectionIsValid,
      toString: toString,
    };
  } else {
    // These will be the only public methods when testing is off.
    solver = { solve: solve, solveAndPrint: solveAndPrint };
  }

  return solver;
})(TESTABLE);
