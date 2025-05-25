# Password Generator - Vercel Deployment

A React Native password generator app optimized for web deployment on Vercel.

## 🚀 Features

- Customizable password length
- Include/exclude character types (uppercase, lowercase, numbers, symbols)
- One-click copy to clipboard
- Responsive design for all devices
- Cross-platform compatibility (Web, iOS, Android, macOS)

## 📦 Deployment on Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to your Vercel account:
```bash
vercel login
```

3. Deploy from the project root:
```bash
vercel
```

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the configuration and deploy

### Option 3: Manual Deploy

1. Build the project locally:
```bash
npm install
npm run build
```

2. Deploy the `dist` folder to Vercel:
```bash
vercel --prod dist
```

## 🛠️ Development

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev:web
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Build Commands

- `npm run build` - Build for production
- `npm run dev:web` - Start development server
- `npm run preview` - Preview production build locally

## 📱 Platform Support

- **Web**: Optimized for Vercel deployment
- **iOS**: Run with `npm run ios`
- **Android**: Run with `npm run android`
- **macOS**: Native macOS support

## 🔧 Configuration

The app is configured for Vercel deployment with:

- `vercel.json` - Vercel deployment configuration
- `.vercelignore` - Files to exclude from deployment
- Optimized webpack configuration for production
- SPA routing support

## 🌐 Environment Variables

No environment variables are required for basic functionality.

## 📄 License

This project is private and not licensed for public use.
