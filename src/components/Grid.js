import { useState, useEffect, useCallback } from "react";
import Tile from "./Tile";
import { uid } from "uid";



function emptyPositions(board) {
	let emptyList = [];
	for (var x = 0; x < board.length; x++) {
		for (var y = 0; y < board.length; y++) {
			if (board[x][y] === null) {
				emptyList.push({ x: x, y: y });
			}
		}
	}
	return emptyList;
}

function randomEmptyPosition(board) {
	let empty = emptyPositions(board);
	return (empty.length > 0) ? empty[Math.floor(Math.random() * empty.length)] : false;
}

function addRandomNewTile(board, tiles) {
	let newBoard = [...board];
	let emptyPosition = randomEmptyPosition(board);

	const tileId = uid();
	if (!emptyPosition) {
		return false;
	}
	newBoard[emptyPosition.x][emptyPosition.y] = tileId;

	let newTiles = {...tiles, [tileId]: { id: tileId, value: (Math.random() < 0.9) ? 2 : 4, position: [emptyPosition.x, emptyPosition.y]}};
	
	return {board: newBoard, tiles: newTiles};
}

function debugItems(board, tiles) {
	let newBoard = [...board];
	let newTiles = {...tiles};
	let value = 1;
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (value < 65536) {
				value *= 2;
			} else {
				break;
			}
			const tileId = uid();
			newBoard[i][j] = tileId;
			newTiles[tileId] = { id: tileId, value: value, position: [i, j]};

		}
	}	
	return {board: newBoard, tiles: newTiles};
}

const controls = {
	w: 'up',
	a: 'left',
	s: 'down',
	d: 'right',
	W: 'up',
	A: 'left',
	S: 'down',
	D: 'right',
	ArrowUp: 'up',
	ArrowLeft: 'left',
	ArrowDown: 'down',
	ArrowRight: 'right',
	Up: 'up',
	Left: 'left',
	Down: 'down',
	Right: 'right',
}

function Move(direction, board, tiles, continueAfterWin) {

	let newBoard = [...board]
	let changed = false;
	let newTiles = {...tiles}
	let toBeDeletedTiles = []
	let score = 0;
	let won = false;
	switch (direction) {
		case 'left':
			for (let y = 0; y < newBoard.length; y++) {
				let newX = 0;
				let previousTile = null;
				for (let x = 0; x < newBoard.length; x++) {
					let tileId = newBoard[y][x];
					let currentTile = newTiles[tileId];
					if (tileId !== null) {
						if (previousTile && currentTile.value === previousTile.value) {
							score += newTiles[previousTile.id].value * 2;
							newTiles[previousTile.id].value *= 2;
							if (newTiles[previousTile.id].value >= 2048 && !continueAfterWin) {
								won = true;
							}
							
							newTiles[tileId].position = [y, newX - 1];
							toBeDeletedTiles.push(tileId);
							newBoard[y][x] = null;
							previousTile = null;
							changed = true;
							continue;
						}


						if (newBoard[y][newX] === null) {
							newTiles[tileId].position = [y, newX];
							newBoard[y][newX] = newBoard[y][x];
							newBoard[y][x] = null;
							if (x !== newX) {
								changed = true;
							}
						}
						previousTile = newTiles[tileId]
	
						newX++;
					}

				}
			}
			break;
		case 'right':
			for (let y = 0; y < newBoard.length; y++) {
				let newX = newBoard.length-1;
				let previousTile = null;
				for (let x = newBoard.length-1; x >= 0; x--) {
					let tileId = newBoard[y][x];
					let currentTile = newTiles[tileId];
					if (tileId) {
						if (previousTile && currentTile.value === previousTile.value) {
							score += newTiles[previousTile.id].value * 2;
							newTiles[previousTile.id].value *= 2;
							if (newTiles[previousTile.id].value >= 2048 && !continueAfterWin) {
								won = true;
							}
							newTiles[tileId].position = [y, newX + 1];
							toBeDeletedTiles.push(tileId);
							newBoard[y][x] = null;
							previousTile = null;
							changed = true;
							continue;
						}


						if (newBoard[y][newX] === null) {
							newTiles[tileId].position = [y, newX];
							newBoard[y][newX] = newBoard[y][x];
							newBoard[y][x] = null;
							if (x !== newX) {
								changed = true;
							}
						}
						previousTile = newTiles[tileId]
	
						newX--;
					}

				}
			}
			break;
		case 'down':
			for (let x = 0; x < newBoard.length; x++) {
				let newY = newBoard.length-1;
				let previousTile = null;
				for (let y = newBoard.length-1; y >= 0; y--) {
					let tileId = newBoard[y][x];
					let currentTile = newTiles[tileId];
					if (tileId) {
						if (previousTile && currentTile.value === previousTile.value) {
							score += newTiles[previousTile.id].value * 2;
							newTiles[previousTile.id].value *= 2;
							if (newTiles[previousTile.id].value >= 2048 && !continueAfterWin) {
								won = true;
							}
							newTiles[tileId].position = [newY + 1, x];
							toBeDeletedTiles.push(tileId);
							newBoard[y][x] = null;
							previousTile = null;
							changed = true;
							continue;
						}


						if (newBoard[newY][x] === null) {
							newTiles[tileId].position = [newY, x];
							newBoard[newY][x] = newBoard[y][x];
							newBoard[y][x] = null;
							if (y !== newY) {
								changed = true;
							}
						}
						previousTile = newTiles[tileId]
	
						newY--;
					}

				}
			}
			break;
		case 'up':
			for (let x = 0; x < newBoard.length; x++) {
				let newY = 0;
				let previousTile = null;
				for (let y = 0; y < newBoard.length; y++) {
					let tileId = newBoard[y][x];
					let currentTile = newTiles[tileId];
					if (tileId) {
						if (previousTile && currentTile.value === previousTile.value) {
							score += newTiles[previousTile.id].value * 2;
							newTiles[previousTile.id].value *= 2;
							if (newTiles[previousTile.id].value >= 2048 && !continueAfterWin) {
								won = true;
							}
							newTiles[tileId].position = [newY - 1, x];
							toBeDeletedTiles.push(tileId);
							newBoard[y][x] = null;
							previousTile = null;
							changed = true;
							continue;
						}


						if (newBoard[newY][x] === null) {
							newTiles[tileId].position = [newY, x];
							newBoard[newY][x] = newBoard[y][x];
							newBoard[y][x] = null;
							if (y !== newY) {
								changed = true;
							}
						}
						previousTile = newTiles[tileId]
	
						newY++;
					}

				}
			}
			break;
		default:
			console.log("Something went wrong");

	}
	return { board: newBoard, changed: changed, tiles: newTiles, toBeDeleted: toBeDeletedTiles, scoreToAdd: score, won: won };
}

