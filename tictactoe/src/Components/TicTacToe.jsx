import { useState ,useEffect} from "react";
import Board from "./Board";
import GameState from "./GameState";
import GameOver from "./GameOver";
import Reset from "./Reset";
import gameOverSound from '../sounds/game_over.wav';
import clickSound from '../sounds/click.wav';
import Login from "./login";
import { GiTicTacToe } from "react-icons/gi";


//Sound Setting
const gameOversound=new Audio(gameOverSound);
gameOversound.volume=.2;
const click=new Audio(clickSound);
click.volume=.5;


//Display palyers
let player_x='';
const palyer_o='O';




// Minimax algorithm to determine the best move for the computer
const minimax = (newTiles, depth, isMaximizing) => {
  const winner = getWinner(newTiles);

  if (winner === player_x) return { score: -10 + depth };
  if (winner === palyer_o) return { score: 10 - depth };
  if (newTiles.every(tile => tile !== null)) return { score: 0 };

  if (isMaximizing) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < newTiles.length; i++) {
      if (newTiles[i] === null) {
        newTiles[i] = palyer_o;
        let score = minimax(newTiles, depth + 1, false).score;
        newTiles[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return { score: bestScore, move };
  } else {
    let bestScore = Infinity;
    let move;
    for (let i = 0; i < newTiles.length; i++) {
      if (newTiles[i] === null) {
        newTiles[i] = player_x;
        let score = minimax(newTiles, depth + 1, true).score;
        newTiles[i] = null;
        if (score < bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return { score: bestScore, move };
  }
};

const getWinner = (tiles) => {
  for (const { combo } of winningTiles) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      return tiles[a];
    }
  }
  return null;
};
//To make Ai make some random moves to make mistake
const getRandomMove = (tiles) => {
  const availableMoves = tiles.map((tile, index) => tile === null ? index : null).filter(index => index !== null);
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};



//rows,cols and diagonals 
const winningTiles=[

  //Row
  {combo:  [0,1,2] ,strikeClass :"strike-row-1"},
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  //Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" }

];


//Check winners
const checkWinner=(tiles,setStrikeClass,setGameState,player_x)=>{
  for (const { combo, strikeClass } of winningTiles) {
    const [a, b, c] = combo;
    if (tiles[a] && tiles[a] === tiles[b] && tiles[a] === tiles[c]) {
      setStrikeClass(strikeClass);
      setGameState(tiles[a] === player_x ? GameState.playerXwins : GameState.playerOwins);
      return true;
    }
  }
  if (tiles.every(tile => tile !== null)) {
    setGameState(GameState.draw);
  }
  return false;
};




const TicTacToe
 = () => {
    const[tiles,setTiles]=useState(Array(9).fill(null))
    const[player_x,setPlayerx]=useState(null);
    const[playerTurn,setPlayerTurn]=useState(player_x);
    const[strikeClass,setStrikeClass]=useState();
    const[gameState,setGameState]=useState(GameState.inProgress);
    const [userName, setUserName] = useState(null);
    const[password,setPassword]=useState(null);
    

    

  

    //Handling tile click
    const onTileClickHandler=(index)=>{

        if(gameState !== GameState.inProgress){
          return;
        }

        if(tiles[index] !== null || checkWinner(tiles, setStrikeClass)){
            return ;
        }
        
        const newTiles=[...tiles];
        newTiles[index]=playerTurn;
        setTiles(newTiles);
        
        if(playerTurn===player_x){
            setPlayerTurn(palyer_o)
        }
        else{
            setPlayerTurn(player_x)
        }
   
    }


  //Handling Reset Button 
  const handleReset=()=>{
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(player_x);
    setStrikeClass(null);
  }
  
    
   //Check for the winner
    useEffect(() => {
      checkWinner(tiles, setStrikeClass, setGameState,player_x);
      if (gameState === GameState.inProgress && playerTurn === palyer_o) {
        const shouldMakeOptimalMove = Math.random() > 0.3; // 70% chance to make the optimal move
        const bestMove = shouldMakeOptimalMove ? minimax(tiles, 0, true).move : getRandomMove(tiles);
        if (bestMove !== undefined) {
          const newTiles = [...tiles];
          newTiles[bestMove] = palyer_o;
          setTiles(newTiles);
          setPlayerTurn(player_x);
        }
      }
    }, [tiles, playerTurn]);

  
  //useEffect for click sound
  useEffect(()=>{
    if(tiles.some((tile)=>tile !== null)){
      click.play();
    }
  },[tiles])
  
  //useEffect for game over sound

  useEffect(()=>{
    if(gameState !== GameState.inProgress){
      gameOversound.play();
    }

  })




//Handle login process
const handleLogin = (name,password) => {
  setUserName(name);
  setPassword(password);
  setPlayerx(name[0].toUpperCase());
};

if (!userName && !password) {
  return <Login onLogin={handleLogin} />;
}

return (
  <div className="mainPage">
    <h2>Welcome, {userName} !</h2>
    <GiTicTacToe className="gameIcon" />

    <h1>Tic Tac Toe</h1>
    
    <Board strikeClass={strikeClass} playerTurn={playerTurn} tiles={tiles} onTileClick={onTileClickHandler} />
    <GameOver gameState={gameState} name={userName} />
    <Reset gameState={gameState} onReset={handleReset} />
  </div>

    );
}
 
export default TicTacToe
;