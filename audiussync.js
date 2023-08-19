const express = require('express');
const https = require('https');
const fs = require('fs');
const fetch = require('fetch');
const cors = require('cors');
const { sdk } = require("@audius/sdk"); // Use require for the SDK import

const allowedOrigins = ['http://localhost:3000', 'https://binaramics.com'];

const app = express();
app.use(express.json());
const port = process.env.PORT || 7171;

const songQueue = [];

const audiusSdk = sdk({
  apiKey: "APIKEYHERE",
  apiSecret: "SECRETHERE",
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

const options = {
  key: fs.readFileSync('/home/privkey.pem'), //use your own ssl keys
  cert: fs.readFileSync('/home/cert.pem'),
};

app.post('/getInfoByTrackId', async (req, res) => {
  try {
    const { trackId } = req.body;
    
    if(trackId !== null) {
    const { data: track } = await audiusSdk.tracks.getTrack({
      trackId: trackId,
    });

    if (!track) {
      res.status(404).json({ error: 'Track not found' });
      return;
    }

    res.status(200).json({ track });
  }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getCurrentSongLink', async (req, res) => {
  try {
    const upcomingSongId = songQueue[0];

    if (!upcomingSongId) {
      res.status(404).json({ error: 'No upcoming songs in the queue' });
      return;
    }
    
    const url = await audiusSdk.tracks.streamTrack({
      trackId: upcomingSongId,
    });
    
    res.status(200).json({ success: url });
  } catch (err) {
    console.error('Error getting upcoming song link current:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUpcomingSongLink', async (req, res) => {
  try {
    const upcomingSongId = songQueue[1];

    if (!upcomingSongId) {
      res.status(404).json({ error: 'No upcoming songs in the queue' });
      return;
    }
    
    const url = await audiusSdk.tracks.streamTrack({
      trackId: upcomingSongId,
    });
    
    res.status(200).json({ success: url });
  } catch (err) {
    console.error('Error getting upcoming song link', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/newSongRequest', async (req, res) => {
  try {
    const { trackId } = req.body;

    const { data: track } = await audiusSdk.tracks.getTrack({
      trackId: trackId,
    });

    if (track !== null) {
      songQueue.push(trackId);

      if (songQueue.length > 2) {
        songQueue.shift();
      }

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid track ID' });
    }
  } catch (err) {
    console.error('Error adding new song to queue:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getUpcomingSongDetails', async (req, res) => {
  try {
    const currentSongId = songQueue[1];

    if (!currentSongId) {
      res.status(404).json({ error: 'No songs in the queue' });
      return;
    }
    
    const { data: track } = await audiusSdk.tracks.getTrack({
      trackId: currentSongId,
    });
    
    res.status(200).json({ track });
  } catch (err) {
    console.error('Error getting current song:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getCurrentSongDetails', async (req, res) => {
  try {
    const currentSongId = songQueue[0];

    if (!currentSongId) {
      res.status(404).json({ error: 'No songs in the queue' });
      return;
    }

    if(currentSongId !== null) {
    const { data: track } = await audiusSdk.tracks.getTrack({
      trackId: currentSongId,
    });

    res.status(200).json({ track });
  }
  else {
    res.status(404).json({ error: 'No songs in the queue' });
  }
  } catch (err) {
    console.error('Error getting track details:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`AudiusSync API is running on port ${port}`);
});