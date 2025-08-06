import express from "express";

const app = express();
app.use(express.json());

app.get("/api/health", async (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.DANIEL_SUPABASE_ANON_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeVersion: process.version
  });
});

export default app; 