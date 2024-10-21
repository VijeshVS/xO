"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async (grid: string, level: string, team: string,API_KEY:string) => {
  const genAI = new GoogleGenerativeAI(API_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `${grid} 
You are ${team} in a 3x3 Tic-Tac-Toe game. Choose a random empty space ("") from the grid at ${level} level. 
Do not select any space where "X" is present. Give only the chosen index.
Don't give any extra explanations or content`;
  
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
