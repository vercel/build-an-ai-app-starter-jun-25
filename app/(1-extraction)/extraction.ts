import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();
import fs from "fs";
import { generateText } from "ai";
import { gateway } from "@vercel/ai-sdk-gateway";

// import essay
const essay = fs.readFileSync("app/(1-extraction)/essay.txt", "utf-8");

async function main() {
  const result = await generateText({
    model: gateway("openai/gpt-4.1-nano"),
    prompt: `Extract all the names mentioned in this essay. List them separated by commas.
Essay:
${essay}`,
  });
  // Access the AI's generated text response
  console.log('\n--- AI Response ---');
  console.log(result.text);
  console.log('-------------------');
}

main().catch(console.error);
