import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

  function Square (props){    
    return (
      <button 
        className="square" 
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
          key={i}
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {  
      const boardSize = 3;
      let squares = [];
      for (let i =  0 ; i < boardSize; i++) {
        let rows = [];
        for (let j = 0; j < boardSize; j++) {
          rows.push(this.renderSquare(i*boardSize + j));
        }
        squares.push(<div key={i} className="board-rows">{rows}</div>);
      }

      return (
        <div>{squares}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          movimientos: Array(9).fill(null),      
        }],
        xIsNext: true,
        stepNumber: 0,   
        isDescendingOrder: true     
      }
    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = [...current.squares];
      const movimientos = [...current.movimientos];
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext? 'X': 'O';
      movimientos[this.state.stepNumber] = i;
      this.setState({
        history: history.concat([{
          squares: squares,
          movimientos: movimientos
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    handleSortToggle(){
      this.setState({
        isDescendingOrder: !this.state.isDescendingOrder
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ? 
          'Go to move #' + move + ' ' + getCoordinates(step.movimientos[move-1]):
          'Go to game start';
        return (
          <li key={move}>            
            <button className={move === this.state.stepNumber ? 'move-list-item-selected' : ''}
              onClick={() => this.jumpTo(move)}>
              {desc}
            </button>
          </li>
        )
      });

      if(!this.state.isDescendingOrder){
        moves.reverse();
      }

      let status;
      if(winner){
        status = 'Winner: ' + winner;
      }else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }  
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick = {() => this.handleSortToggle()}>
              {this.state.isDescendingOrder ? 'Descending' : 'Ascending'}
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  

  function getCoordinates(position){
    const coordinates = [
      "(0,0)", "(1,0)", "(2,0)",
      "(0,1)", "(1,1)", "(2,1)",
      "(0,2)", "(1,2)", "(2,2)",
    ]
    return coordinates[position];
  }

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
        return squares[a];
      }
    }
    return null;
  }