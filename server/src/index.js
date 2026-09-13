const express = require('express');
const cors = require('cors');
const path = require('path');
const { calculateDeflames } = require('./algorithm');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DEFLAMES API', time: new Date().toISOString() });
});

// Main DEFLAMES Analysis Endpoint
app.post('/api/deflames', (req, res) => {
  try {
    const { name1, name2, answers, mode = 'relationship' } = req.body;

    if (!name1 || !name2) {
      return res.status(400).json({
        error: 'Both name1 and name2 are required.'
      });
    }

    const result = calculateDeflames({
      name1: String(name1),
      name2: String(name2),
      answers: answers || {},
      mode
    });

    res.json(result);
  } catch (err) {
    console.error('Error processing DEFLAMES request:', err);
    res.status(500).json({ error: 'Failed to compute DEFLAMES analysis.' });
  }
});

// What-If Simulation Endpoint for live dimension slider adjustments
app.post('/api/deflames/what-if', (req, res) => {
  try {
    const { name1, name2, dimensions, mode = 'relationship' } = req.body;

    if (!name1 || !name2 || !dimensions) {
      return res.status(400).json({
        error: 'name1, name2, and dimensions object {C, T, I, F, G, K} are required.'
      });
    }

    const result = calculateDeflames({
      name1: String(name1),
      name2: String(name2),
      answers: dimensions,
      mode
    });

    res.json(result);
  } catch (err) {
    console.error('Error processing What-If simulation:', err);
    res.status(500).json({ error: 'Failed to recalculate simulation.' });
  }
});

// Serve frontend build in production if available
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('DEFLAMES API is running. Frontend dev server is on port 5173.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🔥 DEFLAMES backend running on http://localhost:${PORT}`);
});
