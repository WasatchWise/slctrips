const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files from client directory
app.use(express.static(path.join(__dirname, 'client')));

// Serve our test file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'static-test.html'));
});

app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    console.log('📁 Serving static files from client directory');
}); 