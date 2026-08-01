# 🧠 GyanVerse — AI Study Assistant

<div align="center">

![GyanVerse Banner](https://img.shields.io/badge/GyanVerse-AI%20Study%20Assistant-blue?style=for-the-badge&logo=google-gemini&logoColor=white)

**Transform scattered notes into organized knowledge with AI-powered learning tools**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-success?style=for-the-badge)](https://raunaksri30.github.io/gyanverse1/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-1.5%20Flash-4285F4?style=flat-square)](https://ai.google.dev/)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **Document Upload** | Upload PDF documents for AI-powered analysis |
| 💬 **AI Chat** | Ask questions about your documents and get instant answers |
| 📝 **Summarize Doc** | Get concise summaries of lengthy documents |
| 🔑 **Key Concepts** | Extract important terms and definitions automatically |
| 🧩 **Generate Quiz** | Create multiple-choice quizzes from your study material |
| 💡 **Explain for Me** | Get simple explanations of complex topics (ELI5 style) |
| 🔊 **Auto-Read** | Text-to-speech for AI responses |
| 📊 **Dashboard** | Track your study progress |
| 📅 **Schedule** | Plan your study sessions |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Gemini API Key](https://aistudio.google.com/app/apikey) (Free tier available!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raunaksri30/gyanverse1.git
   cd gyanverse1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:3000`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite 6** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **Gemini AI (1.5 Flash)** | AI/LLM Backend |
| **Web Speech API** | Text-to-Speech |

---

## 📁 Project Structure

```
gyanverse1/
├── components/
│   ├── services/
│   │   └── geminiService.ts   # AI API integration
│   ├── StudyView.tsx          # Main study interface
│   ├── ChatMessage.tsx        # Chat message component
│   ├── QuizView.tsx           # Quiz interface
│   ├── DashboardView.tsx      # Progress dashboard
│   ├── ScheduleView.tsx       # Study scheduler
│   └── LandingView.tsx        # Landing page
├── App.tsx                    # Main app component
├── index.tsx                  # Entry point
├── types.ts                   # TypeScript types
├── vite.config.ts             # Vite configuration
└── .env                       # Environment variables (create this)
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🌐 Deployment

### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your GitHub Pages branch

### Environment Variables for Production

For production deployments, set `VITE_GEMINI_API_KEY` in your build environment or CI/CD pipeline.

---

## 📊 API Information (Gemini)

This project uses Google's Gemini 1.5 Flash model. Visit [Google AI Studio](https://aistudio.google.com/) to get your free API key and view rate limits.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

**CodeVengers** — Built with ❤️ for students everywhere

---

<div align="center">

**[⬆ Back to Top](#-gyanverse--ai-study-assistant)**

</div>
