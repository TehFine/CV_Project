
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testModel(modelName) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: modelName });
  try {
    const result = await model.generateContent("test");
    console.log(`Success with ${modelName}`);
    return true;
  } catch (e) {
    console.error(`Failed with ${modelName}:`, e.message);
    return false;
  }
}

async function main() {
  const models = ["gemini-pro", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
  for (const m of models) {
    if (await testModel(m)) break;
  }
}

main();
