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

async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

function apiKeyMiddleware(req, res, next) {
  const requestApiKey = req.query.key;

  if (!requestApiKey || requestApiKey !== apiKey) {
    return res.status(401).send('Unauthorized. Invalid API key.');
  }

  next();
}

app.use(apiKeyMiddleware);
app.use(express.json());


//AddNewUser
app.post('/addNewUser', async (req, res) => {

  const sUserCode = req.query.sUserCode;
  const sFirstName = req.query.sFirstName;
  const sLastName = req.query.sLastName;
  const sAddressLine1 = req.query.sAddressLine1;
  const sAddressLine2 = req.query.sAddressLine2;
  const sCity = req.query.sCity;
  const sState = req.query.sState;
  const sPinCode = req.query.sPinCode;
  const sPhone1 = req.query.sPhone1;
  const sEmail = req.query.sEmail;
  const dtJoinDate = req.query.dtJoinDate;
  const iCreatedBy = req.query.iCreatedBy;


  if (!sUserCode || !sFirstName || !sLastName || !sAddressLine1 || !sAddressLine2 || !sCity || !sState || !sPinCode || !sPhone1 || !sEmail || !dtJoinDate || !iCreatedBy) {
    return res.status(400).send('Please provide valid parameters.');
  }

  try {
    const request = new sql.Request();
    request.input('sUserCode', sql.VarChar, sUserCode);
    request.input('sFirstName', sql.VarChar, sFirstName);
    request.input('sLastName', sql.VarChar, sLastName);
    request.input('sAddressLine1', sql.VarChar, sAddressLine1);
    request.input('sAddressLine2', sql.VarChar, sAddressLine2);
    request.input('sCity', sql.VarChar, sCity);
    request.input('sState', sql.VarChar, sState);
    request.input('sPinCode', sql.VarChar, sPinCode);
    request.input('sPhone1', sql.VarChar, sPhone1);
    request.input('sEmail', sql.VarChar, sEmail);
    request.input('dtJoinDate', sql.VarChar, dtJoinDate);
    request.input('iCreatedBy', sql.VarChar, iCreatedBy);

    const query = `EXEC uspAddNewUser @sUserCode, @sFirstName, @sLastName, @sAddressLine1, @sAddressLine2, @sCity, @sState, @sPinCode, @sPhone1, @sEmail, @dtJoinDate, @iCreatedBy`;
    
    const result = await request.query(query);
    
    res.json("User added successfully.");
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  } finally {
    sql.close();
  }
});

