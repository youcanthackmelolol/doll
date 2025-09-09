document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const profiles = document.querySelectorAll('.profile');
    let currentPlayingProfile = null;
    let fadeOutTimeout = null;
    const fadeDuration = 500; // 0.5 second fade for smoother transitions

    // Function to fade in audio
    const fadeIn = () => {
        if (fadeOutTimeout) {
            clearInterval(fadeOutTimeout); // Clear any pending fadeOut
            fadeOutTimeout = null;
        }
        audioPlayer.volume = 0;
        audioPlayer.play();
        let volume = 0;
        const fadeInterval = setInterval(() => {
            if (volume < 1) {
                volume += 0.05;
                if (volume > 1) volume = 1;
                audioPlayer.volume = volume;
            } else {
                clearInterval(fadeInterval);
            }
        }, fadeDuration / 20);
    };

    // Function to fade out audio
    const fadeOut = (resetTime = true) => {
        let volume = audioPlayer.volume;
        fadeOutTimeout = setInterval(() => {
            if (volume > 0) {
                volume -= 0.05;
                if (volume < 0) volume = 0;
                audioPlayer.volume = volume;
            } else {
                audioPlayer.pause();
                if (resetTime) {
                    audioPlayer.currentTime = 0; // Reset song to beginning only if specified
                }
                clearInterval(fadeOutTimeout);
                fadeOutTimeout = null;
            }
        }, fadeDuration / 20);
    };

    // Function to play a specific song
    const playSong = (songPath, profileElement) => {
        if (audioPlayer.src !== window.location.origin + '/' + songPath) {
            audioPlayer.src = songPath;
            audioPlayer.load(); // Load the new song
        }
        fadeIn();
        currentPlayingProfile = profileElement;
    };

    // Handle profile hover to play songs
    profiles.forEach(profile => {
        profile.addEventListener('mouseenter', () => {
            const songPath = profile.dataset.song;
            if (songPath) {
                // If a different profile's song is playing, pause it first
                if (currentPlayingProfile && currentPlayingProfile !== profile) {
                    fadeOut(false); // Fade out without resetting time, as a new song will play
                }
                playSong(songPath, profile);
            }
        });

        profile.addEventListener('mouseleave', () => {
            // Only pause if this profile's song is currently playing
            if (currentPlayingProfile === profile) {
                fadeOut(true); // Fade out and reset time
                currentPlayingProfile = null;
            }
        });
    });
});
