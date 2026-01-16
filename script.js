const cells = document.querySelectorAll('.cell');
const resetBtn = document.getElementById('reset-btn');
const playerScoreText = document.getElementById('player-score');
const aiScoreText = document.getElementById('ai-score');
const drawScoreText = document.getElementById('draw-score');
const themeBtn = document.getElementById('theme-toggle');
const winLine = document.getElementById('win-line');


let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let playerScore = 0, aiScore = 0, drawScore = 0;

const winPatterns = [
    { combo: [0,1,2], line: 'row-1' },
    { combo: [3,4,5], line: 'row-2' },
    { combo: [6,7,8], line: 'row-3' },

    { combo: [0,3,6], line: 'col-1' },
    { combo: [1,4,7], line: 'col-2' },
    { combo: [2,5,8], line: 'col-3' },

    { combo: [0,4,8], line: 'diag-1' },
    { combo: [2,4,6], line: 'diag-2' }
];


const clickSound = new Audio('assets/click.wav');
const winSound = new Audio('assets/win.wav');
const drawSound = new Audio('assets/draw.wav');

themeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

cells.forEach(cell => cell.addEventListener('click', () => handleClick(cell)));

resetBtn.addEventListener('click', () => resetGame());

function handleClick(cell) {
    const idx = cell.dataset.index;
    if (board[idx] !== '' || isGameOver) return;
    board[idx] = currentPlayer;
    cell.textContent = currentPlayer;
    clickSound.play();

    if (checkWin(currentPlayer)) {
        endGame(currentPlayer);
        return;
    }
    if (isDraw()) {
        drawSound.play();
        drawScore++;
        drawScoreText.textContent = `Draws: ${drawScore}`;
        isGameOver = true;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (currentPlayer === 'O') aiMove();
}

function aiMove() {
    let emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    const bestIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[bestIdx] = currentPlayer;
    cells[bestIdx].textContent = currentPlayer;
    clickSound.play();

    if (checkWin(currentPlayer)) {
        endGame(currentPlayer);
        return;
    }

    if (isDraw()) {
        drawSound.play();
        drawScore++;
        drawScoreText.textContent = `Draws: ${drawScore}`;
        isGameOver = true;
        return;
    }

    currentPlayer = 'X';
}

function checkWin(player) {
    for (let pattern of winPatterns) {
        if (pattern.combo.every(i => board[i] === player)) {
            drawWinLine(pattern.line);
            return true;
        }
    }
    return false;
}

function isDraw() {
    return board.every(cell => cell !== '');
}

function endGame(player) {
    isGameOver = true;
    if (player === 'X') {
        playerScore++;
        playerScoreText.textContent = `Player: ${playerScore}`;
    } else {
        aiScore++;
        aiScoreText.textContent = `AI: ${aiScore}`;
    }
    winSound.play();
}

function resetGame() {
    board.fill('');
    cells.forEach(cell => cell.textContent = '');
    isGameOver = false;
    currentPlayer = 'X';
    winLine.style.width = '0';

}
function drawWinLine(type) {
    winLine.style.width = '260px';

    const pos = {
        'row-1': ['16%', '5%', '0deg'],
        'row-2': ['50%', '5%', '0deg'],
        'row-3': ['84%', '5%', '0deg'],

        'col-1': ['5%', '16%', '90deg'],
        'col-2': ['5%', '50%', '90deg'],
        'col-3': ['5%', '84%', '90deg'],

        'diag-1': ['5%', '5%', '45deg'],
        'diag-2': ['5%', '95%', '-45deg']
    };

    const [top, left, rotate] = pos[type];
    winLine.style.top = top;
    winLine.style.left = left;
    winLine.style.transform = `rotate(${rotate})`;
}
