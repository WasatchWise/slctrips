# SLCTrips SaaS - Complete Integration Setup

## Overview
This guide sets up the complete integration for SLCTrips SaaS with all major platforms:

- **Cloudflare**: Workers, Pages, D1, R2, KV
- **Cursor**: Development environment
- **GitHub**: CI/CD, repository management
- **Vercel**: Frontend deployment
- **Supabase**: Database, Auth, Storage
- **Notion**: Content management, documentation
- **SendGrid**: Email services
- **Stripe**: Payment processing

## 1. Cloudflare Integration

### Workers Setup
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy workers
wrangler deploy
```

### D1 Database Setup
```bash
# Create D1 database
wrangler d1 create slctrips-prod
wrangler d1 create slctrips-staging

# Apply migrations
wrangler d1 execute slctrips-prod --file=./migrations/001_initial.sql
```

### R2 Storage Setup
```bash
# Create R2 buckets
wrangler r2 bucket create slctrips-assets-prod
wrangler r2 bucket create slctrips-assets-staging
```

### KV Namespaces
```bash
# Create KV namespaces
wrangler kv:namespace create "CACHE" --preview
wrangler kv:namespace create "CACHE" --preview --env staging
```

## 2. Cursor Development Environment

### Cursor Settings
```json
{
  "cursor.workspace": {
    "name": "SLCTrips SaaS",
    "folders": [
      {
        "path": "client",
        "name": "Frontend (React/Vite)"
      },
      {
        "path": "server",
        "name": "Backend (Node.js/Express)"
      },
      {
        "path": "integrations",
        "name": "Service Integrations"
      }
    ]
  },
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 3. GitHub CI/CD Setup

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test
      - run: npm run type-check

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 4. Vercel Frontend Deployment

### Vercel Configuration
```json
{
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "cd client && npm run dev",
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

## 5. Supabase Integration

### Database Schema
```sql
-- Create destinations table
CREATE TABLE destinations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  coordinates POINT,
  drive_time INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Supabase Client Setup
```typescript
// client/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 6. Notion Integration

### Notion API Setup
```typescript
// server/integrations/notion.ts
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const notionClient = notion

export async function syncDestinationsToNotion() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
  })
  return response.results
}
```

## 7. SendGrid Integration

### Email Service Setup
```typescript
// server/services/email.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const emailService = {
  async sendWelcomeEmail(userEmail: string, userName: string) {
    const msg = {
      to: userEmail,
      from: 'welcome@slctrips.com',
      subject: 'Welcome to SLC Trips!',
      templateId: 'd-welcome-template-id',
      dynamicTemplateData: {
        name: userName,
        login_url: 'https://slctrips.com/login'
      }
    }
    
    return await sgMail.send(msg)
  },

  async sendTripKitEmail(userEmail: string, tripKitName: string) {
    const msg = {
      to: userEmail,
      from: 'trips@slctrips.com',
      subject: `Your ${tripKitName} is ready!`,
      templateId: 'd-tripkit-template-id',
      dynamicTemplateData: {
        trip_kit_name: tripKitName,
        download_url: 'https://slctrips.com/download'
      }
    }
    
    return await sgMail.send(msg)
  }
}
```

## 8. Stripe Integration

### Payment Processing Setup
```typescript
// server/services/stripe.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const stripeService = {
  async createCustomer(email: string, name: string) {
    return await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'slctrips'
      }
    })
  },

  async createSubscription(customerId: string, priceId: string) {
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    })
  },

  async createCheckoutSession(priceId: string, customerEmail: string) {
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'https://slctrips.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://slctrips.com/cancel',
      customer_email: customerEmail,
    })
  }
}
```

## 9. Environment Variables

### Production Environment
```bash
# .env.production
# Database
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Cloudflare
CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
CLOUDFLARE_ACCOUNT_ID="your-cloudflare-account-id"

# Email
SENDGRID_API_KEY="your-sendgrid-api-key"
NOTIFICATION_EMAIL="notifications@slctrips.com"

# Payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Notion
NOTION_API_KEY="your-notion-api-key"
NOTION_DATABASE_ID="your-notion-database-id"

# AI Services
OPENAI_API_KEY="your-openai-api-key"

# Google APIs
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

## 10. Deployment Commands

### Deploy to Vercel
```bash
# Deploy frontend
vercel --prod

# Deploy API routes
vercel --prod --cwd server
```

### Deploy to Cloudflare
```bash
# Deploy workers
wrangler deploy

# Deploy pages
wrangler pages deploy dist --project-name=slctrips
```

## 11. Monitoring & Analytics

### Cloudflare Analytics
```html
<!-- Add to index.html -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "your-analytics-token"}'></script>
```

### Error Tracking
```typescript
// client/src/lib/error-tracking.ts
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.VITE_ENVIRONMENT,
})
```

## 12. Security Headers

### Cloudflare Security Rules
```toml
# wrangler.toml
[env.production.routes]
pattern = "api.slctrips.com/*"
zone_name = "slctrips.com"

[[env.production.routes.rules]]
type = "ESCAPE"
expression = "http.request.uri.path contains \"admin\""
action = "block"
```

This complete setup provides a robust, scalable SaaS infrastructure for SLCTrips with all major integrations configured and ready for production deployment. 