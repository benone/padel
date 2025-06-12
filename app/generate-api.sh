#!/bin/bash

# Generate API client from OpenAPI specification
# This script generates a TypeScript API client using openapi-typescript-codegen

echo "🚀 Generating API client from OpenAPI specification..."

npx openapi-typescript-codegen \
  --input /Users/kirill/Development/rails/padelstar-app/public/api-docs/openapi.json \
  --output ./api \
  --client fetch \
  --name PadelClubApi

echo "✅ API client generated successfully in ./api"
echo "📁 Generated files:"
echo "   - ./api/"
echo "   - ./api/models/"
echo "   - ./api/services/"

echo ""
echo "🔧 Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Import API client in your code:"
echo "   import { PadelClubApi } from './api';"
echo "3. Configure base URL and authentication as needed"