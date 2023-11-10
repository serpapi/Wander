import OpenAI from "openai";
import { SYSTEM_TEMPLATE } from "./prompts"

const openai = new OpenAI();

export async function getAnswer(question) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    messages: [
      { role: "system", content: SYSTEM_TEMPLATE },
      { role: "user", content: question }
    ],
  });
  
  return chatCompletion.choices[0].message.content
}