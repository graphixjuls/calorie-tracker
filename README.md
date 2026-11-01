# CaloTrack 🥗

A sleek, lightweight calorie and macronutrient tracker built with 100% vanilla **HTML5**, **CSS3**, and **JavaScript**.

No external frameworks, no CSS variables, and no backend needed. All data persists locally in the browser via `localStorage`.

---

## ✨ Features

- **Energy & Macro Budget**:
  - Real-time tracking of calories consumed vs. daily target.
  - Dynamic progress indicator with automatic over-budget status warning.
  - Macronutrient breakdown for **Protein**, **Carbohydrates**, and **Fat**.
- **Meal Breakdown**:
  - Organized categorization into **Breakfast**, **Lunch**, **Dinner**, and **Snacks**.
  - Subtotal calorie count, item counts, and macro tags per entry.
  - One-click deletion of individual food entries.
- **⚡ Quick-Add Presets**:
  - Rapidly pre-fill the form with common whole foods (eggs, oatmeal, chicken breast, rice, avocado, Greek yogurt, etc.).
- **📅 Historical Date Navigation**:
  - Navigate effortlessly between past, present, and future dates using the calendar picker, prev/next controls, or "Today" button.
  - Each day's log is stored separately and persists indefinitely.
- **⚙️ Goal Customization & Data Management**:
  - Customize daily calorie and macro gram targets anytime.
  - Backup your data by exporting to JSON, or restore anytime via JSON import.
  - Clear individual days or perform a full factory reset.

---

## 🚀 Getting Started

No build step or dependencies required!

### Option 1: Direct File Open
Double click `index.html` or open it with any modern web browser:
```bash
# On Windows PowerShell
Start-Process index.html
```

### Option 2: Local HTTP Server (Optional)
If you prefer running via a local server:
```bash
# Python 3
python -m http.server 8000

# or Node.js npx
npx serve
```
Then visit `http://localhost:8000`.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags, accessible forms, modal dialogs.
- **CSS3**: Pure custom CSS, flexbox/grid layout, mobile responsive, zero CSS variables (`var(--...)`), zero utility frameworks.
- **JavaScript (ES6+)**: Vanilla state management, date arithmetic, modular functions, LocalStorage persistence, file import/export.

---

## 📄 License
MIT
