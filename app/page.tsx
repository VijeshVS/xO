"use client";
import { useState } from "react";

export default function Home() {
  const [grid, setGrid] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState(true);
  const [win, setWin] = useState(false);
  const [winner, setWinner] = useState("");
  const [tie, setTie] = useState(false);
  const [selectingTeam,setSelectingTeam] = useState(true);
  
  function selectTeam(team: string){
    if(team != "0"){
      setTurn(false)
    }
    setSelectingTeam(false)
  }

  function checkTie(preState: string[]) {
    for (let i = 0; i < preState.length; i++) {
      if (preState[i] == "") return false;
    }

    return true;
  }

  function winnerSet(state: string) {
    setWinner(state);
    setWin(true);

    setTimeout(() => {
      setWin(false);
      setWinner("");
      setGrid(Array(9).fill(""));
    }, 4000);
  }

  function checkEqual(indices: number[], prevState: string[]) {
    let ans = true;

    for (let i = 1; i < indices.length; i++) {
      if (prevState[indices[i]] == "") return false;
      ans = ans && prevState[indices[i]] == prevState[indices[i - 1]];
    }

    return ans;
  }

  function checkWinning(prevState: string[]) {
    if (checkEqual([0, 1, 2], prevState)) {
      winnerSet(prevState[0]);
    } else if (checkEqual([3, 4, 5], prevState)) {
      winnerSet(prevState[3]);
    } else if (checkEqual([6, 7, 8], prevState)) {
      winnerSet(prevState[6]);
    } else if (checkEqual([0, 4, 8], prevState)) {
      winnerSet(prevState[0]);
    } else if (checkEqual([2, 4, 6], prevState)) {
      winnerSet(prevState[2]);
    } else if (checkEqual([0, 3, 6], prevState)) {
      winnerSet(prevState[0]);
    } else if (checkEqual([1, 4, 7], prevState)) {
      winnerSet(prevState[1]);
    } else if (checkEqual([2, 5, 8], prevState)) {
      winnerSet(prevState[2]);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="font-bold text-5xl text-green-400">Tic-tac-toe</h1>
      <div className="grid grid-cols-3 mt-6 gap-4 w-[270px]">
        {grid.map((ele, index) => {
          return (
            <div key={index}
              onClick={() => {
                if (win || tie || selectingTeam) return;

                const prevState = [...grid];
                if (prevState[index] != "") return;
                if (turn) {
                  prevState[index] = "0";
                } else {
                  prevState[index] = "X";
                }

                setGrid(prevState);
                checkWinning(prevState);
                if (checkTie(prevState)) {
                  setTie(true);

                  setTimeout(() => {
                    setGrid(Array(9).fill(""));
                    setTie(false);
                  }, 4000);
                }
                setTurn(!turn);
              }}
              className={`p-4 text-red-800 text-5xl border rounded shadow-md flex items-center justify-center h-20 w-20 bg-white hover:bg-gray-100 transition-colors duration-200 ${
                win || tie ? "cursor-default" : "cursor-pointer"
              }`}
            >
              {ele}
            </div>
          );
        })}
      </div>

        {selectingTeam? <div className="flex space-x-4 text-xl mt-6 font-bold">
          <button onClick={()=>{
            selectTeam("0")
          }} className="bg-white p-2 rounded-xl text-black">0 Team</button>
          <button onClick={()=>selectTeam("X")} className="bg-white p-2 rounded-xl text-black">X Team</button>
        </div>:<></>}
       
      {!selectingTeam?<h1 className="text-3xl font-bold mt-6 text-red-200">
        {turn ? "0's" : "X's"} turn
      </h1>:<></>}
      
      {win ? (
        <h1 className="text-3xl font-bold mt-6">{winner} is the Winner</h1>
      ) : (
        <></>
      )}
      {tie ? <h1 className="text-3xl font-bold mt-6">Its a tie</h1> : <></>}
      
    </div>
  );
}
