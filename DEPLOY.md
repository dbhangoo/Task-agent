# Deploy Task Agent to Vercel

## Step 1: Go to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" (top right)
3. Click "Continue with GitHub"
4. Authorize Vercel to access your GitHub

## Step 2: Import Your Repo
1. Click "Add New..." → "Project"
2. Find your `task-agent` repo in the list
3. Click "Import"
4. Click "Deploy"
5. Wait 2-3 minutes while it builds

## Step 3: Get Your URL
You'll see "Congratulations! Your project has been successfully deployed"
Copy the URL (looks like: task-agent-xyz.vercel.app)

## Step 4: Add Your API Key
1. In Vercel, click your project name
2. Go to "Settings" → "Environment Variables"
3. Click "Add New"
4. Name: `NEXT_PUBLIC_ANTHROPIC_API_KEY`
5. Value: Your API key from https://console.anthropic.com/api-keys
6. Click "Save"
7. Go back to "Deployments"
8. Click the three dots ⋯ on the top deployment
9. Click "Redeploy"
10. Wait 1 minute

## Step 5: Use on iPhone
1. Open Safari on your
