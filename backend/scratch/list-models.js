require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Using API Key:', apiKey ? apiKey.substring(0, 15) + '...' : 'NOT SET');
  
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      console.error('Error:', data.error.message);
      return;
    }
    console.log('\nAvailable models that support generateContent:');
    (data.models || []).forEach(m => {
      if (m.supportedGenerationMethods?.includes('generateContent')) {
        console.log(' -', m.name);
      }
    });
  } catch (err) {
    console.error('Request failed:', err.message);
  }
}

listModels();
