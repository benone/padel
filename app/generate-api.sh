#!/bin/bash

# Generate API client from OpenAPI specification
# This script generates a TypeScript API client using openapi-generator-cli

echo "🚀 Generating API client from OpenAPI specification..."

npx openapi-generator-cli generate \
  --input-spec /Users/kirill/Development/rails/padelstar-app/public/api-docs/openapi.json \
  --generator-name typescript-fetch \
  --output ./src/api \
  --additional-properties=typescriptThreePlus=true,supportsES6=true,npmName=padel-club-api,npmVersion=1.0.0

echo "✅ API client generated successfully in ./src/api"
echo "📁 Generated files:"
echo "   - ./src/api/src/"
echo "   - ./src/api/models/"
echo "   - ./src/api/apis/"

echo ""
echo "🔧 Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Import API client in your code:"
echo "   import { DefaultApi, Configuration } from './src/api';"
echo "3. Configure base URL and authentication as needed"