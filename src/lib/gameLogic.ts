type IPlayer = 'X' | 'O';
type IField = (IPlayer | null)[];

export function getOtherPlayer(player: IPlayer) {
  return player === 'X' ? 'O' : 'X';
}

function _fieldIsFull(field: IField) {
  return field.every((val) => !!val);
}

function _calculateMoveAgainstOpponent(field: IField, currentPlayer: IPlayer, returnArray = false): number | (IPlayer|number)[] | void {
  const fieldRoot = 3;
  let calcMove = [];
  const opponentDiagonal1 = [];
  const opponentDiagonal2 = [];

  for (let i = 0; i < fieldRoot; i++) {
    const opponentHorizontal = [];
    const opponentVertical = [];

    for (let j = 0; j < fieldRoot; j++) {
      if (field[i * 2 + i + j] !== currentPlayer) {
        opponentHorizontal.push(field[i * 2 + i + j] ?? i * 2 + i + j)
      }

      if (field[i + j + j * 2] !== currentPlayer) {
        opponentVertical.push(field[i + j + j * 2] ?? i + j + j * 2)
      }
    }

    if (opponentHorizontal.length > 1) calcMove.push(opponentHorizontal);
    if (opponentVertical.length > 1) calcMove.push(opponentVertical);

    if (field[i * 4] !== currentPlayer) {
      opponentDiagonal1.push(field[i * 4] ?? i * 4)
    }

    if (field[i + i + 2] !== currentPlayer) {
      opponentDiagonal2.push(field[i + i + 2] ?? i + i + 2)
    }
  }

  if (opponentDiagonal1.length > 1) calcMove.push(opponentDiagonal1);
  if (opponentDiagonal2.length > 1) calcMove.push(opponentDiagonal2);

  // @ts-ignore
  if (returnArray) return calcMove;
  // @ts-ignore
  return calcMove.filter(val => val.length === fieldRoot && val.filter(ele => getOtherPlayer(currentPlayer) === ele).length === 2)[0]?.find(ele => Number.isInteger(ele));
}

function _calculateRandomMove(field: IField): number {
  let randomNumber: number;

  do {
    randomNumber = Math.floor(Math.random() * 9);
  } while (!!field[randomNumber]);

  return randomNumber;
}

function _getMoveWithHeighestProbability(field: IField, currentPlayer?: IPlayer, returnArray = false) {
  const fieldRoot = 3;
  let fieldProbability = new Map();

  for (let i = 0; i < fieldRoot; i++) {
    const diagonal1I = i * 4;
    const diagonal2I = i + i + 2;

    for (let j = 0; j < fieldRoot; j++) {
      const horizontalI = i * 2 + i + j;
      const verticalI = i + j + j * 2;

      fieldProbability.set(horizontalI, (fieldProbability.get(horizontalI) ?? 0) + 1);
      fieldProbability.set(verticalI, (fieldProbability.get(verticalI) ?? 0) + 1);
    }

    fieldProbability.set(diagonal1I, (fieldProbability.get(diagonal1I) ?? 0) + 1);
    fieldProbability.set(diagonal2I, (fieldProbability.get(diagonal2I) ?? 0) + 1);
  }

  if (currentPlayer) {
    // @ts-ignore
    _calculateMoveAgainstOpponent(field, getOtherPlayer(currentPlayer), true).forEach((arr, i) => {
        // @ts-ignore
        arr.forEach(ele => {
          if (Number.isInteger(ele)){
            let newVal = arr.length === fieldRoot ? fieldProbability.get(ele) + 2 : fieldProbability.get(ele) + 1;
            fieldProbability.set(ele, newVal);
          }
        });
    });
  }


  const fieldProbabilityArray = [...fieldProbability.entries()].filter(([i]) => !field[i]).sort((a, b) => b[1] - a[1]);

  if (returnArray)
    return fieldProbabilityArray;

  for (let i = 0; i < fieldProbabilityArray.length; i++) {
    const currEle = fieldProbabilityArray[i];

    if (!field[currEle[0]])
      return currEle[0];
  }
}

export function checkForWinner(field: IField, currentPlayer: IPlayer): string | void {
  const fieldRoot = 3;
  const verticalAndHorizontal = [];
  let diagonal1 = true;
  let diagonal2 = true;

  // Check horizontal or vertical winner
  for (let i = 0; i < fieldRoot; i++) {
    let horizontal = true;
    let vertical = true;

    for (let j = 0; j < fieldRoot; j++) {
      // Check horizontal
      if (field[i * 2 + i + j] !== currentPlayer) {
        horizontal = false;
      }

      // Check vertical
      if (field[i + j + j * 2] !== currentPlayer) {
        vertical = false;
      }
    }

    verticalAndHorizontal.push(horizontal);
    verticalAndHorizontal.push(vertical);

    if (field[i * 4] !== currentPlayer) {
      diagonal1 = false;
    }

    if (field[i + i + 2] !== currentPlayer) {
      diagonal2 = false;
    }
  }

  if (verticalAndHorizontal.find(val => val) || diagonal1 || diagonal2) {
    return `Player ${currentPlayer} wins!`;
  }

  if (_fieldIsFull(field)) return "Tie";
}

export function calculateMove(field: IField, strength: 1 | 2 | 3 = 1, computerPlayer: IPlayer): number | void {
  if (_fieldIsFull(field)) return;

  switch (strength) {
    case 2:
      return _getMoveWithHeighestProbability(field);

    case 3:
      const againstOpponent = _calculateMoveAgainstOpponent(field, computerPlayer);
      if (!!againstOpponent) {
        // @ts-ignore
        return againstOpponent;
      }
      return _getMoveWithHeighestProbability(field, computerPlayer);

    default:
      return _calculateRandomMove(field);
  }
}