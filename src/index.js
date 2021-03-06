import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick} style={{color: props.winningSquare ? 'red' : 'black'}}>
        {props.value} 
      </button>
    );
    
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      let winningSquare = this.props.winnerLines?.includes(i) ? true : false;
      return (
        <Square   
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          winningSquare={winningSquare}
        />
        );
    }
  
    render() {
      const rows = [];
      for(let x=0; x<3; x++) {
        const cols = [];
        for(let y=0; y<3; y++) {
          cols.push(<span key={(x * 3) + y}>{this.renderSquare((x * 3) + y)}</span>)
        }
        rows.push(<div key={x} className="board-row">{cols}</div>);
      }
      return (
        <div>
          {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          position: null,
        }],
        stepNumber: 0,
        xIsNext: true,
        winnerLines: null    
      };
    }

    handleClick(i, moves) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.state.winnerLines = calculateWinner(squares)?.line;

      this.setState({
        history: history.concat([{
          squares: squares,
          position: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        moves: [...moves],  
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    sortMoves() {

      const reversedMoves = this.state.moves.slice().reverse();

      this.setState({
        moves: reversedMoves,
      });

    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares)?.player;

      const moves = history.map((step, index) => {
        const desc = index ?
        'Go to move #' + index + ' ' + getCoordinatas(step.position) :
        'Go to game start';

    
        return (
          <li key={index}>
            <button 
              style={this.state.stepNumber === index ? {fontWeight: 'bold'} : {fontWeight: 'normal'}} 
              onClick={() => this.jumpTo(index)}>
                {desc}
            </button>
          </li>
        );
      });
    

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else if(current.squares.filter(square => square == null).length === 0) {
        status = 'Ha habido un EMPATE!!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i, moves)}
            winnerLines={this.state.winnerLines}
            />
          </div>
          <div className="game-info">
            <div>
              <div>
                { status }
              </div>
              <button onClick={() => this.sortMoves()}>
                Sort moves
              </button>
            </div>
            <ol>{this.state.moves}</ol>
          </div>
        </div>
      );
    }
  }

  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // this.setState({winnerLines: lines[i]})
        return {player: squares[a], line: lines[i]};
      }
    }
    return null;
  }

  function getCoordinatas(position) {
    switch(position) {
      case 0:
        return '(1,1)';
      case 1:
        return '(2,1)';
      case 2:
        return '(3,1)';
      case 3:
         return '(1,2)';
      case 4:
        return '(2,2)';
      case 5:
        return '(3,2)';
      case 6:
        return '(1,3)';
      case 7:
         return '(2,3)';
      case 8:
        return '(3,3)';
    }
  }
  