import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env file');
  process.exit(1);
}

async function getEphemeralToken() {
  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview-2025-06-03',
    }),
  });

  const data = await response.json();
  console.log('Ephemeral client key:', data.client_secret?.value || data);
}

getEphemeralToken();

