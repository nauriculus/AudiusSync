# AudiusSync

- AudiusSync is a web application that allows users to sync and share their favorite tracks seamlessly with friends. Whether you're enjoying music together during a road trip or chilling at home, AudiusSync keeps everyone tuned in to the same beats.
- This project leverages the Audius SDK to integrate and play music from the Audius platform, offering a wide range of tracks for your listening pleasure.

- Desktop Version Showcase:

![Screenshot (1937)](https://github.com/nauriculus/AudiusSync/assets/24634581/714e7112-c8ca-4e22-8301-30237bbbdbd9)


Mobile Version Showcase:

![Screenshot (1943)](https://github.com/nauriculus/AudiusSync/assets/24634581/656c5ed7-3d25-43d1-89d1-f8cbf1aeef96)

> This project was developed for the Audius Track of the Solana Opos Hackathon.

## Features
- **Real-Time Sync:** Enjoy synchronized music playback across devices, ensuring you and your friends are on the same track.
- **Seamless Sharing:** Effortlessly share playlists and tracks with friends for a collaborative music experience.
- **Playback Controls:** Play, pause, and seek through tracks using intuitive controls for a smooth listening experience.
- **Upcoming Song Preview:** Get a sneak peek of the upcoming track to keep the excitement alive.
- **Queue Management:** Easily manage the song queue and add new songs to keep the music going.
- **User-Friendly Interface:** Intuitive design that's easy to navigate, making music sharing a breeze.

## Getting Started

1. Clone this repository: `git clone https://github.com/nauriculus/AudiusSync.git`
2. Install dependencies: `npm install`
3. Start the app: `npm start`
4. Access the app in your browser at `http://localhost:3000`

## API Endpoints from the RestAPI

- `/getInfoByTrackId`: Get track details by providing a track ID.
- `/getCurrentSongLink`: Get the link to the currently playing song.
- `/getUpcomingSongLink`: Get the link to the upcoming song in the queue.
- `/getUpcomingSongDetails`: Get details of the next track
- `/getCurrentSongDetails`: Get details of the current track
- `/newSongRequest`: Add a new song to the queue for playback.

## Contributors
- [Nauriculus](https://github.com/nauriculus)
