import { GoogleGenerativeAI } from "@google/generative-ai"
const genAI = new GoogleGenerativeAI("API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askGemini = async (grid:string,level:string,team:string) => {

  const prompt = `${grid}
    This is a 3x3 , 3 rows is in one row -> tic-tac-toe board. You are ${team}. 
    Choose an empty space from the grid at ${level} level, 
    meaning you can select any available space randomly. Available space is empty string. 
    Just give the index you select with no content and explanation.
   `;
   const result = await model.generateContent([prompt]);
   

   try {
    const res = result.response.text()

    return {
        status: 200,
        res:Number.parseInt(res)
    }
   }
   catch(e){
    console.log(e)
    return {
        status : 500,
        res: -1
    }
   }
};
