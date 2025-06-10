
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS settings to allow connections from any origin
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SQLite database connection
const dbPath = path.join(__dirname, 'ahorrapp.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize database tables if they don't exist
const initializeDatabase = async () => {
  try {
    db.run(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        is_fixed BOOLEAN DEFAULT 0,
        type TEXT NOT NULL CHECK (type IN ('Ingreso', 'Gasto'))
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Database initialized successfully');
      }
    });
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database when server starts
initializeDatabase();

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running properly', database: 'SQLite' });
});

// Route to get all transactions
app.get('/api/transactions', (req, res) => {
  db.all('SELECT * FROM transactions ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching transactions:', err.message);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
    
    // Format transactions to match the app's structure
    const transactions = rows.map(row => ({
      id: row.id,
      description: row.description,
      amount: row.type === 'Ingreso' ? Number(row.amount) : -Number(row.amount),
      category: row.category,
      date: row.date,
      isFixed: Boolean(row.is_fixed),
      type: row.type
    }));
    
    res.json(transactions);
  });
});

// Route to add a new transaction
app.post('/api/transactions', (req, res) => {
  const { description, amount, category, date, isFixed, type } = req.body;
  
  // Store amount as positive in the database, but adjust sign based on type
  const absAmount = Math.abs(Number(amount));
  
  db.run(
    'INSERT INTO transactions (description, amount, category, date, is_fixed, type) VALUES (?, ?, ?, ?, ?, ?)',
    [description, absAmount, category, date, isFixed || false, type],
    function(err) {
      if (err) {
        console.error('Error adding transaction:', err.message);
        return res.status(500).json({ error: 'Failed to add transaction' });
      }
      
      // Format the transaction to match app structure
      const newTransaction = {
        id: this.lastID,
        description: description,
        amount: type === 'Ingreso' ? Number(absAmount) : -Number(absAmount),
        category: category,
        date: date,
        isFixed: isFixed || false,
        type: type
      };
      
      res.status(201).json(newTransaction);
    }
  );
});

// Route to update a transaction
app.put('/api/transactions/:id', (req, res) => {
  const id = req.params.id;
  const { description, amount, category, date, isFixed, type } = req.body;
  
  // Store amount as positive in the database
  const absAmount = Math.abs(Number(amount));
  
  db.run(
    'UPDATE transactions SET description = ?, amount = ?, category = ?, date = ?, is_fixed = ?, type = ? WHERE id = ?',
    [description, absAmount, category, date, isFixed || false, type, id],
    function(err) {
      if (err) {
        console.error('Error updating transaction:', err.message);
        return res.status(500).json({ error: 'Failed to update transaction' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      
      // Format the updated transaction
      const updatedTransaction = {
        id: Number(id),
        description: description,
        amount: type === 'Ingreso' ? Number(absAmount) : -Number(absAmount),
        category: category,
        date: date,
        isFixed: isFixed || false,
        type: type
      };
      
      res.json(updatedTransaction);
    }
  );
});

// Route to delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM transactions WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting transaction:', err.message);
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// WhatsApp webhook endpoint
app.post('/api/whatsapp-webhook', (req, res) => {
  try {
    console.log('Received WhatsApp webhook payload:', req.body);
    
    const messageText = req.body.message || '';
    console.log('Received WhatsApp message:', messageText);
    
    // Parse the message to extract transaction details
    const messageParts = messageText.split(',').map(part => part.trim());
    
    if (messageParts.length < 5) {
      console.log('Invalid message format. Expected at least 5 parts.');
      return res.status(400).json({ 
        error: 'Invalid message format',
        expected: 'Tipo, Categoría, Descripción, Monto, Fecha'
      });
    }
    
    const type = messageParts[0] === 'Gasto' ? 'Gasto' : 'Ingreso';
    const category = messageParts[1];
    const description = messageParts[2];
    const amount = parseFloat(messageParts[3]);
    const date = messageParts.slice(4).join(',').trim();
    
    if (!type || !category || !description || isNaN(amount) || !date) {
      console.log('Invalid transaction data:', { type, category, description, amount, date });
      return res.status(400).json({ 
        error: 'Invalid transaction data',
        received: { type, category, description, amount, date }
      });
    }
    
    console.log('Parsed transaction data:', { type, category, description, amount, date });
    
    const absAmount = Math.abs(amount);
    db.run(
      'INSERT INTO transactions (description, amount, category, date, type, is_fixed) VALUES (?, ?, ?, ?, ?, ?)',
      [description, absAmount, category, date, type, false],
      function(err) {
        if (err) {
          console.error('Error adding WhatsApp transaction:', err.message);
          return res.status(500).json({ error: 'Failed to add transaction' });
        }
        
        console.log('WhatsApp transaction added successfully');
        
        res.status(201).json({
          message: 'Transaction added successfully',
          transaction: {
            id: this.lastID,
            description,
            amount: type === 'Ingreso' ? absAmount : -absAmount,
            category,
            date,
            type
          }
        });
      }
    );
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to process the message' });
  }
});

// Test endpoint for WhatsApp integration
app.post('/api/whatsapp-test', (req, res) => {
  try {
    console.log('Received WhatsApp test request:', req.body);
    
    const { type, category, description, amount, date } = req.body;
    
    if (!type || !category || !description || !amount || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        expected: { type, category, description, amount, date }
      });
    }
    
    const absAmount = Math.abs(Number(amount));
    db.run(
      'INSERT INTO transactions (description, amount, category, date, type, is_fixed) VALUES (?, ?, ?, ?, ?, ?)',
      [description, absAmount, category, date, type, false],
      function(err) {
        if (err) {
          console.error('Error adding test transaction:', err.message);
          return res.status(500).json({ error: 'Failed to add test transaction' });
        }
        
        console.log('Test transaction added successfully');
        
        res.status(201).json({
          message: 'Test transaction added successfully',
          transaction: {
            id: this.lastID,
            description,
            amount: type === 'Ingreso' ? absAmount : -absAmount,
            category,
            date,
            type
          }
        });
      }
    );
  } catch (error) {
    console.error('Error processing test message:', error);
    res.status(500).json({ error: 'Failed to process the test message' });
  }
});

// Server status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', database: 'SQLite' });
});

// Gracefully close database connection when server shuts down
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api`);
  console.log(`Health check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`WhatsApp webhook endpoint: http://localhost:${PORT}/api/whatsapp-webhook`);
  console.log(`WhatsApp test endpoint: http://localhost:${PORT}/api/whatsapp-test`);
  console.log('Database: SQLite');
});
