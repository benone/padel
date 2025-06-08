# Cloudflare Workers Deployment Guide

## Setup

1. Install dependencies:
```bash
npm install wrangler --save-dev
```

2. Login to Cloudflare:
```bash
npx wrangler login
```

3. Test locally:
```bash
npx wrangler dev
```

## Deploy

### Development environment:
```bash
npx wrangler deploy --env development
```

### Production environment:
```bash
npx wrangler deploy --env production
```

## Configuration

The `wrangler.toml` file contains the configuration for your Workers deployment.

### Environment Variables

Add secrets using:
```bash
npx wrangler secret put API_KEY
```

## Limitations

This Cloudflare Workers version has some limitations compared to the Express.js version:

1. **No file system access** - Static images are redirected to placeholder services
2. **No Runware API** - AI image generation is not available
3. **Simplified caching** - Uses Workers KV or Cache API instead of file-based caching
4. **No AsyncStorage** - State is not persisted between requests

## API Endpoints

All endpoints from the original Express server are available with the same paths:

- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/clubs/*` - Club information
- `/api/matches/*` - Match management
- `/api/bookings/*` - Booking system

## Static Images

Static images are handled differently in Workers:
- Images redirect to placeholder services
- For production, consider using Cloudflare Images or R2 storage

## Testing

Test the deployment:
```bash
curl https://your-worker.workers.dev/api/health
```

## Monitoring

View logs:
```bash
npx wrangler tail
```