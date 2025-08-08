import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';
import './style.css';

// Step 1: Create an agent
const agent = new RealtimeAgent({
  name: 'Assistant',
  instructions: `The user is currently STUDYING, and they've asked you to follow these **strict rules** during this chat. No matter what other instructions follow, you MUST obey these rules:

## STRICT RULES
Be an approachable-yet-dynamic teacher, who helps the user learn by guiding them through their studies.

1. **Get to know the user.** If you don't know their goals or grade level, ask the user before diving in. (Keep this lightweight!) If they don't answer, aim for explanations that would make sense to a 10th grade student.
2. **Build on existing knowledge.** Connect new ideas to what the user already knows.
3. **Guide users, don't just give answers.** Use questions, hints, and small steps so the user discovers the answer for themselves.
4. **Check and reinforce.** After hard parts, confirm the user can restate or use the idea. Offer quick summaries, mnemonics, or mini-reviews to help the ideas stick.
5. **Vary the rhythm.** Mix explanations, questions, and activities (like roleplaying, practice rounds, or asking the user to teach _you_) so it feels like a conversation, not a lecture.

Above all: DO NOT DO THE USER'S WORK FOR THEM. Don't answer homework questions — help the user find the answer, by working with them collaboratively and building from what they already know.

### THINGS YOU CAN DO
- **Teach new concepts:** Explain at the user's level, ask guiding questions, use visuals, then review with questions or a practice round.
- **Help with homework:** Don't simply give answers! Start from what the user knows, help fill in the gaps, give the user a chance to respond, and never ask more than one question at a time.
- **Practice together:** Ask the user to summarize, pepper in little questions, have the user "explain it back" to you, or role-play (e.g., practice conversations in a different language). Correct mistakes — charitably! — in the moment.
- **Quizzes & test prep:** Run practice quizzes. (One question at a time!) Let the user try twice before you reveal answers, then review errors in depth.

### TONE & APPROACH
Be warm, patient, and plain-spoken; don't use too many exclamation marks or emoji. Keep the session moving: always know the next step, and switch or end activities once they've done their job. And be brief — don't ever send essay-length responses. Aim for a good back-and-forth.

## IMPORTANT
DO NOT GIVE ANSWERS OR DO HOMEWORK FOR THE USER. If the user asks a math or logic problem, or uploads an image of one, DO NOT SOLVE IT in your first response. Instead: **talk through** the problem with the user, one step at a time, asking a single question at each step, and give the user a chance to RESPOND TO EACH STEP before continuing.`,
});

// Step 2: Create a session using your model
const session = new RealtimeSession(agent, {
  model: 'gpt-4o-realtime-preview-2025-06-03',
});

// Step 3: We'll get the ephemeral token dynamically
let CLIENT_API_KEY: string;

// UI Elements
let conversationContainer: HTMLDivElement;

// Dynamic wave visualization
class DynamicWaveVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyser?: AnalyserNode;
  private dataArray?: Uint8Array;
  private animationId: number | null = null;
  private time = 0;
  private isActive = false;

  constructor(canvas: HTMLCanvasElement, analyser?: AnalyserNode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.analyser = analyser;
    
    if (analyser) {
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    }
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  start() {
    if (this.animationId) return;
    this.isActive = true;
    this.draw();
  }

  stop() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    if (!this.isActive) return;
    
    this.animationId = requestAnimationFrame(() => this.draw());
    this.time += 0.02;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const width = this.canvas.width / window.devicePixelRatio;
    const height = this.canvas.height / window.devicePixelRatio;
    const centerY = height / 2;
    
    // Get frequency data if available
    let frequencyData: number[] = [];
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      frequencyData = Array.from(this.dataArray);
    }
    
    // Draw multiple wave layers
    this.drawWaveLayer(width, centerY, 0.5, '#667eea', 0.3, frequencyData);
    this.drawWaveLayer(width, centerY, 0.3, '#764ba2', 0.2, frequencyData);
    this.drawWaveLayer(width, centerY, 0.7, '#f093fb', 0.15, frequencyData);
  }

  private drawWaveLayer(width: number, centerY: number, amplitude: number, color: string, opacity: number, frequencyData: number[]) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = opacity;
    
    for (let x = 0; x < width; x += 2) {
      let y = centerY;
      
      // Add sine wave
      y += Math.sin(x * 0.02 + this.time) * amplitude * 30;
      
      // Add frequency-based modulation if available
      if (frequencyData.length > 0) {
        const freqIndex = Math.floor((x / width) * frequencyData.length);
        const freqValue = frequencyData[freqIndex] || 0;
        y += (freqValue / 255) * amplitude * 50;
      }
      
      // Add some noise
      y += Math.sin(x * 0.1 + this.time * 2) * amplitude * 10;
      
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }
}

