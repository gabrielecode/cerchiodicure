import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

async function createServer() {
  const app = express();
  app.use(express.json());

  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      allowedHosts: true as true
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  // API Route to send notifications
  app.post('/api/send-notification', async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const message = {
        notification: { title, body },
        token: token,
      };

      const response = await getMessaging().send(message);
      res.status(200).json({ success: true, messageId: response });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  });

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const template = await vite.transformIndexHtml(url, '');
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}

createServer();
