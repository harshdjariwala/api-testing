const sql = require('mssql');
const express = require('express');

const app = express();
const port = 3000;
const config = {
    user: 'sa',
    password: 'bank@Yb3S9',
    server: '103.133.122.173',
    database: 'userdb',
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

app.get('/checkUserLogin', async (req, res) => {
    const sUserCode = req.query.sUserCode;
    const sPassword = req.query.sPassword;
    const sVersionControl = req.query.sVersionControl;
     // Get the 'smsno' query parameter from the request
  
    if (!sUserCode && !sPassword && !sVersionControl) {
      return res.status(400).send('Please provide a valid parameter.');
    }
  
    try {
      const request = new sql.Request();
      const result = await request.query(`EXEC uspCheckUserLogin @sUserCode=${sUserCode}, @sPassword=${sPassword}, @sVersionControl=${sVersionControl}`);
      // const result = await request.query(`EXEC uspCheckUserLogin @sUserCode, @sPassword, @sVersionControl`);
     
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