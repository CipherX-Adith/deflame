# 🔥 DEFLAMES — Relationship Decay & Expiry Simulator

> **A playful, satirical relationship half-life predictor that computes relationship duration, expiry dates, breakup probabilities, and grounds for inevitable separation.**

---

## ⚡ Features

- **FLAMES Easter Egg Cancellation Matrix**: Counts and cancels common letters between names to determine the baseline duration floor.
- **Multidimensional Compatibility Assessment**: Evaluates 6 key relationship dimensions ($C, T, I, F, G, K$) across 7 concise questions.
- **Fictional Decay Engine**: Deterministic non-linear decay curve computation:
  $$S = w_C C + w_T T + w_I I + w_F F + w_G G + w_K K$$
  $$d = d_{\text{base}} \cdot (1 - S)^\alpha + 0.02$$
  $$t_{\text{expiry}} = \frac{K_{\text{life}}}{d}, \quad t_{\text{final}} = 0.7 \cdot t_{\text{expiry}} + 0.3 \cdot \text{base\_duration}$$
- **Dynamic What-If Habit Patcher**: Real-time sliders allowing couples to simulate how improving communication, quality time, or finances extends their expiry date.
- **Interactive Decay Curve Chart**: Responsive SVG visualization plotting relationship health over a 48-month horizon.
- **Official Expiry Certificate**: Satirical certificate card with registry serial, official seal, and 1-click text copy or PNG image download.
- **Multi-Vector Modes**: Support for Romantic Couples, Best Friends, and Startup Co-Founders.
- **100% Responsive & Dark Mode**: Mobile, tablet, and desktop optimized.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS (v4), Lucide React, Canvas Confetti, HTML-to-Image.
- **Backend**: Node.js, Express, CORS.
- **Testing**: Built-in Node Test Runner (`node --test`).

---

## 🚀 Quick Start (Local Run)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/deflames.git
cd deflames

# Install dependencies for both server & client
npm run install:all
```

### 2. Run Development Mode (Frontend + Backend)

```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

### 3. Run Production Build

```bash
# Build React client into dist/
npm run build

# Start Express server (serves API & static frontend on port 5000)
npm start
```
Open `http://localhost:5000` in your browser.

### 4. Run Automated Unit Tests

```bash
npm test
```

---

## 📱 Running on Termux (Android)

DEFLAMES runs out-of-the-box in Termux on Android devices:

```bash
# 1. Update packages and install Node.js + Git
pkg update -y
pkg install -y nodejs git

# 2. Clone and enter repo
git clone https://github.com/your-username/deflames.git
cd deflames

# 3. Install packages
npm run install:all

# 4. Build and run production server
npm run build
npm start
```
Open `http://localhost:5000` in Chrome/Firefox on your phone!

---

## 🌐 API Specification

### `POST /api/deflames`

#### Request Body
```json
{
  "name1": "Alice",
  "name2": "Bob",
  "mode": "relationship",
  "answers": {
    "argue_frequency": "Sometimes",
    "communication_style": "Mostly open",
    "time_together": "5–10 hours",
    "goals_similarity": "Mostly similar",
    "financial_compatibility": "Somewhat different",
    "interests_overlap": "Medium",
    "conflict_handling": "We argue but reconcile"
  }
}
```

#### Response Body
```json
{
  "name1": "Alice",
  "name2": "Bob",
  "mode": "relationship",
  "duration_months": 24,
  "duration_days": 11,
  "lifespan_text": "24 months 11 days",
  "expiry_date": "2028-09-24",
  "expiry_formatted": "24 September 2028",
  "breakup_probability": 0.27,
  "breakup_percentage": "27%",
  "primary_reason": "Financial stress and incompatible spending habits compounded by emotional distance from limited quality time.",
  "secondary_factors": [
    "Unsynchronized grocery budgets and impulsive Amazon orders",
    "Parallel scrolling on TikTok instead of connecting"
  ],
  "dimensions": {
    "C": 0.75,
    "T": 0.6,
    "I": 0.65,
    "F": 0.5,
    "G": 0.8,
    "K": 0.7
  },
  "decay_curve": [
    { "month": 0, "health": 78 },
    { "month": 2, "health": 72 },
    { "month": 4, "health": 66 }
  ],
  "debug": {
    "n_remaining_letters": 8,
    "base_duration_months": 9,
    "stability_index": 0.685,
    "decay_rate": 0.03875
  }
}
```

---

## ⚠️ Disclaimer

DEFLAMES is a satirical game created solely for humor and entertainment. All decay constants, breakup probabilities, and expiration dates are completely fictional and must not be used as genuine relationship or psychological counsel.