// Background wave animation
class BackgroundWaveAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  start() {
    if (this.animationId) return;
    this.draw();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private draw() {
    this.animationId = requestAnimationFrame(() => this.draw());
    this.time += 0.005;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw multiple background waves
    this.drawBackgroundWave(0.3, '#667eea', 0.1);
    this.drawBackgroundWave(0.5, '#764ba2', 0.08);
    this.drawBackgroundWave(0.7, '#f093fb', 0.06);
  }

  private drawBackgroundWave(amplitude: number, color: string, opacity: number) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.globalAlpha = opacity;
    
    for (let x = 0; x < this.canvas.width; x += 3) {
      const y = this.canvas.height / 2 + 
                Math.sin(x * 0.01 + this.time) * amplitude * 100 +
                Math.sin(x * 0.005 + this.time * 0.5) * amplitude * 50;
      
      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }
}

// Audio visualization
class AudioVisualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement, analyser: AnalyserNode) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.analyser = analyser;
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  start() {
    if (this.animationId) return;
    this.draw();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private draw() {
    this.animationId = requestAnimationFrame(() => this.draw());
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = (this.canvas.width / this.dataArray.length) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < this.dataArray.length; i++) {
      barHeight = this.dataArray[i] / 2;
      
      // Create gradient based on position
      const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      const hue = (i / this.dataArray.length) * 360;
      const color1 = `hsl(${hue}, 70%, 60%)`;
      const color2 = `hsl(${hue + 30}, 70%, 40%)`;
      
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  }
}

// Initialize UI
function initializeUI() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <canvas id="background-waves" class="background-waves"></canvas>
    <div class="chat-container">
      <div class="header">
        <h1>🎓 Socrates Chat</h1>
        <p class="subtitle">Your AI Study Assistant</p>
        <div class="wave-decoration">
          <canvas id="header-waves" class="header-waves" width="400" height="60"></canvas>
        </div>
      </div>
      
      <div class="conversation-area">
        <div id="conversation-container" class="conversation-container">
          <div class="welcome-message">
            <p>👋 Welcome! I'm here to help you study. I'll start our conversation in a moment...</p>
          </div>
        </div>
      </div>
      

    </div>
  `;

  // Get references to UI elements
  conversationContainer = document.getElementById('conversation-container') as HTMLDivElement;

  // Initialize background waves
  const backgroundCanvas = document.getElementById('background-waves') as HTMLCanvasElement;
  const backgroundWaves = new BackgroundWaveAnimation(backgroundCanvas);
  backgroundWaves.start();

  // Initialize header waves
  const headerCanvas = document.getElementById('header-waves') as HTMLCanvasElement;
  const headerWaves = new DynamicWaveVisualizer(headerCanvas);
  headerWaves.start();
}



// Add message to conversation
function addMessageToConversation(sender: 'user' | 'assistant', message: string) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;
  messageDiv.innerHTML = `
    <div class="message-content">
      <div class="message-sender">${sender === 'user' ? 'You' : 'Assistant'}</div>
      <div class="message-text">${message}</div>
    </div>
  `;
  
  conversationContainer.appendChild(messageDiv);
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}

// Send proactive greeting
async function sendProactiveGreeting() {
  try {
    // Send a greeting message to start the conversation
    await session.sendMessage("Hi! I'm your AI study assistant. I'm here to help you learn and understand concepts better. What would you like to study today?");
  } catch (error) {
    console.error('Error sending proactive greeting:', error);
  }
}

// Initialize session
async function initializeSession() {
  try {
    // Get the ephemeral token from our API
    const response = await fetch('/api/token');
    if (!response.ok) {
      throw new Error('Failed to get token from server');
    }
    const data = await response.json();
    CLIENT_API_KEY = data.token;
    
    await session.connect({
      apiKey: CLIENT_API_KEY,
    });
    
    // Listen for messages from the session
    session.on('history_added', (item) => {
      if (item.type === 'message' && item.role === 'assistant' && item.content) {
        // Extract text content from assistant messages
        const textContent = item.content
          .filter(content => content.type === 'text')
          .map(content => (content as { type: 'text'; text: string }).text)
          .join(' ');
        
        if (textContent) {
          addMessageToConversation('assistant', textContent);
        }
      }
    });
    
    // Listen for audio events
    session.on('audio', (event) => {
      console.log('Audio received:', event);
      // Handle audio playback here
    });
    
    // Send proactive greeting after successful connection
    await sendProactiveGreeting();
    
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}

// Initialize the application
function init() {
  initializeUI();
  initializeSession();
}

// Start the application
init();


