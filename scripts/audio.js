import { Howl } from 'howler';

export class Audio {
    constructor() {
        this.sounds = null;
    }

    init() {
        if (this.sounds) return; // Prevent re-initialization
        this.sounds = {
            cardMatch: new Howl({ src: ['assets/audio/CardMatch1.mp3'] }),
            flip: new Howl({ src: ['assets/audio/flip1.mp3', 'assets/audio/flip2.mp3'], volume:0.3 }),
            noMatch: new Howl({ src: ['assets/audio/nomatch1.mp3'] }),
            whooshIn: new Howl({ src: ['assets/audio/whooshIn.mp3'] }),
            whooshAway: new Howl({ src: ['assets/audio/whooshAway.mp3'], volume: 0.2 }),
            music: new Howl({ src: ['assets/audio/music.mp3'], loop: true, volume: 0.5 }),
            gameOver: new Howl({ src: ['assets/audio/gameOver.mp3'], volume: 0.5 }),
            titleScreen: new Howl({ src: ['assets/audio/titleMusic.mp3'], volume: 0.5, loop: true })
        };
    }

    play(soundName) {
        return this.sounds?.[soundName]?.play() ?? 0;
    }

    stop(soundName, id) {
        this.sounds?.[soundName]?.stop(id);
    }

    destroy() {
        if (!this.sounds) return;
        Object.values(this.sounds).forEach(sound => sound.unload());
        this.sounds = null;
    }
    mute() {
        Howler.mute(true);
    }
    unmute() {
        Howler.mute(false);
    }
}