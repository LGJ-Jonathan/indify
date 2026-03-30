# Indify

Client intake management app that organizes clients by industry and extracts data automatically from Google Docs using AI.

## Features

- **Import from Google Doc** — Paste an intake form link and AI extracts all client information automatically
- **Industry filtering** — Filter clients by industry on the dashboard
- **Auto industry detection** — Automatically creates new industry categories based on the intake form content
- **Cloud database** — All data stored in Supabase, accessible from any device
- **Search** — Search clients by name, company, or industry

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Supabase (database)
- Anthropic Claude API (AI extraction)

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Configuration

1. Click the ⚙ **Settings** icon in the top right
2. Enter your Anthropic API key
3. Click **Save**

## Usage

1. Click **+ New Client**
2. Paste a Google Doc intake form link (must be shared as "Anyone with the link can view")
3. Click **✨ Extract with AI** — all fields are filled automatically
4. Click **Register Client**
5. Use the industry filter chips on the Dashboard to find clients by sector
