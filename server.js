const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPTIC_ODDS_API_KEY;
const BASE_URL = 'https://api.opticodds.com/api/v3';

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Be The Book API running' });
});

// Proxy endpoint -- passes any path through to OddsJam
app.get('/api/*', async (req, res) => {
  try {
    const path = req.params[0];
    const query = new URLSearchParams(req.query).toString();
    const url = `${BASE_URL}/${path}${query ? '?' + query : ''}`;

    const response = await fetch(url, {
      headers: { 'X-Api-Key': API_KEY }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
