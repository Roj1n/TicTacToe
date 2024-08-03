// script.js

document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    let board = Array(9).fill(null);
    let currentPlayer = "X"; // User is "X", computer is "O"
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWin(player) {
        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return board[index] === player;
            });
        });
    }

    function checkDraw() {
        return board.every(cell => cell !== null);
    }

    function computerMove() {
        // Simple AI: Make a move to win if possible, otherwise block user win, otherwise random move
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] === "O" && board[b] === "O" && !board[c]) return c;
            if (board[a] === "O" && board[c] === "O" && !board[b]) return b;
             if (board[b] === "O" && board[c] === "O" && !board[a]) return a;
        }
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] === "X" && board[b] === "X" && !board[c]) return c;
            if (board[a] === "X" && board[c] === "X" && !board[b]) return b;
            if (board[b] === "X" && board[c] === "X" && !board[a]) return a;
        }
        let emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function handleClick(event) {
        const index = event.target.dataset.index;

        if (board[index] || checkWin("X") || checkWin("O")) return;

        board[index] = currentPlayer;
        event.target.classList.add(currentPlayer);
        event.target.textContent = currentPlayer;

        if (checkWin(currentPlayer)) {
            setTimeout(() => alert(`${currentPlayer} wins!`), 10);
            return;
        } else if (checkDraw()) {
            setTimeout(() => alert("It's a draw!"), 10);
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (currentPlayer === "O") {
            let move = computerMove();
            board[move] = currentPlayer;
            cells[move].classList.add(currentPlayer);
            cells[move].textContent = currentPlayer;

            if (checkWin(currentPlayer)) {
                setTimeout(() => alert(`Computer (${currentPlayer}) wins!`), 10);
                return;
            } else if (checkDraw()) {
                setTimeout(() => alert("It's a draw!"), 10);
                return;
            }

            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }

    cells.forEach(cell => cell.addEventListener("click", handleClick));
});
