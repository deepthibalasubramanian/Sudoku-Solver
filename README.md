# Sudoku Solver

A web-based Sudoku solver that supports 4x4, 6x6, and 9x9 Sudoku puzzles. Enter your puzzle, select the board size, and click "Solve!" to get the solution instantly.

## Features

- Supports 4x4, 6x6, and 9x9 Sudoku boards.
- Dynamic board generation based on selected size.
- Input validation for each board type.
- Fast backtracking algorithm for solving.
- Clear board functionality.

## How It Works

### Board Representation

- The board is represented as a flat string (row-wise).
- Empty cells are denoted by `-`.
- For 4x4: valid symbols are `1-4`.
- For 6x6: valid symbols are `1-6`.
- For 9x9: valid symbols are `1-9`.

### Solving Logic

The solver uses a recursive backtracking algorithm:

1. **Find the next empty cell.**
2. **Try all valid symbols** for the current board size.
3. **Check constraints:**
   - The symbol must not appear in the same row.
   - The symbol must not appear in the same column.
   - The symbol must not appear in the same box (2x2 for 4x4, 2x3 for 6x6, 3x3 for 9x9).
4. **If valid, place the symbol and recurse.**
5. **If stuck, backtrack** and try the next symbol.
6. **If the board is filled, return the solution.**

### Box Sizes

- **4x4:** 2x2 boxes.
- **6x6:** 2x3 boxes.
- **9x9:** 3x3 boxes.

### Input Validation

- Only valid symbols for the selected board size are accepted.
- Any other input is cleared automatically.

### Corner Cases Handled

- **Invalid boards:** If the board has no solution, an alert is shown.
- **Multiple solutions:** The solver finds one valid solution (not all possible).
- **Pre-filled cells:** The solver respects all user inputs and only fills empty cells.
- **Non-square or unsupported sizes:** Only 4x4, 6x6, and 9x9 are supported.
- **Invalid symbols:** Any invalid input is ignored and cleared.

## Usage

1. Open `index.html` in your browser.
2. Select the board size (4x4, 6x6, or 9x9).
3. Enter the known values in the grid.
4. Click "Solve!" to fill in the solution.
5. Click "Clear board" to reset.

## File Structure

- `index.html` - Main UI and logic.
- `sudoku.js` - Sudoku solving logic.
- `README.md` - Project documentation.

## License

MIT License.