function TileList({ tiles, theme }) {
	let result = [];
	for (const [tileId, tile] of Object.entries(tiles)) {
		result.push(<Tile key={tileId} value={tile.value} position={[tile.position[1], tile.position[0]]} theme={theme}></Tile>)
	}
	return result
}

function isGameOver(tiles, board) {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board.length; j++) {
			if (board[i][j] === null) {
				return false;
			}

			let tileFront = (j !== board.length-1) ? tiles[board[i][j+1]] : null;
			let tileUnder = (i !== board.length-1) ? tiles[board[i+1][j]] : null;
			let tileCurrent = tiles[board[i][j]];
			if ((tileFront && tileCurrent.value === tileFront.value) || (tileUnder && tileCurrent.value === tileUnder.value)) {
				return false;
			}
		}
	}
	return true;
}

const DEBUG = false;

export default function Grid({ setScore, score, restart, setGameOver, setWon, continueAfterWin, theme, swipeEvent }) {
	const [board, setBoard] = useState(null);
	const [tiles, setTiles] = useState(null);
	const [inputCooldown, setInputCooldown] = useState(false);

	const detectKeyDown = useCallback((e) => {
		if (!controls[e.key] || inputCooldown) return;
		setInputCooldown(true);
		let boardData = Move(controls[e.key], board, tiles, continueAfterWin);
		if (boardData.won) {
			setTimeout(() => setWon(true), 1000);
		}
		if (boardData.changed) {
			setBoard(boardData.board);
			setTiles(boardData.tiles);
			setScore(score+boardData.scoreToAdd);
			
			
			setTimeout(() => {
				if (boardData.toBeDeleted) {
					for (let i = 0; i < boardData.toBeDeleted.length; i++) {
						delete boardData.tiles[boardData.toBeDeleted[i]];
					}
				}

				let newBoard = addRandomNewTile(boardData.board, boardData.tiles);

				setBoard(newBoard.board);
				setTiles(newBoard.tiles);

				setInputCooldown(false);
				if (isGameOver(newBoard.tiles, newBoard.board)) {
					setTimeout(() => setGameOver(true), 1000);
					
					return;
				}
				
			}, 200);

			
		} else {
			setInputCooldown(false);
		}
		
	}, [board, continueAfterWin, inputCooldown, score, setScore, setGameOver, setWon, tiles])

	useEffect(() => {
		if (swipeEvent) {
			detectKeyDown(swipeEvent);
		}
		
	}, [swipeEvent])




	useEffect(() => {
		setGameOver(false);
		if (DEBUG) {
			let debug = debugItems(Array(4).fill(null).map(() => new Array(4).fill(null)), {});
			setBoard(debug.board);
			setTiles(debug.tiles);
		} else {
			let randomTile_1 = addRandomNewTile(Array(4).fill(null).map(() => new Array(4).fill(null)), {});
			let randomTile_2 = addRandomNewTile(randomTile_1.board, randomTile_1.tiles);
			setBoard(randomTile_2.board);
			setTiles(randomTile_2.tiles);
		}


	}, [restart, setGameOver]);

	useEffect(() => {

		
		window.addEventListener('keydown', detectKeyDown);

		return () => {
			window.removeEventListener('keydown', detectKeyDown);
		}
	}, [board, tiles, detectKeyDown]);



	return (
		<>
			{(tiles) ? <TileList tiles={tiles} theme={theme}></TileList> : null}
		</>
	)
}