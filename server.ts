import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const authAdmin = getAuth();
const dbAdmin = getFirestore();

async function createServer() {
  const app = express();
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true as true
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // API Route to send notifications
  app.post('/api/send-notification', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(idToken);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { token, title, body } = req.body;

    if (!token || typeof title !== 'string' || title.length > 100 || typeof body !== 'string' || body.length > 300) {
      return res.status(400).json({ error: 'Invalid fields' });
    }

    try {
      // Security check: verify token ownership
      const tokenDoc = await dbAdmin.collection('push_tokens').doc(decodedToken.uid).get();
      if (!tokenDoc.exists || tokenDoc.data()?.token !== token) {
        return res.status(403).json({ error: 'Forbidden' });
      }

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

  if (process.env.NODE_ENV === 'production') {
    app.use('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    app.use('*', async (req, res, next) => {
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

createServer();
