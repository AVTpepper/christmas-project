require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ** User-Video Mappings **
const userToVideoMap = {
  'adrian': 'adrian',
  'alf': 'alf',
  'dady': 'dady',
  'david': 'david',
  'evelina': 'evelina',
  'helena': 'helena',
  'henrik': 'henrik',
  'josefin': 'josefin',
  'kurt': 'kurt',
  'leona': 'leona',
  'mamma': 'mamma',
  'philip': 'philip',
  'sofia': 'sofia'
};

// ** Custom Alias Mapping **
const aliasToUserMap = {
  'shane': 'dady',       // Shane -> Dady videos
  'kathrine': 'mamma'    // Kathrine -> Mamma videos
};

// ** Serve public and videos directories **
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

app.use(express.json());

// ** API to get video for a given first name **
// Ensure filenames are lowercase before serving
app.post('/get-video', (req, res) => {
  const { firstName } = req.body;

  if (!firstName) {
    return res.status(400).json({ error: 'First name is required.' });
  }

  const normalizedFirstName = firstName.toLowerCase();

  // Check if the name is an alias
  const resolvedName = aliasToUserMap[normalizedFirstName] || normalizedFirstName;

  console.log(`Normalized Name: ${normalizedFirstName}, Resolved Name: ${resolvedName}`);

  // Get video key (e.g., "dady", "mamma")
  const videoKey = userToVideoMap[resolvedName];

  if (!videoKey) {
    return res.status(404).json({ error: 'No video found for this user.' });
  }

  // Always return lowercase filenames
  res.json({ videoKey: videoKey.toLowerCase() });
});

// ** Start the server **
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
