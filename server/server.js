
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

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

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'AhorrAPP',
  password: 'postgres',
  port: 5432,
});

// Initialize database tables if they don't exist
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        is_fixed BOOLEAN DEFAULT FALSE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('Ingreso', 'Gasto'))
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database when server starts
initializeDatabase();

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running properly' });
});

// Route to get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
    
    // Format transactions to match the app's structure
    const transactions = result.rows.map(row => ({
      id: row.id,
      description: row.description,
      amount: row.type === 'Ingreso' ? Number(row.amount) : -Number(row.amount),
      category: row.category,
      date: row.date,
      isFixed: row.is_fixed,
      type: row.type
    }));
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Route to add a new transaction
app.post('/api/transactions', async (req, res) => {
  const { description, amount, category, date, isFixed, type } = req.body;
  
  try {
    // Store amount as positive in the database, but adjust sign based on type
    const absAmount = Math.abs(Number(amount));
    
    const result = await pool.query(
      'INSERT INTO transactions (description, amount, category, date, is_fixed, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [description, absAmount, category, date, isFixed || false, type]
    );
    
    // Format the transaction to match app structure
    const newTransaction = {
      id: result.rows[0].id,
      description: result.rows[0].description,
      amount: type === 'Ingreso' ? Number(absAmount) : -Number(absAmount),
      category: result.rows[0].category,
      date: result.rows[0].date,
      isFixed: result.rows[0].is_fixed,
      type: result.rows[0].type
    };
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Route to update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  const id = req.params.id;
  const { description, amount, category, date, isFixed, type } = req.body;
  
  try {
    // Store amount as positive in the database
    const absAmount = Math.abs(Number(amount));
    
    const result = await pool.query(
      'UPDATE transactions SET description = $1, amount = $2, category = $3, date = $4, is_fixed = $5, type = $6 WHERE id = $7 RETURNING *',
      [description, absAmount, category, date, isFixed || false, type, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Format the updated transaction
    const updatedTransaction = {
      id: result.rows[0].id,
      description: result.rows[0].description,
      amount: type === 'Ingreso' ? Number(absAmount) : -Number(absAmount),
      category: result.rows[0].category,
      date: result.rows[0].date,
      isFixed: result.rows[0].is_fixed,
      type: result.rows[0].type
    };
    
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Route to delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// WhatsApp webhook endpoint - This receives messages from the WhatsApp Business API
app.post('/api/whatsapp-webhook', async (req, res) => {
  try {
    console.log('Received WhatsApp webhook payload:', req.body);
    
    // Get the message content from the request body
    // This will depend on the actual structure of the webhook from your WhatsApp provider
    const messageText = req.body.message || '';
    
    console.log('Received WhatsApp message:', messageText);
    
    // Parse the message to extract transaction details
    // Expected format: "Tipo, Categoría, Descripción, Monto, Fecha"
    // Example: "Gasto, comida, bembos, 22.90, 4-2-25"
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
    // Join the rest as date (in case it contains commas)
    const date = messageParts.slice(4).join(',').trim();
    
    // Validate the extracted data
    if (!type || !category || !description || isNaN(amount) || !date) {
      console.log('Invalid transaction data:', { type, category, description, amount, date });
      return res.status(400).json({ 
        error: 'Invalid transaction data',
        received: { type, category, description, amount, date }
      });
    }
    
    console.log('Parsed transaction data:', { type, category, description, amount, date });
    
    // Add the transaction to database
    const absAmount = Math.abs(amount);
    const result = await pool.query(
      'INSERT INTO transactions (description, amount, category, date, type, is_fixed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [description, absAmount, category, date, type, false]
    );
    
    console.log('Transaction added successfully');
    
    // Format response as needed
    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: {
        id: result.rows[0].id,
        description,
        amount: type === 'Ingreso' ? absAmount : -absAmount,
        category,
        date,
        type
      }
    });
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to process the message' });
  }
});

// Add a direct endpoint for testing WhatsApp integration
app.post('/api/whatsapp-test', async (req, res) => {
  try {
    console.log('Received WhatsApp test request:', req.body);
    
    const { type, category, description, amount, date } = req.body;
    
    // Validate the required fields
    if (!type || !category || !description || !amount || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        expected: { type, category, description, amount, date }
      });
    }
    
    // Add the transaction to database
    const absAmount = Math.abs(Number(amount));
    const result = await pool.query(
      'INSERT INTO transactions (description, amount, category, date, type, is_fixed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [description, absAmount, type, date, type, false]
    );
    
    console.log('Test transaction added successfully');
    
    // Format response as needed
    res.status(201).json({
      message: 'Test transaction added successfully',
      transaction: {
        id: result.rows[0].id,
        description,
        amount: type === 'Ingreso' ? absAmount : -absAmount,
        category,
        date,
        type
      }
    });
  } catch (error) {
    console.error('Error processing test message:', error);
    res.status(500).json({ error: 'Failed to process the test message' });
  }
});

// Server status endpoint for connection testing
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}/api`);
  console.log(`Health check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`WhatsApp webhook endpoint: http://localhost:${PORT}/api/whatsapp-webhook`);
  console.log(`WhatsApp test endpoint: http://localhost:${PORT}/api/whatsapp-test`);
});
