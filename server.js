import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Cloud Run
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Serve compiled static files from dist for both base path and root
app.use('/BIO-CI-Neural-Interface-Lab', express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for Single Page Application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BIO-CI Neural Interface Lab running on http://0.0.0.0:${PORT}`);
});
