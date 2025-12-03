# SchemaViz Deployment Guide 🚀

This guide will help you deploy SchemaViz to production. We will deploy the **Backend to Render** and the **Frontend to Vercel**.

## 📋 Prerequisites

1. A GitHub account
2. Push your code to a GitHub repository (create a repo with two folders: `frontend` and `backend`)

---

## 🛠️ Part 1: Deploy Backend (Render)

We use Render because the backend needs to run `git` commands and store temporary files, which works better on a persistent server than serverless functions.

1. **Sign up/Login** to [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `schemaviz-backend`
   - **Root Directory**: `backend` (Important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter)

5. **Environment Variables** (Scroll down to "Environment Variables"):
   Add the following keys:
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `FRONTEND_URL`: `https://your-frontend-project.vercel.app` (You'll update this after deploying frontend)
   - `PORT`: `5001` (or let Render assign one, usually 10000)

6. Click **Create Web Service**.
   - Wait for the deployment to finish.
   - **Copy the Backend URL** (e.g., `https://schemaviz-backend.onrender.com`).

---

## 🎨 Part 2: Deploy Frontend (Vercel)

1. **Sign up/Login** to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: Click "Edit" and select `frontend`.

5. **Environment Variables**:
   Add the following key:
   - `NEXT_PUBLIC_API_URL`: Paste your **Render Backend URL** here (e.g., `https://schemaviz-backend.onrender.com`)
     *Note: Do not add a trailing slash `/`*

6. Click **Deploy**.

---

## 🔗 Part 3: Final Connection

1. Once Vercel finishes deploying, copy your new **Frontend Domain** (e.g., `https://schemaviz.vercel.app`).
2. Go back to your **Render Dashboard** -> **Environment**.
3. Update the `FRONTEND_URL` variable with your actual Vercel domain.
4. **Save Changes** (Render will redeploy automatically).

## 🎉 Done!

Your SchemaViz application is now live!
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