//assignGroupToMenus
app.post('/assignGroupToMenus', async (req, res) => {
  const bCheckState = req.query.bCheckState;
  const iMenuId = req.query.iMenuId;
  const iGroupId = req.query.iGroupId;
  const iUserId = req.query.iUserId;

  if (!bCheckState || !iMenuId || !iGroupId || !iUserId) {
    return res.status(400).send('Please provide valid parameters.');
  }

  try {
    const request = new sql.Request();
    request.input('bCheckState', sql.Int, bCheckState);
    request.input('iMenuId', sql.Int, iMenuId);
    request.input('iGroupId', sql.Int, iGroupId);
    request.input('iUserId', sql.Int, iUserId);

    const query = 'EXEC uspAssignGroupToMenus @bCheckState, @iMenuId, @iGroupId, @iUserId';

    const result = await request.query(query);
    
    res.json("Updated Successfully");
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//assignGroupToUser
app.post('/assignGroupToUser', async (req, res) => {
  const bCheckState = req.query.bCheckState;
  const iUserId = req.query.iUserId;
  const iGroupId = req.query.iGroupId;
  const iRoleUserId = req.query.iRoleUserId;

  if (!bCheckState || !iUserId || !iGroupId || !iRoleUserId) {
    return res.status(400).send('Please provide valid parameters.');
  }

  try {
    const request = new sql.Request();
    request.input('bCheckState', sql.Int, bCheckState);
    request.input('iUserId', sql.Int, iUserId);
    request.input('iGroupId', sql.Int, iGroupId);
    request.input('iRoleUserId', sql.Int, iRoleUserId);

    const query = 'EXEC uspAssignGroupToUser @bCheckState, @iUserId, @iGroupId, @iRoleUserId';

    const result = await request.query(query);

    res.json("Updated Successfully");
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//checkUserLogin
app.get('/checkUserLogin', async (req, res) => {
  const sUserCode = req.query.sUserCode;
  const sPassword = req.query.sPassword;
  const sVersionControl = req.query.sVersionControl;

  if (!sUserCode || !sPassword || !sVersionControl) {
    return res.status(400).send('Please provide a valid parameter.');
  }

  try {
    const request = new sql.Request();
    request.input('sUserCode', sql.VarChar, sUserCode);
    request.input('sPassword', sql.VarChar, sPassword);
    request.input('sVersionControl', sql.VarChar, sVersionControl);
    // Assuming iRoleUserId is an integer, adjust the type accordingly
    const result = await request.query('EXEC uspCheckUserLogin @sUserCode, @sPassword, @sVersionControl');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//getAssignedMenus
app.get('/getAssignedMenus', async (req, res) => {
  const iMenuId = req.query.iMenuId;
  const iGroupId = req.query.iGroupId;

  if (!iMenuId || !iGroupId) {
    return res.status(400).send('Please provide valid parameters.');
  }

  try {
    const request = new sql.Request();
    request.input('iMenuId', sql.Int, iMenuId);
    request.input('iGroupId', sql.Int, iGroupId);

    const query = 'EXEC uspGetAssignedMenus @iMenuId, @iGroupId';

    const result = await request.query(query);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//getMenuHeaders
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


//getMenuItems
app.get('/getMenuItems', async (req, res) => {
  const iMenuId = req.query.iMenuId;
  const iUserId = req.query.iUserId;

  if (!iMenuId || !iUserId) {
    return res.status(400).send('Please provide a valid parameter.');
  }

  try {
    const request = new sql.Request();
    request.input('iMenuId', sql.Int, iMenuId);
    request.input('iUserId', sql.Int, iUserId); // Assuming iRoleUserId is an integer, adjust the type accordingly
    const query = 'EXEC uspGetMenuItems @iMenuId, @iUserId';
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//getRoles
app.get('/getRoles', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('EXEC uspGetRoles');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});


//getSubMenuItems
app.get('/getSubMenuItems', async (req, res) => {
  const iMenuId = req.query.iMenuId;
  const iUserId = req.query.iUserId;

  if (!iMenuId && !iUserId) {
    return res.status(400).send('Please provide a valid iRoleUserId parameter.');
  }

  try {
    const request = new sql.Request();
    request.input('iMenuId', sql.Int, iMenuId);
    request.input('iUserId', sql.Int, iUserId); // Assuming iRoleUserId is an integer, adjust the type accordingly
    const result = await request.query('EXEC uspGetSubMenuItems @iMenuId, @iUserId');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//getUserRoles
app.get('/getUserRoles', async (req, res) => {
  const iRoleUserId = req.query.iRoleUserId;

  if (!iRoleUserId) {
    return res.status(400).send('Please provide a valid iRoleUserId parameter.');
  }

  try {
    const request = new sql.Request();
    request.input('iRoleUserId', sql.Int, iRoleUserId); // Assuming iRoleUserId is an integer, adjust the type accordingly
    const result = await request.query('EXEC uspGetUserRoles @iRoleUserId');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//getUsers
app.get('/getUsers', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('EXEC uspGetUsers');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//getUsersName
app.get('/getUsersName', async (req, res) => {
  const iId = req.query.iId;

  if (!iId) {
    return res.status(400).send('Please provide a valid iRoleUserId parameter.');
  }

  try {
    const request = new sql.Request();
    request.input('iId', sql.Int, iId);
    // Assuming iRoleUserId is an integer, adjust the type accordingly
    const result = await request.query('EXEC uspGetUsersName @iId');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//searchUserEmail
app.get('/searchUserEmail', async (req, res) => {
  const sUserCode = req.query.sUserCode;

  if (!sUserCode) {
    return res.status(400).send('Please provide a valid parameter.');
  }

  try {
    const request = new sql.Request();
    request.input('sUserCode', sql.VarChar, sUserCode);
    // Assuming iRoleUserId is an integer, adjust the type accordingly
    const result = await request.query('EXEC uspSearchUserEmail @sUserCode');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  }
});

//setPassword
app.put('/setPassword', async (req, res) => {

  const sUserCode = req.query.sUserCode;
  const sPassword = req.query.sPassword;


  if (!sUserCode || !sPassword) {
    return res.status(400).send('Please provide valid parameters.');
  }

  try {
    const request = new sql.Request();
    request.input('sUserCode', sql.VarChar, sUserCode);
    request.input('sPassword', sql.VarChar, sPassword);
   

    const query = `EXEC uspSetPassword @sUserCode, @sPassword`;
    
    const result = await request.query(query);
    
    res.json("User added successfully.");
  } catch (err) {
    console.error('Error executing SQL query:', err);
    res.status(500).send('Error executing SQL query.');
  } finally {
    sql.close();
  }
});


const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToDatabase();
});

const gracefulShutdown = () => {
  server.close(() => {
    console.log('Server has been closed');
    sql.close().then(() => {
      console.log('Database connection pool has been closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);