import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env' });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in .env file');
  process.exit(1);
}

const app = express();
const PORT = 3000;

// Create Vite server in middleware mode
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

// API endpoint to get ephemeral token
app.get('/api/token', async (req, res) => {
  try {
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2025-06-03',
        client_secret: {
          expires_after: {
            anchor: 'created_at',
            seconds: 3600
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Log the full response to see what information is available
    console.log('Full API response:', JSON.stringify(data, null, 2));
    
    if (data.client_secret?.value) {
      res.json({ 
        token: data.client_secret.value,
        expires_at: data.client_secret.expires_at,
        created_at: data.client_secret.created_at,
        full_response: data // Include full response for debugging
      });
    } else {
      throw new Error('No client_secret found in response');
    }
  } catch (error) {
    console.error('Error getting ephemeral token:', error);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

// Use vite's connect instance as middleware (after API routes)
app.use(vite.middlewares);

app.listen(PORT, () => {
  console.log(`🚀 Development server running at http://localhost:${PORT}`);
  console.log('📝 Make sure you have OPENAI_API_KEY in your .env file');
});
