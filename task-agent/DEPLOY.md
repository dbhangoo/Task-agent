# Deploy Task Agent to Vercel (5 Minutes)

## Step 1: Create a GitHub Account (if you don't have one)
1. Go to https://github.com/signup
2. Follow the prompts to sign up (it's free)

## Step 2: Create a GitHub Repository
1. Go to https://github.com/new
2. Name it: `task-agent`
3. Click **Create Repository**
4. You'll see a screen with instructions

## Step 3: Upload Files to GitHub

This is the part that requires a bit of technical work. Here's the easiest way:

**Option A: Use GitHub's Web Interface (Easiest)**
1. On your new GitHub repo page, click **"Add file"** → **"Create new file"**
2. For each file listed below, create it:
   - `package.json`
   - `next.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `.env.example`
   - `pages/_app.js`
   - `pages/index.js`
   - `styles/globals.css`

3. Copy/paste the content from each file I created
4. After adding each file, click **"Commit changes"**

**Option B: Use Git (If You're Comfortable)**
```bash
# In the folder with all the files:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-agent.git
git push -u origin main
```

## Step 4: Deploy to Vercel
1. Go to https://vercel.com/new
2. Sign in with GitHub (click GitHub button)
3. Click **"Import Git Repository"**
4. Find your `task-agent` repo and click **Import**
5. Click **Deploy**
6. Wait 2-3 minutes... done! You'll get a live URL

## Step 5: Add Your API Key
1. After deployment, go to your Vercel dashboard
2. Click your `task-agent` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Name: `NEXT_PUBLIC_ANTHROPIC_API_KEY`
6. Value: [Your Anthropic API Key - get it here](https://console.anthropic.com/)
7. Click **Save**
8. Go back to **Deployments** and click **Redeploy**

## Step 6: Use on iPhone
1. Vercel gives you a URL like: `task-agent-xyz.vercel.app`
2. Open Safari on your iPhone
3. Bookmark it
4. Tap "Speak" and start capturing!

---

## Getting Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign in with your Anthropic account
3. Click **"API Keys"** in the left sidebar
4. Click **"Create Key"**
5. Copy the key (it starts with `sk-`)
6. Paste it into Vercel environment variables

---

## That's It!

Your app is now live and will work on any device with a web browser. Everything you capture saves in your browser's local storage.

Need help? Let me know!
