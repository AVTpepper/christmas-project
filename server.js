require('dotenv').config();
const express = require('express');
const path = require('path');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to PostgreSQL database using Neon
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Neon connections
});

client.connect()
  .then(() => {
    console.log('Connected to Neon PostgreSQL database');

    // Automatically create the "users" table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT UNIQUE NOT NULL,
        video_path TEXT NOT NULL
      );
    `;

    return client.query(createTableQuery);
  })
  .then(() => {
    console.log('Users table created or already exists.');

    // Seed the database with user-video mappings
    const users = [
      { first_name: 'adrian', video_path: 'Christmas-Present-Adrian.mp4' },
      { first_name: 'alf', video_path: 'Christmas-Present-Alf.mp4' },
      { first_name: 'dady', video_path: 'Christmas-Present-Dady-V2.mp4' },
      { first_name: 'david', video_path: 'Christmas-Present-David-V2.mp4' },
      { first_name: 'evelina', video_path: 'Christmas-Present-Evelina-V2.mp4' },
      { first_name: 'helena', video_path: 'Christmas-Present-Helena.mp4' },
      { first_name: 'henrik', video_path: 'Christmas-Present-Henrik.mp4' },
      { first_name: 'josefin', video_path: 'Christmas-Present-Josefin.mp4' },
      { first_name: 'kurt', video_path: 'Christmas-Present-Kurt.mp4' },
      { first_name: 'leona', video_path: 'Christmas-Present-Leona.mp4' },
      { first_name: 'mamma', video_path: 'Christmas-Present-Mamma.mp4' },
      { first_name: 'philip', video_path: 'Christmas-Present-Philip V2.mp4' },
      { first_name: 'sofia', video_path: 'Christmas-Present-Sofia.mp4' }
    ];

    users.forEach(user => {
      const query = 'INSERT INTO users (first_name, video_path) VALUES ($1, $2) ON CONFLICT (first_name) DO NOTHING';
      client.query(query, [user.first_name, user.video_path])
        .then(() => console.log(`User ${user.first_name} added/verified.`))
        .catch(err => console.error('Error seeding user:', err));
    });
  })
  .catch(err => console.error('Database error:', err));

// Serve public and videos directories
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.use(express.json());

// API route to get the video path
app.post('/get-video', (req, res) => {
  const { firstName } = req.body;

  if (!firstName) {
    return res.status(400).json({ error: 'First name is required.' });
  }

  const query = 'SELECT video_path FROM users WHERE first_name = $1';
  client.query(query, [firstName.toLowerCase()])
    .then(result => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No video found for this user.' });
      }
      res.json({ videoPath: `/videos/${result.rows[0].video_path}` });
    })
    .catch(err => {
      console.error('Error querying user:', err);
      res.status(500).json({ error: 'Internal server error.' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
