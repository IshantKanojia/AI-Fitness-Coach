import React, { useState, useRef, useEffect } from 'react';
import { playlists } from '../../constants/music';

const MusicPlayer: React.FC = () => {
    const [currentPlaylist, setCurrentPlaylist] = useState(playlists[0]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentTrack = currentPlaylist.tracks[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Effect to handle playback when the track changes
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            // When the track changes (via src), and we are in a playing state,
            // command the audio element to play the new track.
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio play failed on track change:", error);
                    // If autoplay fails, update the UI to reflect the paused state.
                    setIsPlaying(false);
                });
            }
        }
    }, [currentTrack.src]); // Re-run this effect when the audio source changes

    const togglePlayPause = () => {
        const wasPlaying = isPlaying;
        setIsPlaying(!wasPlaying);
        
        if (audioRef.current) {
            if (wasPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    console.error("Audio play failed on toggle:", error);
                    // If play fails, revert the state.
                    setIsPlaying(false);
                });
            }
        }
    };
    
    const playNext = () => {
        const newIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
        setCurrentTrackIndex(newIndex);
    };

    const playPrev = () => {
        const newIndex = (currentTrackIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
        setCurrentTrackIndex(newIndex);
    };

    const handlePlaylistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPlaylist = playlists.find(p => p.name === e.target.value);
        if (newPlaylist) {
            setCurrentPlaylist(newPlaylist);
            setCurrentTrackIndex(0);
        }
    };
    
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl bg-surface/80 backdrop-blur-sm rounded-xl shadow-2xl p-4 z-50 border border-on-surface/10 transition-colors duration-300">
             <audio
                ref={audioRef}
                src={currentTrack.src}
                onEnded={playNext}
             />
            <div className="flex items-center justify-between gap-4">
                 <div className="flex items-center gap-3 w-1/3 overflow-hidden">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        <span>🎵</span>
                    </div>
                    <div>
                        <p className="font-bold text-on-surface truncate">{currentTrack.title}</p>
                        <p className="text-sm text-on-surface-secondary truncate">{currentTrack.artist}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <button onClick={playPrev} aria-label="Previous track" className="p-2 rounded-full hover:bg-on-surface/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"></path></svg>
                    </button>
                    <button onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} className="p-3 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110">
                        {isPlaying ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        )}
                    </button>
                    <button onClick={playNext} aria-label="Next track" className="p-2 rounded-full hover:bg-on-surface/10 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-on-surface" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6h2v12h-2zm-10.5 6L14 18V6z"></path></svg>
                    </button>
                </div>
                
                <div className="flex items-center gap-2 w-1/3">
                    <select
                        value={currentPlaylist.name}
                        onChange={handlePlaylistChange}
                        className="bg-on-surface/5 border border-on-surface/10 rounded-md px-2 py-1 text-sm text-on-surface focus:ring-primary focus:border-primary"
                        aria-label="Select playlist"
                    >
                        {playlists.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-on-surface/20 rounded-lg appearance-none cursor-pointer accent-primary"
                        aria-label="Volume control"
                    />
                </div>
            </div>
        </div>
    );
};
export default MusicPlayer;