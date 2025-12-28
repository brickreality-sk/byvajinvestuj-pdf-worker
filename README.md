# PDF Worker for Railway

Node.js + Playwright service for generating PDFs from print routes.

## Deployment on Railway

1. Create new project on Railway
2. Add new service → "Deploy from GitHub repo" or "Empty Service"
3. Point to this `pdf-worker` folder
4. Set environment variables:
   - `APP_BASE_URL` = Your Lovable app URL (e.g., `https://your-app.lovable.app`)
   - `PDF_WORKER_API_KEY` = Secret key for API authentication
5. Deploy

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `APP_BASE_URL` | Base URL of the Lovable app | Preview URL |
| `PDF_WORKER_API_KEY` | API key for authentication | `dev-key` |

## Endpoints

### Health Check
```
GET /health
```

### Generate PDF
```
GET /api/pdf?template=A&reportId=...
Headers:
  x-api-key: your-api-key
```

Returns PDF file as download.

## Local Development

```bash
cd pdf-worker
npm install
npx playwright install chromium
npm start
```
