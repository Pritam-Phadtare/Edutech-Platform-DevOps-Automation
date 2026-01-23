const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'your_mysql_username',
  password: process.env.DB_PASSWORD || 'your_mysql_password',
  database: process.env.DB_NAME || 'enquiry',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✓ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

// Create enquiries table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS enquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    course VARCHAR(100) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_course (course),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

pool.query(createTableQuery)
  .then(() => console.log('✓ Enquiries table ready'))
  .catch(err => console.error('✗ Table creation failed:', err.message));

// API Routes

// Submit enquiry
app.post('/api/enquiry', async (req, res) => {
  try {
    const { name, email, phone, course, message } = req.body;

    // Validation
    if (!name || !email || !phone || !course) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Insert into database
    const query = `
      INSERT INTO enquiries (name, email, phone, course, message)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      name,
      email,
      phone,
      course,
      message || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: {
        id: result.insertId,
        name,
        email,
        course
      }
    });

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all enquiries (optional - for admin panel)
app.get('/api/enquiries', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM enquiries ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries'
    });
  }
});

// Get single enquiry by ID (optional)
app.get('/api/enquiry/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM enquiries WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port Karuna ${PORT}`);
  console.log(`✓ API endpoint: http://Backend-Container:${PORT}/api/enquiry`);
});
