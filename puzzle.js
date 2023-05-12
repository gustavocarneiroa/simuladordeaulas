const words = [	"APPLE",	"BANANA",	"CHERRY",	"GRAPE",	"KIWI",	"LEMON",	"ORANGE",	"PEAR",	"PLUM",	"STRAWBERRY"];

const clues = [	"Fruit that's red and round",	"Yellow fruit with a peel",	"Small fruit often used in pies",	"Fruit that grows in clusters",	"Small fruit with a fuzzy brown exterior",	"Sour fruit often used in drinks",	"Fruit with a tough outer layer",	"Fruit that's shaped like a teardrop",	"Purple fruit with a juicy interior",	"Sweet fruit often used in desserts"];

// Shuffle the words array
for (let i = words.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[words[i], words[j]] = [words[j], words[i]];
}

// Set up the grid
const grid = [];
const size = 15; // 15x15 grid

for (let i = 0; i < size; i++) {
	grid[i] = [];
	for (let j = 0; j < size; j++) {
		grid[i][j] = "";
	}
}

// Add words to the grid
for (let i = 0; i < words.length; i++) {
	const word = words[i];
	const wordLength = word.length;
	let wordAdded = false;

	while (!wordAdded) {
		const row = Math.floor(Math.random() * size);
		const col = Math.floor(Math.random() * size);
		const direction = Math.floor(Math.random() * 2); // 0 for horizontal, 1 for vertical

		let rowIncrement = 0;
		let colIncrement = 0;

		if (direction === 0) {
			colIncrement = 1;
		} else {
			rowIncrement = 1;
		}

		if (canAddWordToGrid(word, row, col, rowIncrement, colIncrement)) {
			for (let j = 0; j < wordLength; j++) {
				grid[row + j * rowIncrement][col + j * colIncrement] = word.charAt(j);
			}
			wordAdded = true;
		}
	}
}

// Check if a word can be added to the grid starting at the given row and column with the given increments
function canAddWordToGrid(word, row, col, rowIncrement, colIncrement) {
	const wordLength = word.length;

	if (row + rowIncrement * wordLength > size || col + colIncrement * wordLength > size) {
		return false;
	}

	for (let i = 0; i < wordLength; i++) {
		const character = word.charAt(i);
		const gridCharacter = grid[row + i * rowIncrement][col + i * colIncrement];

		if (gridCharacter !== "" && gridCharacter !== character) {
			return false;
		}
	}

	return true;
}

// Add clues to the page
const clueList = document.createElement("ol");

for (let i = 0; i < words.length; i++) {
	const li = document.createElement("li");
	const clue = document.createTextNode(clues[i]);
	li.appendChild(clue);
	clueList.appendChild(li);
}

document.body.appendChild(clueList);

const cell = document.createElement("div");
cell.classList.add("cell");

for (let i = 0; i < size; i++) {
	for (let j = 0; j < size; j++) {
		const letter = document.createTextNode(grid[i][j]);
		const currentCell = cell.cloneNode(true);
		currentCell.dataset.row = i;
		currentCell.dataset.col = j;
		currentCell.appendChild(letter);
		document.getElementById("puzzle").appendChild(currentCell);
	}
}

// Add event listener to cells
const cells = document.querySelectorAll(".cell");
let selectedCell;

cells.forEach(function(cell) {
	cell.addEventListener("click", function() {
		if (selectedCell) {
			selectedCell.classList.remove("selected");
		}
		cell.classList.add("selected");
		selectedCell = cell;
	});
});

// Add event listener to keyboard
document.addEventListener("keydown", function(event) {
	if (selectedCell) {
		const row = parseInt(selectedCell.dataset.row);
		const col = parseInt(selectedCell.dataset.col);
		let newRow = row;
		let newCol = col;

		switch (event.key) {
			case "ArrowUp":
				newRow = Math.max(0, row - 1);
				break;
			case "ArrowDown":
				newRow = Math.min(size - 1, row + 1);
				break;
			case "ArrowLeft":
				newCol = Math.max(0, col - 1);
				break;
			case "ArrowRight":
				newCol = Math.min(size - 1, col + 1);
				break;
			default:
				return;
		}

		selectedCell.classList.remove("selected");
		selectedCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
		selectedCell.classList.add("selected");
	}
});