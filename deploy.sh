#!/bin/bash

# Password Generator - Vercel Deployment Script
echo "🚀 Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "Your Password Generator is now live on Vercel!"
    else
        echo "❌ Deployment failed. Please check the errors above."
        exit 1
    fi
else
    echo "❌ Build failed. Please fix the errors above before deploying."
    exit 1
fi
