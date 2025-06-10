# 🛑 Black List Manager

A minimal desktop utility built with [Node.js](https://nodejs.org/) and [Electron](https://www.electronjs.org/) for managing user blacklists — originally designed to make it easier to store and annotate Discord user bans with context.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-2c2c2c?style=for-the-badge&logo=electron&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)

---

## ✨ About the Project

**Black List** allows you to maintain a list of blacklisted users, particularly useful for moderation or community management.

Each user entry contains:

- **Discord ID** — unique user identifier
- **Name** — Discord username or nickname
- **Comment** — short note or description
- **Reason** — why the user was blacklisted

---

## 📦 Features

- Add and remove users with descriptions
- Fast, minimal local database
- Electron-powered GUI
- Simple and focused on Discord moderation

---

## 📁 Project Structure

```
📦 black-list/
 ┣ 📜 main.js
 ┣ 📜 preload.js
 ┣ 📜 render.js
 ┣ 📜 index.html
 ┣ 📂 assets/
 ┃ ┗ 📂 icons/
 ┃    ┗ 📜 favicon.ico
 ┗ 📜 package.json
```

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/aket0r/black-list
   cd black-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

---

## 🛠 Built With

- [Electron](https://www.electronjs.org/) — for desktop GUI
- [Node.js](https://nodejs.org/) — backend logic
- Vanilla JavaScript, HTML & CSS

---

## 📜 License

MIT © [aket0r](https://github.com/aket0r)
