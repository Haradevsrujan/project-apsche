<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/81977259-8f7b-46da-8622-93f63c0e7568

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in `.env` to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Render

1. Sign in to Render and connect your GitHub repository.
2. Create a new Web Service.
3. Select `Docker` as the environment.
4. Set the branch to `main`.
5. Use the default service name or `project-apsche`.
6. Add the environment variable:
   - `GEMINI_API_KEY` = your Gemini API key
7. Deploy. Render will use `Dockerfile` and the port assigned by Render.

Render will automatically detect the `render.yaml` file and deploy your app on every push to `main`.
