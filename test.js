const sql = require('mssql');
const express = require('express');

const app = express();
const port = 3000; // Choose a port for your application

const config = {
  user: 'sa',
  password: 'bank@Yb3S9',
  server: '103.133.122.173',
  database: 'ERPUserDb',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const key = '1234567890123456';

let pool;

async function createPool() {
  try {
    pool = await sql.connect(config);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

function apiKeyMiddleware(req, res, next) {
  const apiKey = req.query.key;

  if (!apiKey || apiKey !== key) {
    return res.status(401).send('Unauthorized. Invalid API key.');
  }

  next(); // Move on to the next middleware or route handler if the API key is valid
}

app.use(apiKeyMiddleware);

app.get('/getMenuHeaders', async (req, res) => {
  try {
    const request = pool.request();
    const result = await request.execute('uspGetMenuHeaders');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  createPool(); // Create the connection pool when the server starts
});