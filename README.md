# SchemaViz - ER Diagram Generator

Hey! This is a simple tool I built that turns your GitHub repos into ER diagrams automatically. Just paste a repo URL, and it'll analyze the database schema and generate a visual diagram for you.

## What it does

Give it any GitHub repo with a database (SQL files, Prisma, Sequelize, Mongoose, Django models, etc.), and it'll:
- Clone the repo and scan for schema files
- Use AI to understand the database structure
- Generate an ER diagram you can view and export

## Setup

You'll need Node.js and an AI API key.

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Add your API key to the .env file
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 and you're good to go!

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind
- **Backend**: Node.js, Express, AI-powered analysis
- **Visualization**: DOT language (Graphviz) + Viz.js

## How it works

1. You paste a GitHub URL
2. Backend clones the repo and scans for database files
3. AI extracts the schema information
4. We convert it to DOT format
5. Frontend renders it as a nice diagram
6. Export as PNG, SVG, or DOT if you want

## Supported frameworks

Works with SQL files, Prisma, Sequelize, Mongoose, Django, Laravel, and Rails. Pretty much any common ORM or database setup.

## Why I built this

I got tired of manually creating ER diagrams for projects, especially when trying to understand someone else's database structure. Thought it'd be cool to automate it with AI.

---

Made with ❤️ for developers
