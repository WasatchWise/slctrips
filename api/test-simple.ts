export default function handler(req: any, res: any) {
  res.json({
    message: "Simple API test",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
} 