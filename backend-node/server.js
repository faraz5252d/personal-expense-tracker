require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Store = require('./data/store');

const transactionsRouter = require('./routes/transactions');
const categoriesRouter = require('./routes/categories');
const budgetsRouter = require('./routes/budgets');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow Vercel, localhost, and all authorized frontends
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/analytics', analyticsRouter);

// Settings endpoint
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: Store.getSettings() });
});

app.put('/api/settings', (req, res) => {
  try {
    const updated = Store.updateSettings(req.body);
    res.json({ success: true, data: updated, message: 'Settings saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Demo data reset endpoint
app.post('/api/reset', (req, res) => {
  try {
    const fresh = Store.reset();
    res.json({ success: true, message: 'Database reset to demo state', data: fresh });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check endpoint for Render / Uptime monitors
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Personal Expense Management API',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: '1.0.0'
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Personal Expense Management API</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .card { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #334155; max-width: 500px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          h1 { color: #38bdf8; margin-top: 0; }
          a { color: #60a5fa; text-decoration: none; }
          .pill { display: inline-block; background: #0284c7; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="pill">Backend Active</div>
          <h1>Expense Tracker API</h1>
          <p>Personal Expense Management System Backend is running smoothly.</p>
          <p>Explore <a href="/api/health">/api/health</a> or <a href="/api/analytics/overview">/api/analytics/overview</a></p>
        </div>
      </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker API running on http://localhost:${PORT}`);
});

module.exports = app;
