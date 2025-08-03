<p align="center">
  <img width="1280" height="720" alt="Arnold AI" src="public\arnold.png" />
</p>

<h1 align="center">Arnold AI</h1>

<p align="center">
  <a href="https://arnold-ai.vercel.app/" target="_blank"><strong>🏋️‍♂️ VISIT THE DEMO</strong></a>
</p>

<p align="center">
  <strong>Train smarter. Arnold AI is your fully interactive fitness assistant — combining a 3D muscle selector, Gemini-powered form feedback, and Google Calendar planning into one sleek web app.</strong>
</p>

<p align="center">

  <!-- Deployed on Vercel -->
  <a href="https://vercel.com/ahmedjader/arnold-ai">
    <img src="https://img.shields.io/badge/Hosted%20on-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel Badge">
  </a>

  <!-- Gemini AI -->
  <a href="#">
    <img src="https://img.shields.io/badge/Gemini-LLM-blueviolet?style=for-the-badge&logo=google" alt="Gemini">
  </a>

  <!-- Google Calendar Integration -->
  <a href="#">
    <img src="https://img.shields.io/badge/Google%20Calendar-Integrated-34A853?style=for-the-badge&logo=googlecalendar" alt="Google Calendar">
  </a>

</p>

---

## 💪 Arnold AI – Intelligent Workout Planning

Arnold AI gives you the power to plan, visualize, and execute your fitness goals using real-time AI feedback and Google Calendar scheduling. Forget static routines. This is **adaptive**, **interactive**, and **AI-enhanced** fitness.

### 🔥 Features

- 🎯 **3D Muscle Selector** — Clickable, animated muscle map powered by Three.js.
- 🧠 **Gemini LLM Coaching** — Get real-time form tips and technique breakdowns via natural language streaming.
- 📅 **Google Calendar Integration** — Automatically generate recurring workouts across a 4-week plan.
- 🔊 **Text-to-Speech (TTS) Form Feedback** — Generate and play audio cue cards dynamically.
- 📤 **Exportable Plans** — One-click export of your full workout blueprint.

---

## ⚙️ How It Works

- `@react-three/fiber` powers a fully interactive 3D body.
- User-selected muscles are stored and linked to curated workouts.
- Gemini generates detailed form tips per workout.
- Google Calendar API creates recurring, personalized workout events.
- TTS API converts tips to playable audio.
- Everything deploys cleanly via Vercel serverless infra.

---

## 🚀 Tech Stack

| Tech               | Usage                                      |
|--------------------|---------------------------------------------|
| **Next.js 14**     | App framework (App Router, server actions) |
| **TailwindCSS v4** | Full dark theme + responsive design        |
| **Three.js**       | 3D model rendering via React Fiber          |
| **Google APIs**    | Calendar + OAuth + TTS                     |
| **OpenAI / Gemini**| Form feedback + summarization              |
| **Vercel AI SDK**  | Streaming LLM integration                  |

---

## 🧪 Getting Started

1. Clone this repo:  
   ```bash
   git clone https://github.com/ahmedjader/arnold-ai
