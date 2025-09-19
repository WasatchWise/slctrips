import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { DATABASE_URL } from './config';

// Configure Neon with WebSocket constructor
neonConfig.webSocketConstructor = ws;

// Set more conservative connection settings
neonConfig.poolQueryViaFetch = true;
neonConfig.useSecureWebSocket = true;

// Create pool with better connection handling
export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const db = drizzle({ client: pool, schema });