const boardDiv = document.querySelector('.board')

let currPlayer = 'O'
let winner: undefined | string | number = undefined

type Board = string[][]

const changePlayer = () => {
	currPlayer === 'O' ? (currPlayer = 'X') : (currPlayer = 'O')
}

const generateBoard = (size: number) => {
	const newBoard: Board = []

	for (let i = 0; i < size; i++) {
		newBoard.push([...Array(size)])
	}
	return newBoard
}

const restartGame = () => {
	while (boardDiv?.firstChild) {
		boardDiv?.removeChild(boardDiv.firstChild!)
	}

	currPlayer = 'O'
	winner = undefined
	init()
}

const displayBoard = () => {
	const board = generateBoard(3)
	board.map((row, rI) => {
		const rowDiv = document.createElement('div')
		rowDiv.classList.add('board-row')
		boardDiv?.appendChild(rowDiv)

		const cells = row.map((cell, cI) => {
			const cellDiv = document.createElement('div')
			cellDiv.classList.add('cell')
			cellDiv.addEventListener('click', () =>
				cellClickHandler(cellDiv, board, rI, cI)
			)
			rowDiv.appendChild(cellDiv)
		})
	})
}

const checkForWinner = (board: Board) => {
	// check for rows
	for (let i = 0; i < board.length; i++) {
		if (board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
			winner = board[i][0]
		}
		if (winner !== undefined) {
			showPopup(winner)
			return
		}
	}

	//check for columns
	for (let i = 0; i < board.length; i++) {
		if (board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
			winner = board[0][i]
			if (winner !== undefined) {
				showPopup(winner)
				return
			}
		}
	}

	// check for diagonals

	for (let i = 0; i < board.length; i++) {
		if (
			(board[0][0] === board[1][1] &&
				board[0][0] === board[2][2] &&
				board[1][1] !== undefined) ||
			(board[0][2] === board[1][1] &&
				board[0][2] === board[2][0] &&
				board[1][1] !== undefined)
		) {
			winner = currPlayer
		}
		if (winner !== undefined) {
			showPopup(winner)
			return
		}
	}

	// check for tie

	const flattenedBoard = board.reduce((acc, curr) => [...acc, ...curr], [])

	if (flattenedBoard.every((cell) => cell !== undefined)) {
		winner = 'Tie'
		showPopup(winner)
		return
	}
}

const showPopup = (winner: string | number) => {
	const popup = document.createElement('div')
	popup.classList.add('popup')
	const p = document.createElement('p')

	winner === 'Tie'
		? (p.textContent = 'Tie!')
		: (p.textContent = `${winner} wins!`)

	popup.appendChild(p)

	const restartBtn = document.createElement('button')
	restartBtn.addEventListener('click', () => {
		restartGame()
		popup.remove()
	})
	restartBtn.textContent = 'Restart'
	popup.appendChild(restartBtn)

	document.body.appendChild(popup)
}

const cellClickHandler = (
	cellDiv: HTMLElement,
	board: any[],
	rI: number,
	cI: number
) => {
	if (board[rI][cI] === 'O' || board[rI][cI] === 'X' || winner !== undefined) {
		return
	}

	const p = document.createElement('p')
	p.textContent = currPlayer
	board[rI][cI] = currPlayer

	cellDiv.appendChild(p)

	checkForWinner(board)

	changePlayer()
}

const init = () => {
	displayBoard()
}

init()
