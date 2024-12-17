require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Automatically create SQLite database file and connect
const db = new sqlite3.Database('./database/database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database');

        // Create "users" table
        db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT UNIQUE,
        video_path TEXT
      )
    `, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Users table created or already exists.');

                // Seed the database with sample user-video mappings
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
                    { first_name: 'philip', video_path: 'Christmas-Present-Philip-V2.mp4' },
                    { first_name: 'sofia', video_path: 'Christmas-Present-Sofia.mp4' }
                ];

                users.forEach(user => {
                    const query = 'INSERT OR IGNORE INTO users (first_name, video_path) VALUES (?, ?)';
                    db.run(query, [user.first_name, user.video_path], (err) => {
                        if (err) {
                            console.error('Error seeding user:', err);
                        } else {
                            console.log(`User ${user.first_name} added/verified.`);
                        }
                    });
                });
            }
        });
    }
});

// Middleware to serve static files and parse JSON requests
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// API Route to fetch video path by user's first name
app.post('/get-video', (req, res) => {
    const { firstName } = req.body;

    if (!firstName) {
        return res.status(400).json({ error: 'First name is required.' });
    }

    const query = 'SELECT video_path FROM users WHERE first_name = ?';
    db.get(query, [firstName.toLowerCase()], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'No video found for this user.' });
        }
        res.json({ videoPath: `/videos/${row.video_path}` });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
