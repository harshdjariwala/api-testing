const sql = require('mssql');
const express = require('express');

const app = express();
const port = 3000; // Choose a port for your application

const config = {
  user: 'sa',
  password: 'bank@Yb3S9',
  server: '103.133.122.173',
  database: 'jbkDev',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

app.get('/getMemberBySmsno', async (req, res) => {
  const smsno = req.query.smsno; // Get the 'smsno' query parameter from the request

  if (!smsno) {
    return res.status(400).send('Please provide a valid smsno parameter.');
  }

  try {
    const request = new sql.Request();
    const result = await request.query(`SELECT * FROM tblMembershipM WHERE smsno = '${smsno}'`);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDatabase();
});