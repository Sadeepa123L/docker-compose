const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Configure MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'db',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Sadeepa@2003',
  database: process.env.MYSQL_DATABASE || 'mydb',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database table and insert dummy data
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text VARCHAR(255) NOT NULL
      );
    `);
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM messages');
    if (rows[0].count === 0) {
      await pool.query("INSERT INTO messages (text) VALUES ('Hello from MySQL Database!')");
    }
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database, retrying in 5 seconds...', err.message);
    setTimeout(initDb, 5000);
  }
};

// Start initialization logic a bit after startup to give DB time to boot
setTimeout(initDb, 3000);

// Simple API endpoint
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM messages');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});
