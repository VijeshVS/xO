"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async (grid: string, level: string, team: string,API_KEY:string) => {
  const genAI = new GoogleGenerativeAI(API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `${grid} This is the current 3x3 grid for a Tic-Tac-Toe game. 
  You are playing as ${team}. Choose an optimal move based on the difficulty level ${level}. 
  Select a random empty space ("") from the grid to place your marker, 
  ensuring you avoid any spaces where "X" or "O" is already placed. 
  Only return the index of the chosen empty space (i.e., where the value is ""). 
  Do not provide any extra explanations or output beyond the index.`
  
  console.log(prompt)
  const result = await model.generateContent([prompt]);

  try {
    const res = result.response.text();
    return {
      status: 200,
      res: Number.parseInt(res),
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      res: -1,
    };
  }
};
