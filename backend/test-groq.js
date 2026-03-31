import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = 'llama3-8b-8192';

async function testGroq() {
  console.log('Testing Groq with key starting with:', GROQ_API_KEY ? GROQ_API_KEY.substring(0, 8) : 'MISSING');
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: "Hello" }]
      })
    });

    const status = response.status;
    const text = await response.text();
    console.log('Status:', status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Network/Node Error:', error.message);
  }
}

testGroq();
