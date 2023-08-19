import "./Main.css";
import Snackbar from "@material-ui/core/Snackbar";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import CheckCircleOutline from "@material-ui/icons/CheckCircleOutline";
import { useState } from 'react';

let lastFetchTime = 0;

const Main = () => {
 
  setTimeout(() => {
    fetchUpComingSongDetails();
  }, 5000);

  const vertical = "top";
  const horizontal = "center";
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentSongUrl, setCurrentSongUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [currentSongImage, setCurrentSongImage] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentSongAuthor, setCurrentSongAuthor] = useState(null);

  const [upComingSongImage, setUpComingSongImage] = useState(null);
  const [upComingTitle, setupComingTitle] = useState(null);
  const [upComingSongAuthor, setupComingSongAuthor] = useState(null);

  const [audio, setAudio] = useState(new Audio());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isRemixButtonDisabled, setIsRemixButtonDisabled] = useState(false);

  const [trackId, setTrackId] = useState('');

  const handleTogglePlayback = () => {
    if (!audio) {
      return;
    }
  
    if (isAudioPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  
    setIsAudioPlaying(!isAudioPlaying);
  };
  
  const handleRemixClick = async () => {
    if (isRemixButtonDisabled) {
      return;
    }

    setShowSuccessMessage(true);

    const title = currentTitle ||"Unknown";
    setSuccessMessage("Playing " +title);
  
    setIsRemixButtonDisabled(true);
  
    try {
      const response = await fetch('https://binaramics.com:7171/getCurrentSongLink', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data.success);
  
      if(currentSongUrl !== data.success) {
      fetchTrackDetails();
      setTimeout(() => {
        fetchUpComingSongDetails();
      }, 5000);
      setCurrentSongUrl(data.success)
     
      const newAudio = new Audio(data.success);
      newAudio.addEventListener('timeupdate', () => setCurrentTime(newAudio.currentTime));
      newAudio.addEventListener('loadedmetadata', () => {
        setDuration(newAudio.duration);
        setCurrentTime(0);
      });
  
      newAudio.addEventListener('pause', () => {
        setIsAudioPlaying(false);
        setIsRemixButtonDisabled(false);
      });
  
      newAudio.addEventListener('ended', () => {
        setIsAudioPlaying(false);
        setIsRemixButtonDisabled(false);
        getNextTrack();
        getInfoById(trackId);
        fetchTrackDetails();
        setTimeout(() => {
          fetchUpComingSongDetails();
        }, 5000);
      });
  
      // Handle playback state and play/pause
      if (isAudioPlaying) {
        newAudio.play();
        getInfoById(trackId);
      } else {
        newAudio.pause();
      }
  
      setAudio(newAudio);
    }
    } catch (error) {
      console.error('Error remixing song:', error);
      setIsRemixButtonDisabled(false);
    }
  };
  
  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleSeek = (event: any) => {
    if (audio) {
      const seekTime = (event.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  async function getInfoById(songId: any) {
    const payload = {
      trackId: songId
    };

    try {
      const response = await fetch('https://binaramics.com:7171/getInfoByTrackId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

    const data = await response.json();
    console.log(data);
    setCurrentTitle(data.track.title);
    setTrackId(data.track.id);
    setUpComingSongImage(null);
    setupComingSongAuthor(null);
    setupComingTitle(null);

    setCurrentSongAuthor(data.track.user.name);
    setCurrentSongImage(data.track.artwork?._150x150);
    
  } catch (error) {
    console.error('Error fetching track details:', error);
  }
}

  async function addNewSongtoQueue(songId: any) {
      const payload = {
        trackId: songId
      };

      try {
        const response = await fetch('https://binaramics.com:7171/newSongRequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

      const data = await response.json();
      fetchTrackDetails();
      setTimeout(() => {
        fetchUpComingSongDetails();
      }, 5000);
    } catch (error) {
      console.error('Error fetching track details:', error);
    }
  }

  async function fetchUpNewNextSongDetails() {
    try {
      // Get current time
      const currentTime = Date.now();
      
      if (currentTime - lastFetchTime >= 7000) {
        lastFetchTime = currentTime; // Update last fetch time

        const response = await fetch('https://binaramics.com:7171/getUpcomingSongDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setCurrentTitle(data.track.title);
        setTrackId(data.track.id);
        setCurrentSongAuthor(data.track.user.name);
        setCurrentSongImage(data.track.artwork?._150x150);
      }
    } catch (error) {
      console.error('Error fetching track details:', error);
    }
  }

  async function fetchUpComingSongDetails() {
    try {
      // Get current time
      const currentTime = Date.now();
      
      if (currentTime - lastFetchTime >= 7000) {
        lastFetchTime = currentTime; // Update last fetch time

        const response = await fetch('https://binaramics.com:7171/getUpcomingSongDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setTrackId(data.track.id);
        setupComingTitle(data.track.title);
        setupComingSongAuthor(data.track.user.name);
        setUpComingSongImage(data.track.artwork?._150x150);
      }
    } catch (error) {
      console.error('Error fetching track details:', error);
    }
  }

  
  const handleCloseErrorMessage = () => {
    setShowErrorMessage(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  async function fetchTrackDetails() {
    try {
      const response = await fetch('https://binaramics.com:7171/getCurrentSongDetails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (data && data.track && data.track.title && data.track.id && data.track.user && data.track.user.name) {
        setCurrentTitle(data.track.title);
        setTrackId(data.track.id);
        setCurrentSongAuthor(data.track.user.name);
        setCurrentSongImage(data.track.artwork?._150x150);
        
        setSuccessMessage("New song: " + data.track.title);
        setShowSuccessMessage(true);
      } else {
        setShowErrorMessage(true);
        setErrorMessage("No Song found... Please add a new one");
      }
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage("No Song found... Please add a new one");
    }
  }
  const handleTrackUrlChange = (event: any) => {
    setTrackId(event.target.value);
  };

  async function getNextTrack() {
    if (isRemixButtonDisabled) {
      return;
    }
  
    setIsRemixButtonDisabled(true);
  
    fetchTrackDetails();
      setTimeout(() => {
        fetchUpComingSongDetails();
      }, 5000);

    try {
      const response = await fetch('https://binaramics.com:7171/getUpcomingSongLink', {
        method: 'GET',
      });
  
      const data = await response.json();
     
      if (currentSongUrl !== data.success) {
        
        const newAudio = new Audio(data.success);
        newAudio.addEventListener('timeupdate', () => setCurrentTime(newAudio.currentTime));
        newAudio.addEventListener('loadedmetadata', () => {
          setDuration(newAudio.duration);
          setCurrentTime(0);
        });
  
        newAudio.addEventListener('pause', () => {
          setIsAudioPlaying(false);
          setIsRemixButtonDisabled(false);
        });
  
        newAudio.addEventListener('ended', () => {
          setIsAudioPlaying(false);
          setIsRemixButtonDisabled(false);
          getNextTrack(); // Load the next song once the current one ends
          fetchTrackDetails();
          setTimeout(() => {
            fetchUpComingSongDetails();
          }, 5000);
        });
  
        // Handle playback state and play/pause
        if (isAudioPlaying) {
          newAudio.play();
        } else {
          newAudio.pause();
        }
  
        setAudio(newAudio);
        setCurrentSongUrl(data.success);
        getInfoById(trackId);
        fetchUpNewNextSongDetails(); // Update upcoming song details
       
        setShowSuccessMessage(true);
        setSuccessMessage(`Fetched new track...`);
      }
    } catch (error) {
      setShowErrorMessage(true);
      setErrorMessage("No Song found... Please add a new one");
      setIsRemixButtonDisabled(false);
    }
  }


  const handleSubmit = () => {
    // Use the trackUrl value here
    if (trackId !== null && trackId !== '') {
      addNewSongtoQueue(trackId);
      setShowSuccessMessage(true);
      setSuccessMessage("Added song to queue");
    }
  };
  

  return (
    <div className="app-container">
    <div className="music-overlay">

    <Snackbar
          autoHideDuration={60000}
          anchorOrigin={{ vertical, horizontal }}
          open={showSuccessMessage}
          onClose={handleCloseSuccessMessage}
        >
          <div className="notification-success">
            <CheckCircleOutline className="m-r-sm" />
            {successMessage}
          </div>
        </Snackbar>
        <Snackbar
          autoHideDuration={60000}
          anchorOrigin={{ vertical, horizontal }}
          open={showErrorMessage}
          onClose={handleCloseErrorMessage}
        >
          <div className="notification-error">
            <ErrorOutline className="m-r-sm" />
            {errorMessage}
          </div>
        </Snackbar>

      <h1 className="heading-main">
        <img src="../icon.png" alt="Icon" className="music-icon" />
        AudiusSync
      </h1>
      <div className="controls">
        <button className="control-button" onClick={handleRemixClick}>
        ▶️ Play Current Song
          </button>
        <button className="control-button" onClick={handleTogglePlayback}>
        ⏯️ Play/Pause
        </button>

      </div>
      <div className="seek-bar-container">
        <input
          className="seek-bar"
          type="range"
          min="0"
          max="100"
          step="0.01"
          onChange={handleSeek}
          value={(currentTime / duration) * 100}
          style={{ background: `linear-gradient(to right, #ff4d4d 0%, #ff4d4d ${(currentTime / duration) * 100}%, #ccc ${(currentTime / duration) * 100}%, #ccc 100%)` }}
        />
        <div className="time-container">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="total-duration">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
    
    <div className="track-list-container">
    <div>
    <div className="current-track">
    <div className="current-track">
    <div className="track-cover">
    {isAudioPlaying && currentTitle !== null &&
    <div className="sound-waves">
       <div className="sound-wave"></div>
       <div className="sound-wave2"></div>
      <div className="sound-wave2"></div>
      <div className="sound-wave2"></div>
      <div className="sound-waves2">
      <div className="sound-wave2"></div>
     
      <div className="sound-wave2"></div>
      <div className="sound-wave"></div>
      <div className="sound-wave2"></div>
      </div>
      <div className="sound-wave"></div>
     
      <div className="sound-wave2"></div>
      <div className="sound-wave2"></div>
      <div className="sound-wave2"></div>
      <div className="sound-wave2"></div>
      <div className="sound-wave2"></div>
    </div>
    }
    <img
      src={currentSongImage! || "../placeholder.png"}
      alt="Current Track"
      className="cover-image"
    />
  </div>
    </div>
    <div className="track-info">
      <span className="track-name">{currentTitle || 'Unknown Title'}</span>
      <span className="artist-name">By - {currentSongAuthor || 'Unknown Artist'}</span>
    </div>
    </div>

    </div>
    <div className="upcoming-tracks">
        <div className="upcoming-track">
          <img
            src={upComingSongImage || "../placeholder.png"}
            alt="Upcoming Track"
            className="track-coverUpComing"
          />
          <div className="track-info">
            <span className="track-name">{upComingTitle || "Unknown Title"}</span>
            <span className="artist-name">{upComingSongAuthor ||"Unknown Artist"} </span>
          </div>
          </div>
    </div>
    </div>
  
    <div className="submit-song-container">
      <h2>Submit Song to Queue</h2>
      <input
        type="text"
        value={trackId}
        onChange={handleTrackUrlChange}
        placeholder="Enter a track ID"
        className="song-url-input"
      />
      <button onClick={handleSubmit} className="submit-button">Submit </button>
    </div>
  </div>
   
  );
}

export default Main;
