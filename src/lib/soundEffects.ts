// Sound effect player using HTML5 Audio with real animal sounds
const soundUrls = {
  dogs: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Dog_bark.ogg',
  cats: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Domestic_Cat_Meow.ogg',
  birds: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Bird_song.ogg',
  fish: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Bubbling_Water.ogg',
  rabbits: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Rabbit_eating.ogg',
  hamsters: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Mouse_squeak.ogg',
  reptiles: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Rattlesnake_hiss.ogg',
  goats: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Goat_bleating.ogg',
  horses: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Horse_neighing.ogg',
  feed: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Cat_eating_crunchy_treats.ogg',
  other: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Bird_song.ogg',
};

const audioCache: { [key: string]: HTMLAudioElement } = {};
let lastPlayedTime = 0;
let currentlyPlaying: HTMLAudioElement | null = null;

export const playCategorySound = (category: string) => {
  // Prevent sounds from firing too rapidly (debounce)
  const now = Date.now();
  if (now - lastPlayedTime < 300) return;

  try {
    const url = soundUrls[category as keyof typeof soundUrls];
    if (url) {
      if (!audioCache[category]) {
        const audio = new Audio(url);
        audio.volume = 0.5; // Set volume to 50%
        audioCache[category] = audio;
      }
      
      const audio = audioCache[category];
      
      // Stop previous playback if any
      if (currentlyPlaying && currentlyPlaying !== audio) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
      }
      
      // Stop current audio and reset to start
      audio.pause();
      audio.currentTime = 0;
      
      // Play and handle potential play() promise rejections
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          currentlyPlaying = audio;
          lastPlayedTime = Date.now();
          
          // Auto-pause long clips after 2.5 seconds to keep it snappy
          setTimeout(() => {
            if (currentlyPlaying === audio) {
              audio.pause();
              audio.currentTime = 0;
            }
          }, 2500);

        }).catch((error) => {
          console.log('Audio playback prevented (browser policy or error)', error);
        });
      }
    }
  } catch (error) {
    console.log('Sound playback not available', error);
  }
};
