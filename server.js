require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ** User-Video Mappings **
const userToVideoMap = {
  'adrian': 'Christmas-Present-Adrian.mp4',
  'alf': 'Christmas-Present-Alf.mp4',
  'dady': 'Christmas-Present-Dady-V2.mp4',
  'david': 'Christmas-Present-David-V2.mp4',
  'evelina': 'Christmas-Present-Evelina-V2.mp4',
  'helena': 'Christmas-Present-Helena.mp4',
  'henrik': 'Christmas-Present-Henrik.mp4',
  'josefin': 'Christmas-Present-Josefin.mp4',
  'kurt': 'Christmas-Present-Kurt.mp4',
  'leona': 'Christmas-Present-Leona.mp4',
  'mamma': 'Christmas-Present-Mamma.mp4',
  'philip': 'Christmas-Present-Philip V2.mp4',
  'sofia': 'Christmas-Present-Sofia.mp4'
};

// ** Serve public and videos directories **
app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

app.use(express.json());

// ** API to get video for a given first name **
app.post('/get-video', (req, res) => {
  const { firstName } = req.body;

  if (!firstName) {
    return res.status(400).json({ error: 'First name is required.' });
  }

  const videoPath = userToVideoMap[firstName.toLowerCase()];
  if (!videoPath) {
    return res.status(404).json({ error: 'No video found for this user.' });
  }

  res.json({ videoPath: `/videos/${videoPath}` });
});

// ** Start the server **
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
