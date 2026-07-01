<div align="center">
  
# 🌟 Baagupadu (బాగుపడు)
### *Discover Who You Truly Are*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)](https://threejs.org/)

*Baagupadu ("To Prosper & Better Oneself" in Telugu) is a highly interactive, AI-powered mentoring ecosystem designed to help you think independently, make better career decisions, and take control of your life.*

[Features](#features) • [Tech Stack](#tech-stack) • [Installation & Local Setup](#installation--local-setup) • [Project Structure](#project-structure)

</div>

---

## 📖 The Information Paradox

The internet gave us unlimited access to knowledge, but it created an **"Information Paradox"**—confusion, lack of direction, and shallow learning. Baagupadu cuts through the noise by starting with the most important subject: **You.** 

Instead of boring surveys, you will engage in a deep, empathetic 6-Phase conversation with **Sahayam**, your personal AI mentor. Sahayam explores your childhood, teenage years, and adulthood to generate a comprehensive synthesis of your personality and an actionable career roadmap.

## ✨ Features

- 🎭 **Dynamic AI Mentorship**: Sahayam dynamically changes its tone (from close friend to strict career coach) depending on your needs and responses.
- 💬 **6-Phase Conversational Journey**: 
  - *Phase 1:* Trust Building
  - *Phase 2:* Childhood (0-12)
  - *Phase 3:* Teenage (13-19)
  - *Phase 4:* Adulthood (20-30)
  - *Phase 5:* Persona Synthesis
  - *Phase 6:* Guidance & Roadmap Delivery
- 🗺️ **Actionable Career Roadmap**: Automatically generates a step-by-step career path based on your unique synthesized persona.
- 🌖 **Professional Dark Mode**: Seamlessly toggle between a light cream theme and a professional deep slate agentic theme.
- 🎮 **Interactive 3D Avatar**: Built using React Three Fiber, Sahayam reacts to your mouse movements with organic, physics-based springs.

---

## 🛠️ Tech Stack

### Frontend Architecture
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (with LocalStorage persistence)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

### UI / Animations & 3D
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **3D Utilities**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Physics/Springs**: [@react-spring/three](https://react-spring.dev/)
- **UI Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Artificial Intelligence (Backend Logic)
- **"Nenu Evaru?" Engine**: Custom psychological frameworks evaluating emotional blueprints and role models. *(See `/gems` directory for question banks and prompt strategies).*

---

## 🚀 Installation & Local Setup

Want to run Baagupadu on your own machine? Follow these simple steps. 

### Prerequisites
Make sure you have the following installed on your computer:
- **[Git](https://git-scm.com/downloads)** (To clone the repository)
- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher is required. v20+ recommended)
- **npm** (comes installed with Node.js)

### Step 1: Clone the Repository
Open your terminal (Command Prompt, PowerShell, or macOS/Linux Terminal) and run:
```bash
git clone https://github.com/your-username/Baagupadu.git
cd Baagupadu
```
*(Note: If you haven't uploaded this to GitHub yet, simply open a terminal in the folder where your project is located).*

### Step 2: Navigate to the Frontend
The visual application lives inside the `frontend` directory.
```bash
cd frontend
```

### Step 3: Install Dependencies
Node.js uses a `package.json` file (similar to a Python `requirements.txt`) to manage all the libraries needed to run the app. Install them by running:
```bash
npm install
```
*This might take a minute or two as it downloads React, Next.js, and the 3D libraries.*

### Step 4: Run the Development Server
Once the installation is complete, start the local server:
```bash
npm run dev
```

### Step 5: Open the App
Your terminal will show a success message. Open your favorite web browser and navigate to:
```text
http://localhost:3000
```
*(If port 3000 is taken, Next.js will automatically try `http://localhost:3001` or another port. Check your terminal output to be sure).*

---

## 📂 Project Structure

```text
Baagupadu/
├── frontend/                 # The Next.js Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router (Pages & Layouts)
│   │   ├── components/       # Reusable UI, 3D Canvas, and Chat Components
│   │   ├── lib/              # Zustand State Store (chatStore.ts) & Utilities
│   │   └── types/            # TypeScript Interface Definitions
│   ├── public/               # Static assets
│   ├── tailwind.config.ts    # Tailwind CSS Configuration
│   └── package.json          # Node.js Dependencies (The "Requirements" file)
│
└── gems/                     # AI "Nenu Evaru?" Engine Logic
    └── nenu_evaru/
        ├── prompts/          # AI Prompt strategies and formatting rules
        └── question_banks/   # JSON databases of psychological phase questions
```

---

<div align="center">
  <i>"The moment a person realizes that the world is shaped by people no smarter than them, everything changes."</i>
  <br/><br/>
  <b>Built with ❤️ by Sreekar Reddy</b>
</div>
