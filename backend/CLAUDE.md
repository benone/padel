# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev          # Start server with nodemon (auto-reload on changes)
npm start           # Start server in production mode

# Cloudflare Workers Deployment
npm run deploy      # Deploy to Cloudflare Workers production
npm run deploy:dev  # Deploy to development environment
npm run dev:worker  # Test Cloudflare Worker locally
npm run tail        # Monitor deployed worker logs

# Testing endpoints
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"kirill.romanov@example.com","password":"any"}'
```

## High-Level Architecture

This is a **mock backend server** for a Padel booking React Native app, providing comprehensive REST APIs for development and testing.

### Dual Deployment Model
- **Express.js Server** (`server.js`): Primary development server with full features
- **Cloudflare Workers** (`worker.js`): Edge-deployed version with some limitations (no file system, no AI image generation)

### Core Architecture Patterns

**Route Organization**: Each API domain has its own route module in `/routes/`:
- Authentication flows through middleware (`middleware/auth.js`) 
- All responses use standardized format via `utils/responseHelper.js`
- Mock data centralized in `data/mockData.js`

**Image Handling System**: Three different image services:
- `/api/images-simple/*`: AI generation via Runware API with caching
- `/api/static-images/*`: Serves local cached images
- `/api/images-mock/*`: Placeholder image service

**Authentication Flow**:
- Mock JWT-based authentication (no real validation)
- Admin user: `kirill.romanov@example.com` → `mock-token-12345`
- Token required for most endpoints via Bearer authorization

### Key Design Decisions

**Stateless Mock Data**: Server doesn't persist changes between restarts - each request gets fresh mock data. This is intentional for consistent testing.

**CORS Configuration**: Specifically configured for React Native development (ports 8081, 19006, exp://)

**Response Consistency**: Every endpoint returns the same structure:
```javascript
{
  success: boolean,
  message: string,
  data: any,
  timestamp: string
}
```

**Cloudflare Workers Deployment**: 
- Live at: https://padel-app-backend.hi-sender.workers.dev
- Uses ES modules and itty-router instead of Express
- Mock data converted to ES module exports
- No file system access - images redirect to placeholders

## Environment Configuration

Required for AI image generation:
```
RUNWARE_API_TOKEN=your_api_token_here
```

Port configuration defaults to 3000, override with PORT env variable.