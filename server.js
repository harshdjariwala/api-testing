const sql = require('mssql');
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const apiKey = process.env.API_KEY;

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

async function connectToDatabase() {
  try {
    await poolConnect;
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

// Middleware to check the API key
function apiKeyMiddleware(req, res, next) {
  const requestApiKey = req.query.key;

  if (!requestApiKey || requestApiKey !== apiKey) {
    return res.status(401).send('Unauthorized. Invalid API key.');
  }

  next();
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

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDatabase();
});

// Gracefully close the connection pool when the server is stopped
const gracefulShutdown = () => {
  server.close(() => {
    console.log('Server has been closed');
    pool.close().then(() => {
      console.log('Database connection pool has been closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
