# GDG – Retro Cyber Challenge(Project Retro_Lock) 🔐🎮

## 🚀 Overview

This is a **terminal-style puzzle game** built as challenged by **Google Developer Groups**.  
The game runs in a simulated terminal(like 1990's) inside the browser, where players need to solve challenges and unlock a **secret key page** 🎉.

---

## 🏗️ Project Architecture

The project is divided into **client**(Frontend) and **server**(Backend):

---

## ⚡ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express.js
- **Hosting**: Vercel (client) & Render/Heroku (server)

---

## 🔑 Secret Key Flow

<details>
<summary>Click to view explanation</summary>

1. The user runs the app and gets a **terminal-like interface**.
2. User need to find correct login credentials and how to get login page.
3. When correct credentials entered, they are redirected to a puzzle.
4. Once solved, they are redirected to a **secret page**.
5. The secret page displays a **glitch animation with the unlocked key**.

</details>

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Sahasra-iiits/GDG---Retro-Cyber-Challenge-PROJECT-RETRO_LOCK-.git
cd gdg-project

2️⃣ Install Dependencies

Client
cd client
npm install
npm run dev

Server
cd server
npm install
npm start

🌐 Deployment

Client (React): Vercel Link

Server (Node/Express): Heroku/Render Link


🎨 Features

Terminal-style UI
Puzzle solving (Drag and Drop Puzzle)
Secret page with glitch + ASCII art animations
Clean separation of frontend & backend


🔮 Future Enhancements

Add a timer for puzzle completion
Add some more animations to make it attractive

👩‍💻 Contributor

[G. SAHASRA]
```
