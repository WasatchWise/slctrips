# Cursor IDE Setup Guide with Node.js 20

## 🎯 Overview
This guide will help you set up Cursor IDE with Node.js 20 for local development of the SLC Trips project, completely free from Replit.

## 📋 Prerequisites

### 1. Install Cursor IDE
- Download from: https://cursor.sh/
- Install for your operating system (Windows, macOS, Linux)

### 2. Install Node.js 20 LTS
Choose one of these methods:

#### Option A: Official Node.js Installer
```bash
# Download from https://nodejs.org/
# Install Node.js 20 LTS
```

#### Option B: Using nvm (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
```

#### Option C: Using Homebrew (macOS)
```bash
brew install node@20
brew link node@20
```

### 3. Install Git
```bash
# macOS (with Homebrew)
brew install git

# Ubuntu/Debian
sudo apt update && sudo apt install git

# Windows
# Download from https://git-scm.com/
```

## 🚀 Setup Steps

### 1. Clone the Repository
```bash
# Clone from GitHub
git clone https://github.com/your-username/slctrips.git
cd slctrips

# Or if you have the project locally, just navigate to it
cd /path/to/slctrips
```

### 2. Open in Cursor IDE
```bash
# Open Cursor and select "Open Folder"
# Navigate to your slctrips project folder
# Or use command line:
cursor .
```

### 3. Verify Node.js 20
```bash
# In Cursor's integrated terminal
node --version
# Should show: v20.x.x

npm --version
# Should show: 9.x.x or higher
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Set Up Environment Variables
Create a `.env` file in the project root:
```bash
# Copy from env.template
cp env.template .env
```

Edit `.env` with your actual values:
```env
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=https://your-project.supabase.co
DANIEL_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
SESSION_SECRET=your_session_secret
```

### 6. Test Environment
```bash
npm run env-check
```

### 7. Start Development Server
```bash
npm run dev
```

## 🛠️ Cursor IDE Configuration

### Recommended Extensions
Install these extensions in Cursor:
- **TypeScript and JavaScript Language Features** (built-in)
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **GitLens** - Enhanced Git features
- **Auto Rename Tag** - HTML/JSX tag renaming
- **Bracket Pair Colorizer** - Visual bracket matching

### Settings (Optional)
Add to `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## 🧪 Testing Your Setup

### 1. Environment Check
```bash
npm run env-check
# Should show: ✅ All environment variables are set!
```

### 2. Type Check
```bash
npm run type-check
# Should show no TypeScript errors
```

### 3. Linting
```bash
npm run lint
# Should show no linting errors
```

### 4. Development Server
```bash
npm run dev
# Should start both frontend and backend servers
```

### 5. Build Test
```bash
npm run build
# Should create a production build
```

## 🚀 Development Workflow

### Daily Development
1. **Start Cursor IDE**
2. **Open project folder**
3. **Start development server**: `npm run dev`
4. **Make changes** in Cursor
5. **Save files** (auto-formatting enabled)
6. **Test changes** in browser
7. **Commit changes**: `git add . && git commit -m "description"`

### Testing Scripts
```bash
# Environment check
npm run env-check

# Daily photo sync (when ready)
npm run daily-sync

# Setup cron jobs
npm run setup-cron

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔧 Troubleshooting

### Node.js Version Issues
```bash
# Check current version
node --version

# If not 20.x.x, switch versions
nvm use 20

# Or install if missing
nvm install 20
```

### Dependency Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables
```bash
# Check if .env file exists
ls -la .env

# Verify variables are loaded
npm run env-check
```

### Port Conflicts
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :5173

# Kill processes if needed
kill -9 <PID>
```

## 🎉 Success Indicators

You're ready when:
- ✅ Node.js 20 is installed and active
- ✅ All dependencies install without errors
- ✅ Environment variables are set
- ✅ Development server starts successfully
- ✅ No TypeScript or linting errors
- ✅ Frontend and backend are accessible

## 📚 Next Steps

1. **Local Development**: Start building features locally
2. **GitHub**: Push changes to repository
3. **Vercel**: Deploy to production
4. **Supabase**: Manage database
5. **Cloudflare**: Configure DNS and CDN

## 🆘 Support

If you encounter issues:
1. Check Node.js version: `node --version`
2. Verify environment variables: `npm run env-check`
3. Check for errors in Cursor's terminal
4. Review the troubleshooting section above

**Welcome to modern development with Cursor IDE and Node.js 20!** 🚀 