const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const users = []; // { username, passwordHash }
const models = []; // { id, title, description, owner }
const bids = {};   // modelId -> [{ bidder, amount }]

const SECRET = 'secret';

function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  try {
    const payload = jwt.verify(auth.split(' ')[1], SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'missing fields' });
  const existing = users.find(u => u.username === username);
  if (existing) return res.status(400).json({ error: 'user exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  res.json({ message: 'registered' });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});

app.post('/models', authenticate, (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const id = models.length + 1;
  models.push({ id, title, description, owner: req.user.username });
  res.json({ id });
});

app.get('/models', (req, res) => {
  res.json(models);
});

app.post('/models/:id/bid', authenticate, (req, res) => {
  const { amount } = req.body;
  const modelId = parseInt(req.params.id);
  if (!models.find(m => m.id === modelId)) return res.status(404).json({ error: 'model not found' });
  if (!amount) return res.status(400).json({ error: 'amount required' });
  if (!bids[modelId]) bids[modelId] = [];
  bids[modelId].push({ bidder: req.user.username, amount });
  res.json({ message: 'bid placed' });
});

app.get('/models/:id/bids', (req, res) => {
  const modelId = parseInt(req.params.id);
  res.json(bids[modelId] || []);
});

// placeholder payment endpoint
app.post('/models/:id/pay', authenticate, (req, res) => {
  res.json({ message: 'payment processing not implemented' });
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
