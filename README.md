# 🎓 Socrates Chat - Voice Study Assistant

A voice-enabled AI chat application designed to help students learn through interactive conversations. The app uses OpenAI's real-time agents to provide a dynamic study experience.

## 📋 Prerequisites

Before you begin, you'll need to install some software on your computer:

### 1. Install Node.js
**What is Node.js?** It's a program that allows you to run JavaScript applications on your computer.

**How to install:**
- Go to [nodejs.org](https://nodejs.org)
- Download the "LTS" version (recommended for most users)
- Run the installer and follow the installation wizard
- **Important:** Make sure to check the box that says "Automatically install the necessary tools" during installation

**To verify installation:** Open your terminal/command prompt and type:
```bash
node --version
npm --version
```
You should see version numbers displayed. If you see "command not found" errors, restart your computer and try again.

### 2. Get an OpenAI API Key
**What is an API key?** It's like a password that allows the app to use OpenAI's AI services.

**How to get one:**
- Go to [platform.openai.com](https://platform.openai.com)
- Sign up for an account (or log in if you already have one)
- Go to "API Keys" in the left sidebar
- Click "Create new secret key"
- Give it a name (like "Socrates Chat")
- Copy the key (it starts with "sk-") and save it somewhere safe
- **Important:** You'll only see this key once, so make sure to copy it!

## 🚀 Installation & Setup

### Step 1: Download and Navigate to Project
1. Download the project files to your computer
2. Open your terminal/command prompt
3. Navigate to the project folder:
   ```bash
   cd path/to/QueryMind
   ```
   (Replace "path/to/QueryMind" with the actual path where you saved the files)

### Step 2: Install Dependencies
The app needs some additional software packages to work. Run these commands in your terminal:

```bash
# Install main project dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

**What this does:** This downloads all the necessary software packages that the app needs to run.

### Step 3: Verify Installation
Check that everything installed correctly:
```bash
# Check Node.js version
node --version

# Check npm version  
npm --version

# List installed packages
npm list --depth=0
```

### Step 4: Set Up Your API Key
1. In the main project folder, create a new file called `.env`
2. Open the `.env` file in any text editor (like Notepad, TextEdit, or VS Code)
3. Add your OpenAI API key to the file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   (Replace "your_api_key_here" with the actual API key you copied from OpenAI)

**Example:**
```
OPENAI_API_KEY=your-api-key
```

**Important:** 
- Don't include quotes around the API key
- Don't add any extra spaces
- Make sure the file is named exactly `.env` (with the dot at the beginning)

**Alternative: Create .env file via terminal:**
```bash
# On macOS/Linux:
echo "OPENAI_API_KEY=your_api_key_here" > .env

# On Windows:
echo OPENAI_API_KEY=your_api_key_here > .env
```
(Replace "your_api_key_here" with your actual API key)

### Step 5: Launch the Application
1. In your terminal, make sure you're in the main project folder
2. Run the development server:
   ```bash
   npm run dev
   ```

3. Wait for the server to start. You should see messages like:
   ```
   🚀 Development server running at http://localhost:3000
   📝 Make sure you have OPENAI_API_KEY in your .env file
   ```

4. Open your web browser and go to: `http://localhost:3000`

**To stop the server:** Press `Ctrl+C` in the terminal

## 🎯 Using the App

### First Time Setup
1. When you first open the app, you'll see a welcome message
2. The app will automatically connect to the AI assistant
3. You should see a greeting message from the AI

### How to Use Voice Chat
1. **Allow microphone access:** When prompted, click "Allow" to let the app use your microphone
2. **Start talking:** The AI will respond to your voice
3. **Ask questions:** You can ask about any subject you're studying
4. **Get help:** The AI will guide you through problems step-by-step

### Features
- **Voice interaction:** Talk naturally with the AI
- **Study assistance:** Get help with homework, concepts, and test prep
- **Guided learning:** The AI won't just give answers - it will help you understand
- **Visual feedback:** See beautiful wave animations that respond to your voice

## 🔧 Troubleshooting

### Common Issues

**"Missing OPENAI_API_KEY" error:**
- Make sure you created the `.env` file in the main project folder
- Check that your API key is correct and complete
- Restart the server after making changes

**"Command not found" errors:**
- Make sure Node.js is installed correctly
- Try restarting your computer
- Reinstall Node.js if needed

**"Port 3000 is already in use" error:**
- Close other applications that might be using port 3000
- Or change the port in `dev-server.js` (line 23) to a different number like 3001
- Or kill the process using the port:
  ```bash
  # Find what's using port 3000
  lsof -ti:3000
  
  # Kill the process (replace PID with the actual process ID)
  kill -9 PID
  ```

**Microphone not working:**
- Check your browser's microphone permissions
- Make sure your microphone is connected and working
- Try refreshing the page

**App won't load:**
- Check that the server is running (you should see the success messages)
- Make sure you're going to the correct URL: `http://localhost:3000`
- Check your internet connection

### Getting Help
If you're still having issues:
1. Check that all the steps above were completed correctly
2. Make sure your OpenAI API key is valid and has credits
3. Try restarting the server and your browser
4. Check the terminal for any error messages

**Useful terminal commands for debugging:**
```bash
# Check if the server is running
ps aux | grep node

# Check what's listening on port 3000
netstat -an | grep 3000

# View server logs in real-time
tail -f logs/app.log  # (if logging is enabled)

# Test API key validity
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.openai.com/v1/models
```

## 📚 What the App Does

This app is designed to be a study assistant that:
- **Helps you learn:** Instead of just giving answers, it guides you to understand concepts
- **Adapts to your level:** It asks about your grade level and adjusts explanations accordingly
- **Builds on what you know:** It connects new ideas to things you already understand
- **Provides practice:** It can quiz you, role-play scenarios, and help you practice skills
- **Stays focused:** It keeps sessions moving and doesn't overwhelm you with long explanations

## 🔒 Privacy & Security

- Your conversations are processed by OpenAI's servers
- Voice data is used only for the conversation and is not stored permanently
- Your API key should be kept private and not shared with others
- The app runs locally on your computer, so your data doesn't go through additional servers

## 🛠️ Technical Details (For Advanced Users)

- **Frontend:** Built with TypeScript, Vite, and HTML5 Canvas for visualizations
- **Backend:** Express.js server with OpenAI Realtime API integration
- **Audio:** Web Audio API for real-time voice processing
- **Visualization:** Custom wave animations that respond to audio input

---

**Happy studying! 🎓**

If you have any questions or run into issues, check the troubleshooting section above or refer to the project documentation.
