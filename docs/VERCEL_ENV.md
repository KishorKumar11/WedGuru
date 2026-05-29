# Vercel environment variables

Add these in **Vercel → WedGuru → Settings → Environment Variables**.

Enable for **Production**, **Preview**, and **Development**. Then **Redeploy**.

| Variable | Required | Notes |
|----------|----------|-------|
| `MONGODB_URI` | Yes | Atlas connection string with `/wedguru` database |
| `JWT_SECRET` | Yes | Long random string (min 32 chars). Same as local `.env` |
| `GROQ_API_KEY` | Yes | For AI Planner |
| `APP_URL` | Yes | `https://wedguru.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Yes | |
| `CLOUDINARY_API_KEY` | Yes | Server only |
| `CLOUDINARY_API_SECRET` | Yes | Server only |
| `CLOUDINARY_UPLOAD_PRESET` | Yes | `wedguru_unsigned_preset` |
| `VITE_API_URL` | Yes | `/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes | Same as cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Yes | Same as upload preset |

Without `JWT_SECRET`, login and register return **503** with a configuration error.
