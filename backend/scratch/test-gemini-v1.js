
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testV1() {
  // Try to force v1 version if possible, but the library usually handles it.
  // In newer versions, we can pass version in options.
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Note: The library might not expose API version easily in this way.
  // But let's try a model that is definitely in v1.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const result = await model.generateContent("test");
    console.log("Success with v1/gemini-1.5-flash");
  } catch (e) {
    console.error("Failed:", e.message);
  }
}

testV1();
