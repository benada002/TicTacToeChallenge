import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import Field, {FieldBox} from './components/Field';

import {checkForWinner, calculateMove, getOtherPlayer} from './lib/gameLogic';

import './App.css';

function App() {
  const [opponentIsComputer, setOpponentIsComputer] = useState(false);
  const [computerSymbol, setComputerSymbol] = useState<'X'|'O'>('O');
  const [computerBeginns, setComputerBeginns] = useState(false);
  const [computerStrength, setComputerStrength] = useState<1|2|3>(1);
  const [currentPlayer, setCurrentPlayer] = useState<'X'|'O'>('X')
  const [fieldValues, setFieldValues] = useState<('X'|'O'|null)[]>(Array(9).fill(null));
  const [gameRuns, setGameRuns] = useState(false);
  const [finishMessage, setFinishMessage] = useState<any>(null);

  const makeMove = useCallback((index: number|void) => {
    if(typeof index !== 'number' || !!fieldValues[index]) return;
    fieldValues[index] = currentPlayer;
    setFieldValues([...fieldValues]);
  }, [fieldValues, currentPlayer])

  // Handle Game End
  useEffect(() => {
    const hasMessage = checkForWinner(fieldValues, getOtherPlayer(currentPlayer));

    if(!!hasMessage && !finishMessage){
      setFinishMessage(hasMessage);
      setGameRuns(false);
    }
    // eslint-disable-next-line
  }, [fieldValues]);

  // Handle Computer Move
  useEffect(() => {
    if(
      !checkForWinner(fieldValues, getOtherPlayer(currentPlayer)) &&
      gameRuns &&
      opponentIsComputer &&
      currentPlayer === computerSymbol
    ){
      makeMove(calculateMove(fieldValues, computerStrength, computerSymbol));
      setCurrentPlayer(prevState => getOtherPlayer(prevState));
    }
    // eslint-disable-next-line
  }, [currentPlayer, gameRuns]);

  // Click Handler
  const onFieldBoxClick = (index: number) => {
    makeMove(index);
    setCurrentPlayer(prevState => getOtherPlayer(prevState));
  };

  const onClickGameStart = () => {
    setComputerSymbol(opponentIsComputer && computerBeginns ? 'X' : 'O');
    setCurrentPlayer('X');
    setFieldValues(Array(9).fill(null));
    setFinishMessage(null);
    setGameRuns(true);
  };

  const onClickOpenSettingsAfterGame = () => {
    setFinishMessage(null);
  };

  // Change Handler
  const onChangeAgainstComputer = () => {
    setOpponentIsComputer(prev => !prev)
  };

  const onChangeComputerBeginns = () => {
    setComputerBeginns(prev => !prev)
  };

  const onChangeStrength = (event: ChangeEvent<HTMLSelectElement>) => {
    const strength = parseInt(event.target.value)
    if(strength < 1 || strength > 3) return;

    // @ts-ignore
    setComputerStrength(strength);
  };

  return (
    <div className="App">
      {!gameRuns && !finishMessage &&
        <div>
          I want to play against the computer. <input
            type="checkbox"
            name="againstComputer"
            id="againstComputer"
            checked={opponentIsComputer}
            onChange={onChangeAgainstComputer}
          />
          {opponentIsComputer &&
            <>
              The computer should beginn. <input
                type="checkbox"
                name="computerBeginns"
                id="computerBeginns"
                checked={computerBeginns}
                onChange={onChangeComputerBeginns}
              />
              <select name="strength" id="strength" value={computerStrength} onChange={onChangeStrength}>
                {
                  Array(3)
                    .fill(null)
                    .map((ele, i) => <option key={i+1} value={i+1}>{i+1}</option>)
                }
              </select>
            </>
          }
          <button type="button" onClick={onClickGameStart}>Play</button>
        </div>
      }
      {!!finishMessage &&
        <>
          <h1>{finishMessage}</h1>
          <button type="button" onClick={onClickGameStart}>Play again with same settings</button>
          <button type="button" onClick={onClickOpenSettingsAfterGame}>Change settings and play again</button>
        </>
      }
      {gameRuns &&
        <h1>It's your turn Player {currentPlayer}</h1>
      }
      {(gameRuns || finishMessage) &&
          <Field>
            {
              fieldValues.map((symbol, i) => <FieldBox symbol={symbol} key={i} onClick={() => onFieldBoxClick(i)}/>)
            }
          </Field>
      }
    </div>
  );
}

export default App;
