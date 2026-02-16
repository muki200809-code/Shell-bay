# 🐚 Shell Bay - AI-Powered App Builder

![Shell Bay](https://img.shields.io/badge/Shell%20Bay-v1.0.0-00D9FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

A modern, state-of-the-art AI-powered app builder where users can generate full-stack web applications using natural language. Built with React, TypeScript, Tailwind CSS, and powered by Google Gemini AI.

## ✨ Features

- 🎨 **State-of-the-Art 2026 UI/UX** - Clean, minimalist design with glassmorphism and subtle gradients
- 🤖 **AI-Powered Code Generation** - Generate complete React apps using natural language
- 👀 **Live Preview** - See your app come to life in real-time
- 📱 **Responsive Preview** - Test your apps on Desktop, Tablet, and Mobile views
- 💾 **Project Management** - Save and manage multiple projects
- 🔒 **Secure Authentication** - Google OAuth and Email/Password auth via Supabase
- 🎯 **Multiple AI Providers** - Support for Gemini (default/free), OpenAI, and Anthropic
- 💻 **Code View** - View, copy, and download generated code
- 🚀 **Deploy Ready** - (Coming soon) One-click deployment to cloud

## 🛠 Tech Stack

### Frontend
- **React 18.3** - Modern React with Hooks
- **TypeScript 5.2** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **React Router 6** - Client-side routing
- **Framer Motion** - Smooth animations

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **shadcn/ui style** - High-quality component patterns

### Backend & Services
- **Supabase** - Authentication and backend services
- **Google Gemini 1.5 Flash** - Default AI provider (free)
- **Zustand** - Lightweight state management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier works)
- Google AI Studio API key (free to obtain)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shell-bay.git
   cd shell-bay
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - In your project settings, find your Project URL and anon/public API key
   - Enable Google OAuth in Authentication > Providers (optional but recommended)

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Get your free Google AI Studio API key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Click "Create API Key"
   - Copy your API key (you'll enter this in the app's Settings later)

6. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Sign up/Sign in
   - Go to Settings (gear icon) and paste your Google AI Studio API key
   - Start building! 🎉

## 📖 Usage

### Creating Your First Project

1. After signing in, click the **"New Project"** button
2. You'll be taken to the Builder workspace
3. In the chat interface (left pane), describe what you want to build:
   ```
   "Create a beautiful todo app with local storage, 
   a gradient background, and smooth animations"
   ```
4. Watch as the AI generates your app in real-time!
5. Toggle between Preview and Code view using the eye/code icon
6. Test responsive layouts using the device toggle (Desktop/Tablet/Mobile)

### Configuring AI Providers

Shell Bay supports multiple AI providers:

- **Gemini 1.5 Flash (Default)** - Free, fast, and powerful. Requires your own Google AI Studio API key.
- **OpenAI** - Bring your own OpenAI API key to use GPT models
- **Anthropic Claude** - Bring your own Anthropic API key to use Claude models

To configure:
1. Click the Settings icon (gear) in the top right
2. Select your preferred AI provider
3. Enter your API key
4. Click "Save Settings"

> 💡 **Tip**: Your API keys are stored locally in your browser and never sent to our servers!

## 🎨 Design Philosophy

Shell Bay follows **2026 state-of-the-art design principles**:

- **Dark Mode First** - Optimized for long coding sessions
- **Glassmorphism** - Subtle transparency and backdrop blur effects
- **Micro-interactions** - Smooth hover effects, focus rings, and transitions
- **Minimalist** - Clean, uncluttered interface inspired by Vercel, Linear, and Lovable
- **Cyan/Ocean Blue Branding** - Modern color palette with gradient accents
- **Professional Typography** - Inter/Geist Sans for readability

## 📁 Project Structure

```
shell-bay/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui style primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── avatar.tsx
│   │   ├── AuthPage.tsx           # Authentication screen
│   │   ├── Dashboard.tsx          # Main dashboard with projects
│   │   ├── SettingsModal.tsx      # AI provider settings
│   │   └── Builder/
│   │       ├── Workspace.tsx      # Main builder interface
│   │       ├── ChatPane.tsx       # AI chat interface
│   │       ├── PreviewPane.tsx    # Live app preview
│   │       └── CodeView.tsx       # Syntax-highlighted code view
│   ├── lib/
│   │   ├── supabaseClient.ts      # Supabase configuration
│   │   ├── utils.ts               # Utility functions
│   │   └── ai/
│   │       └── geminiService.ts   # Google Gemini AI service
│   ├── store/
│   │   └── useAppStore.ts         # Zustand state management
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # App entry point
│   └── index.css                  # Global styles
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🔐 Security

- **API Keys**: All API keys are stored locally in `localStorage` and never transmitted to Shell Bay servers
- **Authentication**: Handled securely by Supabase with industry-standard OAuth 2.0
- **Data Privacy**: Your projects are stored in your browser's local storage

## 🚧 Roadmap

- [ ] Deploy to Vercel/Netlify with one click
- [ ] Export projects as GitHub repositories
- [ ] Collaborative editing (multiplayer mode)
- [ ] Template marketplace
- [ ] AI model fine-tuning for better code generation
- [ ] Integrated testing and debugging tools
- [ ] Component library integration
- [ ] Version control for projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Backend by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

## 💬 Support

Need help? Have questions?

- 📧 Email: support@shellbay.app
- 🐦 Twitter: [@shellbayapp](https://twitter.com/shellbayapp)
- 💬 Discord: [Join our community](https://discord.gg/shellbay)

---

Made with ❤️ by the Shell Bay Team

**Happy Building! 🚀**
