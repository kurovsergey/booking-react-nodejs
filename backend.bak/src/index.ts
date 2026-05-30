import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Admin connected via WebSocket');
  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to Coworking Real-time Analytics' }));
  
  ws.on('close', () => {
    console.log('Admin disconnected');
  });
});

server.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
