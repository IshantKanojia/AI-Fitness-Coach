import { Playlist } from '../types';

export const playlists: Playlist[] = [
    {
        name: 'Electronic',
        tracks: [
            { title: 'Cyberwave', artist: 'AlexiAction', src: 'https://cdn.pixabay.com/audio/2023/04/02/audio_3c39ff9144.mp3' },
            { title: 'Lofi Chill', artist: 'BoDleasons', src: 'https://cdn.pixabay.com/audio/2022/05/27/audio_18b84932a4.mp3' },
            { title: 'Powerful Beat', artist: 'penguinmusic', src: 'https://cdn.pixabay.com/audio/2022/08/02/audio_1670492981.mp3' },
        ],
    },
    {
        name: 'Hip Hop',
        tracks: [
            { title: 'Boom Bap', artist: 'A_Project', src: 'https://cdn.pixabay.com/audio/2023/01/24/audio_b2954a10c7.mp3' },
            { title: 'The Block', artist: 'A_Project', src: 'https://cdn.pixabay.com/audio/2023/02/09/audio_24823d4493.mp3' },
            { title: 'Urban', artist: 'DS-Productions', src: 'https://cdn.pixabay.com/audio/2022/01/21/audio_eb3e46c7f0.mp3' },
        ],
    },
    {
        name: 'Rock',
        tracks: [
            { title: 'Riff', artist: 'AlexiAction', src: 'https://cdn.pixabay.com/audio/2023/05/01/audio_108b598285.mp3' },
            { title: 'Energetic', artist: 'Stock-Studio', src: 'https://cdn.pixabay.com/audio/2022/11/17/audio_732a057211.mp3' },
            { title: 'Overdrive', artist: 'AlexiAction', src: 'https://cdn.pixabay.com/audio/2023/05/01/audio_f530510842.mp3' },
        ]
    }
];