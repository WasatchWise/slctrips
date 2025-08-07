import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
} 